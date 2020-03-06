import * as upath from 'upath';

import { BuildConfig, BuildName, GBuilder, BuildSet, TaskDoneFunction, BuildSetParallel, ObjectBuilders, CopyBuilder } from "./builder";
import { RTB } from "./rtb";
import { GWatcher } from "./watcher";
import { GulpTaskFunction, gulp } from "./common";
import { is, arrayify, info, ExternalCommand, warn, exec, dmsg } from "../utils/utils";
import { GCleaner, CleanerOptions } from "./cleaner";
import { WatcherOptions } from './watcher';

export type ResolvedType = BuildName | GulpTaskFunction;
export type BuildGroup = {
    [key: string]: BuildConfig;
}

export type ProjectOptions = {
    projectName?: string;       // optional
    prefix?: string;
    customBuilderDirs?: string | string[];
};

export type TriggerOptions = {
    sync?: boolean;
    buildKey?: string;
}

//TODO
// const defaultModuleOptions: Options = {
//     sass: {
//         outputStyle: 'compact',
//         // outputStyle: 'compressed',
//         includePaths: []
//     },

//     compass: {
//         config_file: './config.rb',
//         css: 'css',
//         sass: 'assets/scss'
//     },

//     // autoprefixer: {
//     // browsers: ['last 2 versions', '> 5%']
//     // browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3']
//     // },

//     cssnano: { discardUnused: false },

//     // babel: {presets:["env"]},

//     imagemin: {
//         progressive: true,
//         optimizationLevel: 5
//     },
//     htmlPrettify: {
//         indent_char: ' ',
//         indent_size: 4
//     },

//     eslint: { "extends": "eslint:recommended", "rules": { "strict": 1 } },
// };


export class GBuildProject {
    protected map: Map<string, BuildConfig> = new Map();
    protected resolved: ResolvedType[] = [];
    options: ProjectOptions = { prefix: "" };

    watcher: GWatcher = new GWatcher;
    cleaner: GCleaner = new GCleaner;
    customBuilderDirs: string[] = [];

    constructor(buildGroup: BuildGroup = {}, options: ProjectOptions = {}) {
        Object.assign(this.options, options);
        this.customBuilderDirs = arrayify(this.options.customBuilderDirs);

        this.addBuildGroup(buildGroup);
    }

    get projectName() { return this.options.projectName || ""; }

    get buildNames() {
        let buildNames: string[] = [];
        this.map.forEach(conf=>{buildNames.push(conf.buildName)})
        return buildNames;
    }

    get size() { return this.map.size; }

    addBuildItem(conf: BuildConfig): this {
        if (this.options.prefix) conf.buildName = this.options.prefix + conf.buildName
        // this.map.set(this.options.prefix + buildKey, conf);
        this.map.set(conf.buildName, conf);
        return this;
    }

    addBuildGroup(buildGroup: BuildGroup | BuildConfig): this {
        // detect if set is single BuildConfig object, not BuildGroup
        if (buildGroup.hasOwnProperty('buildName') && is.String(buildGroup.buildName))
            this.addBuildItem(buildGroup as BuildConfig);
        else
            Object.entries(buildGroup as BuildGroup).forEach(([buildKey, conf]) => this.addBuildItem(conf));
        return this;
    }

    addWatcher(buildName = '@watch', opts?: WatcherOptions): this {
        return this.addBuildItem(this.watcher.createTask(buildName, opts));
    }

    addCleaner(buildName = '@clean', opts?: CleanerOptions) {
        return this.addBuildItem(this.cleaner.createTask(buildName, opts));
    }

    resolve() : this {
        this.map.forEach(conf => {
            let resolved = this.resolveBuildSet(conf);
            if (resolved) this.resolved.push(resolved);
        });
        return this;
    }

    get(buildName: string): BuildConfig | undefined {
        return this.map.get(this.options.prefix + buildName)
    }

    filter(selector: string | string[] | RegExp | RegExp[]): string[] {
        let ret: string[] = [];
        arrayify(selector).forEach(sel => {
            if (is.RegExp(sel)) {
                this.map.forEach((conf) => {
                    if (sel.test(conf.buildName)) ret.push(conf.buildName)
                });
            }
            else {
                let buildNamesArray = arrayify(sel).map(buildName => buildName);;
                this.map.forEach((conf) => {
                    if (buildNamesArray.includes(conf.buildName)) ret.push(conf.buildName)
                });
            }
        });
        return ret;
    }

    addTrigger(buildName: string, buildNames: string | string[], opts: TriggerOptions={}) {
        buildNames = this.filter(buildNames);
        if (buildNames.length > 0) this.addBuildItem({
            buildName: buildName,
            dependencies: opts.sync ? buildNames : GBuildProject.parallel(...buildNames)
        });
        return this;
    }

    protected resolveBuildSet(buildSet?: BuildSet): ResolvedType | void {
        if (!buildSet) return;

        // if buildSet is BuildName or GulpTaskFunction
        if (is.String(buildSet) || is.Function(buildSet))
            return buildSet as (BuildName | GulpTaskFunction);

        // if buildSet is BuildConfig
        else if (is.Object(buildSet) && buildSet.hasOwnProperty('buildName')) {
            let conf = buildSet as BuildConfig;

            // check for duplicate task registeration
            let gulpTask = gulp.task(conf.buildName);
            if (gulpTask && (gulpTask.displayName === conf.buildName)) {
                // duplicated buildName may not be error in case it was resolved multiple time due to deps or triggers
                // So, info message is displayed only when verbose mode is turned on.
                // However, it's recommended to avoid it by using buildNames in deppendencies and triggers field of BuildConfig
                // if (conf.verbose)
                info(`GBuildProject:resolve: taskName=${conf.buildName} already registered`);
                return conf.buildName;
            }

            let rtb = this.getBuilder(conf);
            let deps = arrayify(conf.dependencies);
            let task = (done: TaskDoneFunction) => rtb._build(conf).then(() => done());
            let triggers = arrayify(conf.triggers);
            gulp.task(conf.buildName, <GulpTaskFunction>this.resolveBuildSet([...deps, task, ...<any>triggers]));

            // resolve clean targets
            if (conf.clean) this.cleaner.add(conf.clean);

            // resolve watch
            let watched = arrayify(conf.watch ? conf.watch : conf.src).concat(arrayify(conf.addWatch));
            if (watched.length > 0) this.watcher.addWatch({
                buildName: conf.buildName,
                task: conf.buildName ? gulp.parallel(conf.buildName) : (done) => { done() },
                watched: watched,
                });

            rtb.reloader = this.watcher.reloader;
            return conf.buildName;
        }

        // if buildSet is BuildSetSeries: recursion
        else if (is.Array(buildSet)) {
            let list = [];
            for (let bs of buildSet) {
                let ret = this.resolveBuildSet(bs);
                if (ret) list.push(ret);
            }
            if (list.length === 0) return;
            return list.length > 1 ? gulp.series.apply(null, <any>list) : list[0];
        }

        // if buildSet is BuildSetParallel: recursion
        else if (is.Object(buildSet) && buildSet.hasOwnProperty('set')) {
            let list = [];
            for (let bs of (<BuildSetParallel>buildSet).set) {
                let ret = this.resolveBuildSet(bs);
                if (ret) list.push(ret);
            }
            if (list.length === 0) return;
            return list.length > 1 ? gulp.parallel.apply(null, <any>list) : list[0];
        }

        // info('GBuildProject:resolve:buildSet='); dmsg(buildSet);
        throw Error('GBuildProject:resolve:Unknown type of buildSet');
    }

    protected getBuilder(buildItem: BuildConfig): RTB {
        let builder = buildItem.builder;

        // if builder is GBuilderClassName
        if (is.String(builder)) {
            if (builder === 'GBuilder') return new GBuilder(buildItem);

            // try custom dir first to give a chance to overload default builder
            if (this.customBuilderDirs) {
                for (const dir of this.customBuilderDirs) {
                    // dmsg('Trying custom builders in ', dir);
                    let pathName = upath.join(process.cwd(), dir, builder);
                    try {
                        let builderClass = require(pathName);
                        return new builderClass(buildItem);
                    }
                    catch (e) {
                        if (e.code !== 'MODULE_NOT_FOUND' || e.message.indexOf(pathName) < 0) throw e;
                    }
                }
            }

            // now try builder directory, ../builders
            let pathName = upath.join(__dirname, '../builders', builder as string);
            try {
                let builderClass = require(pathName);
                return new builderClass.default(buildItem);
            }
            catch (e) {
                if (e.code !== 'MODULE_NOT_FOUND' || e.message.indexOf(pathName) < 0) throw e;
                warn(`builder '${builder}' not found:`, e);
            }
            throw Error('Builder not found: ' + builder + ', or check for modules imported from ' + builder);

        }

        // if builder is BuildFunction
        if (is.Function(builder)) return new RTB(buildItem, builder);

        // if builders is RTB or its derivatives such as GBuilder
        if (builder instanceof RTB) return builder.init(buildItem);

        // if builder is ObjectBuilder object
        if (is.Object(builder) && builder!.hasOwnProperty('command')) {
            builder = builder as ObjectBuilders;
            // if builder is CopyBuilder
            if (builder!.command == 'copy') return new RTB(buildItem, (rtb: RTB) => {
                let bs: CopyBuilder = builder as CopyBuilder;
                rtb.copy(bs.target, bs.options);
            });

            // if builder is ExternalBuilder
            return new RTB(buildItem, () => {
                return exec(<ExternalCommand>builder);
            });

            throw Error(`[buildName:${buildItem.buildName}]Unknown ObjectBuilder.`);
        }

        // if builder is not specified
        if (!builder) return new RTB(buildItem, () => {
            // dmsg(`BuildName:${buildItem.buildName}: No builder specified.`);
        });

        return new RTB();   // dummy for return type consistency
    }

    // utilities
    static series(...args: BuildSet[]) { return args }
    static parallel(...args: BuildSet[]) { return { set: args } }
}
