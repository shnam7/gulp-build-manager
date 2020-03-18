import * as upath from 'upath';

import { BuildConfig, BuildName, GBuilder, BuildSet, TaskDoneFunction, BuildSetParallel, ObjectBuilders, CopyBuilder, BuildSetSeries } from "./builder";
import { RTB } from "./rtb";
import { GWatcher } from "./watcher";
import { GulpTaskFunction, gulp } from "./common";
import { is, arrayify, info, ExternalCommand, warn, exec } from "../utils/utils";
import { GCleaner, CleanerOptions } from "./cleaner";
import { WatcherOptions } from './watcher';
import { GBuildManager } from './buildManager';

export type ResolvedType = BuildName | GulpTaskFunction;
export type BuildGroup = {
    [key: string]: BuildConfig;
}

export type ProjectOptions = {
    projectName?: string;       // optional
    prefix?: string;
    customBuilderDirs?: string | string[];
};


export class GBuildProject {
    protected _map: Map<string, BuildConfig> = new Map();
    protected _resolved: ResolvedType[] = [];
    protected _options: ProjectOptions = { prefix: "" };

    protected _watcher: GWatcher = new GWatcher;
    protected _cleaner: GCleaner = new GCleaner;
    protected _vars:any  = {};

    constructor(buildGroup: BuildGroup = {}, options: ProjectOptions = {}) {
        Object.assign(this._options, options);
        this.addBuildGroup(buildGroup);
    }

    addBuildItem(conf: BuildConfig): this {
        if (this._options.prefix) conf.buildName = this._options.prefix + conf.buildName
        // this.map.set(this.options.prefix + buildKey, conf);
        this._map.set(conf.buildName, conf);
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

    addTrigger(buildName: string, selector: string | string[] | RegExp | RegExp[], series: boolean = false): this {
        let buildNames = this.filter(selector);
        let triggers = (buildNames.length === 1)
            ? buildNames[0]
            : series ? buildNames : GBuildProject.parallel(...buildNames);

        if (buildNames.length > 0)
            this.addBuildItem({ buildName, triggers });
        return this;
    }

    addVars(vars: { [key: string]: any }): this {
        Object.assign(this._vars, vars);
        return this;
    }

    addWatcher(buildName = '@watch', opts?: WatcherOptions): this {
        if (opts) {
            if (opts.browserSync) Object.assign(opts.browserSync,
                { instanceName: this._options.prefix + buildName });
            if (opts.livereload) Object.assign(opts.livereload,
                { instanceName: this._options.prefix + buildName });
            let reloaders = this._watcher.reloaders.createReloaders({
                browserSync: opts.browserSync,
                livereloiad: opts.livereload
            });

            // add additional watch map:
            // check for pure watch: watch atrgets w/o action/task to run (just for reloading)
            if (opts && opts.watch) this._watcher.addWatch({
                watch: opts.watch,
                task: (done) => { reloaders.reload(); info('<watcher>:reloading triggered.'); done(); },
                displayName: '<reloader>'
            });

            this._watcher.reloaders.reloadOnChange(opts.reloadOnChange);
        }

        // create watch build item
        return this.addBuildItem({
            buildName: buildName,
            builder: () => {
                this._watcher.watch();
            }
        });
    }

    addCleaner(buildName = '@clean', opts?: CleanerOptions): this {
        return this.addBuildItem(this._cleaner.createTask(buildName, opts));
    }

    filter(selector: string | string[] | RegExp | RegExp[]): string[] {
        let ret: string[] = [];
        arrayify(selector).forEach(sel => {
            if (is.RegExp(sel)) {
                this._map.forEach((conf) => {
                    if (sel.test(conf.buildName)) ret.push(conf.buildName)
                });
            }
            else {
                let buildNamesArray = arrayify(sel).map(buildName => buildName);
                this._map.forEach((conf) => {
                    if (buildNamesArray.includes(conf.buildName)) ret.push(conf.buildName)
                });
            }
        });
        return ret;
    }

    resolve() : this {
        this._map.forEach(conf => {
            let resolved = this.resolveBuildSet(conf);
            if (resolved) this._resolved.push(resolved);
        });
        return this;
    }

    get size() { return this._map.size; }

    get projectName() { return this._options.projectName || ""; }

    get prefix() { return this._options.prefix; }

    get vars() { return this._vars; }

    get buildNames() {
        let buildNames: string[] = [];
        this._map.forEach(conf=>{buildNames.push(conf.buildName)})
        return buildNames;
    }

    get watcher() { return this._watcher; }


    //--- internals
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
            let defaultTaskFunc = (done: TaskDoneFunction) => rtb._build(conf).then(() => done());
            let deps = arrayify(conf.dependencies);
            let task = conf.builder ?  defaultTaskFunc : undefined;
            let triggers = arrayify(conf.triggers);

            // sanity check for the final task function before calling gulp.task()
            let resolved = this.resolveBuildSet([...deps, task, ...<any>triggers]);
            if (!resolved)
                resolved = defaultTaskFunc;
            else if (is.String(resolved))
                resolved = gulp.parallel(resolved);

            gulp.task(conf.buildName, <GulpTaskFunction>resolved);

            // resolve clean targets
            if (conf.clean) this._cleaner.add(conf.clean);

            // resolve watch
            let watched = arrayify(conf.watch ? conf.watch : conf.src).concat(arrayify(conf.addWatch));
            if (watched.length > 0) {
                this._watcher.addWatch({
                    // buildName: conf.buildName,
                    watch: watched,
                    task: conf.buildName ? gulp.parallel(conf.buildName) : (done) => { done() },
                    displayName: conf.buildName
                });
            }

            rtb.setReloaders(this._watcher.reloaders);
            GBuildManager.rtbMap.set(rtb.conf.buildName, rtb);   // register to global rtb list
            return conf.buildName;
        }

        // if buildSet is BuildSetSeries: recursion
        else if (is.Array(buildSet)) {
            // strip redundant arrays
            while (buildSet.length === 1 && is.Array(buildSet[0])) buildSet = buildSet[0];

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
            // strip redundant arrays
            let set = (<BuildSetParallel>buildSet).set;
            while (set.length === 1 && is.Array(set[0])) set = set[0];

            let list = [];
            for (let bs of set) {
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
            if (this._options.customBuilderDirs) {
                let customBuildDirs = arrayify(this._options.customBuilderDirs);
                for (const dir of customBuildDirs) {
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
        if (is.Function(builder)) return new RTB(buildItem).setbuildFunc(builder);

        // if builders is RTB or its derivatives such as GBuilder
        if (builder instanceof RTB) return builder;

        // if builder is ObjectBuilder object
        if (is.Object(builder) && builder!.hasOwnProperty('command')) {
            builder = builder as ObjectBuilders;
            // if builder is CopyBuilder
            if (builder!.command == 'copy') return new RTB(buildItem).setbuildFunc((rtb: RTB) => {
                let bs: CopyBuilder = builder as CopyBuilder;
                rtb.copy(bs.target, bs.options);
            });

            // if builder is ExternalBuilder
            return new RTB(buildItem).setbuildFunc(() => exec(<ExternalCommand>builder));
        }

        // if builder is not specified
        if (!builder) return new RTB(buildItem).setbuildFunc(() => {
            // dmsg(`BuildName:${buildItem.buildName}: No builder specified.`);
        });
        throw Error(`[buildName:${buildItem.buildName}]Unknown ObjectBuilder.`);
    }

    // statics
    static series(...args: BuildSet[]): BuildSetSeries { return args }
    static parallel(...args: BuildSet[]): BuildSetParallel { return { set: args } }
}
