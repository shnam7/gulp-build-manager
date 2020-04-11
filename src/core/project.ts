import * as upath from 'upath';
import del = require("del");

import { BuildConfig, BuildName, GBuilder, BuildSet, TaskDoneFunction, BuildSetParallel, BuildSetSeries } from "./builder";
import { RTB } from "./rtb";
import { GWatcher } from "./watcher";
import { GulpTaskFunction, gulp } from "./common";
import { is, arrayify, info, ExternalCommand, warn, exec, msg } from "../utils/utils";
import { WatcherOptions } from './watcher';
import { GBuildManager } from './buildManager';

type ResolvedType = BuildName | GulpTaskFunction;
type BuildNameSelector = string | string[] | RegExp | RegExp[];

export interface CleanOptions extends del.Options {
    clean?: string | string[];
    sync?: boolean;
}

export type BuildGroup = {
    [key: string]: BuildConfig;
}

export type ProjectOptions = {
    projectName?: string;       // optional
    prefix?: string;
    customBuilderDirs?: string | string[];
};


export class GProject {
    protected _options: ProjectOptions = { prefix: "" };
    protected _rtbs: RTB[] = [];

    protected _watcher: GWatcher = new GWatcher;
    protected _map: Map<string, BuildConfig> = new Map();
    protected _vars:any  = {};

    constructor(buildGroup: BuildGroup = {}, options: ProjectOptions = {}) {
        Object.assign(this._options, options);
        this.addBuildGroup(buildGroup);
    }

    addBuildItem(conf: BuildConfig): this {
        if (this._options.prefix) conf.buildName = this._options.prefix + conf.buildName;
        if (conf.reloadOnChange === false && conf.reloadOnFinish !== false) conf.reloadOnFinish = true;
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
            : series ? buildNames : GProject.parallel(...buildNames);

        this.addBuildItem({ buildName, triggers });
        return this;
    }

    addVars(vars: { [key: string]: any }): this {
        Object.assign(this._vars, vars);
        return this;
    }

    addWatcher(buildName = '@watch', options: WatcherOptions = {}): this {
        if (options) {
            if (options.browserSync) Object.assign(options.browserSync,
                { instanceName: this._options.prefix + buildName });
            if (options.livereload) Object.assign(options.livereload,
                { instanceName: this._options.prefix + buildName });
            let reloaders = this._watcher.reloaders.createReloaders({
                browserSync: options.browserSync,
                livereloiad: options.livereload
            });

            // add additional watch map:
            // check for pure watch: watch atrgets w/o action/task to run (just for reloading)
            if (options && options.watch) this._watcher.addWatch({
                watch: options.watch,
                task: (done) => { reloaders.reload(); info('<watcher>:reloading triggered.'); done(); },
                displayName: '<reloader>'
            });

            this._watcher.reloaders.reloadOnChange(options.reloadOnChange);
        }

        // create watch build item
        return this.addBuildItem({
            buildName: buildName,
            builder: () => { this._watcher.watch(); },
        });
    }

    addCleaner(buildName = '@clean', options: CleanOptions = {}): this {
        return this.addBuildItem({
            buildName,
            builder: (rtb) => {
                let cleanList = arrayify(options.clean);
                // console.log('=======>', this._options.prefix, this._rtbs.length)
                this._rtbs.forEach(rtb => {
                    // console.log('==>' + rtb.buildName); console.log(rtb.conf);
                    if (rtb.conf.clean) cleanList = cleanList.concat(arrayify(rtb.conf.clean))
                });

                msg('[GBM:clean]:', cleanList);
                rtb.del(cleanList, { silent: true, sync: options.sync });
            }
        });
    }

    filter(selector: BuildNameSelector): string[] {
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
        this._map.forEach(conf => this.resolveBuildSet(conf));
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
                if (conf.verbose) info(`GProject:resolve: taskName=${conf.buildName} already registered`);
                return conf.buildName;
            }

            let rtb = this.getBuilder(conf);
            let mainTask = (done: TaskDoneFunction) => rtb._build(conf).then(() => done());
            let deps = arrayify(conf.dependencies);
            let task = conf.builder ?  mainTask : undefined;
            let triggers = arrayify(conf.triggers);

            // sanity check for the final task function before calling gulp.task()
            let resolved = this.resolveBuildSet([...deps, task, ...<any>triggers]);
            if (!resolved)
                resolved = mainTask;
            else if (is.String(resolved))
                resolved = gulp.parallel(resolved);

            gulp.task(conf.buildName, <GulpTaskFunction>resolved);

            // resolve watch
            let watched = arrayify(conf.watch ? conf.watch : conf.src).concat(arrayify(conf.addWatch));
            if (watched.length > 0) {
                this._watcher.addWatch({
                    // buildName: conf.buildName,
                    watch: watched,
                    task: conf.buildName ? gulp.parallel(conf.buildName) : (done) => { done() },
                    displayName: conf.buildName,
                    reloadOnChange: conf.reloadOnChange
                });
            }

            rtb.setReloaders(this._watcher.reloaders);
            this._rtbs.push(rtb);
            GBuildManager.rtbMap.set(rtb.buildName, rtb);   // register to global rtb list
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

        // info('GProject:resolve:buildSet='); dmsg(buildSet);
        throw Error('GProject:resolve:Unknown type of buildSet');
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
        if (is.Function(builder)) return new RTB(buildItem).setBuildFunc(builder);

        // if builders is RTB or its derivatives such as GBuilder
        if (builder instanceof RTB) return builder;

        // if builder is ExternalBuilder
        if (is.Object(builder) && builder!.hasOwnProperty('command'))
            return new RTB(buildItem).setBuildFunc(() => exec(<ExternalCommand>builder));

        // if builder is not specified
        if (!builder) return new RTB(buildItem).setBuildFunc(() => {
            // dmsg(`BuildName:${buildItem.buildName}: No builder specified.`);
        });
        throw Error(`[buildName:${buildItem.buildName}]Unknown ObjectBuilder.`);
    }

    // statics
    static series(...args: BuildSet[]): BuildSetSeries { return args }
    static parallel(...args: BuildSet[]): BuildSetParallel { return { set: args } }
}
