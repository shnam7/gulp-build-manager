import * as upath from 'upath';
import { BuildConfig, BuildName, GBuilder, BuildSet, TaskDoneFunction, BuildSetParallel, BuildSetSeries, parallel } from "./builder";
import { RTB, CleanOptions } from "./rtb";
import { GulpTaskFunction, gulp } from "./common";
import { is, arrayify, info, ExternalCommand, warn, exec, msg } from "../utils/utils";
import { GBuildManager } from './buildManager';
import { GReloader, ReloaderOptions, GBrowserSync } from './reloader';


export type BuildNameSelector = string | string[] | RegExp | RegExp[];

export interface WatchOptions extends ReloaderOptions {
    watch?: string | string[];      // pure watching: watched files to be reloaded on change w/o build actions
    browserSync?: ReloaderOptions;  // browserSync initializer options
    livereload?: ReloaderOptions;   // livereload initializer options
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
    protected _reloaders: GReloader[] = [];
    protected _vars:any  = {};

    constructor(buildGroup: BuildConfig | BuildGroup = {}, options: ProjectOptions = {}) {
        Object.assign(this._options, options);
        this.addBuildItems(buildGroup);
    }

    addBuildItem(conf: BuildConfig): this {
        this.resolveBuildSet(conf)
        return this;
    }

    addBuildItems(items: BuildGroup | BuildConfig): this {
        // detect if set is single BuildConfig object, not BuildGroup
        if (items.hasOwnProperty('buildName')) return this.addBuildItem(items as BuildConfig);

        Object.entries(items as BuildGroup).forEach(([key, conf]) => this.addBuildItem(conf));
        return this;
    }

    addWatcher(options: WatchOptions = {}, buildName = '@watch'): this {
        if (options.browserSync) this._reloaders.push(new GBrowserSync(options.browserSync));
        if (options.livereload) this._reloaders.push(new GBrowserSync(options.livereload));

        // create watch build item
        return this.addBuildItem({
            buildName,
            builder: (rtbWatcher) => {
                this._rtbs.forEach(rtb => {
                    this._reloaders.forEach(reloader => rtb.on('reload', (rtb, type, path, stats) => {
                        // console.log(`[${rtb.buildName}:reload]: stream=${!!rtb.stream} type=${type}, path=${path}, stats=${stats}`);
                        if (rtb.stream)
                            rtb.pipe(reloader.stream(options))
                        else
                            reloader.reload(type=='change' ? path: undefined)
                    }));

                    let watched = arrayify(rtb.conf.watch ? rtb.conf.watch : rtb.conf.src).concat(arrayify(rtb.conf.addWatch));
                    if (watched.length <= 0 || rtb.buildName.length === 0) return;
                    msg(`Watching ${rtb.buildName}: [${watched}]`);
                    let gulpWatcher = gulp.watch(watched, gulp.parallel(rtb.buildName));

                    // transfer gulp watch events to rtb
                    if (rtb.conf.reloadOnChange !== false)
                        gulpWatcher.on('all', (...args) => rtb.once('finish', () => rtb.emit('reload', rtb, ...args)));
                });

                // pure watch target
                const watched = arrayify(options.watch);
                if (watched.length > 0) {
                    msg(`Watching ${rtbWatcher.buildName}: [${watched}]`);
                    let gulpWatcher = gulp.watch(watched, (done) => done());

                    if (rtbWatcher.conf.reloadOnChange != false) {
                        gulpWatcher.on('all', (path) => {
                            this._reloaders.forEach(reloader => reloader.reload(path));
                        });
                    }
                }

                // activate reloaders
                this._reloaders.forEach(reloader => reloader.activate());
            }
        });
    }

    addCleaner(options: CleanOptions = {}, buildName = '@clean'): this {
        return this.addBuildItem({
            buildName,
            builder: (rtb) => {
                let cleanList = arrayify(options.clean);
                this._rtbs.forEach(rtb => {
                    if (rtb.conf.clean) cleanList = cleanList.concat(arrayify(rtb.conf.clean))
                });

                msg('[GBM:clean]:', cleanList);
                rtb.del(cleanList, { silent: true, sync: options.sync });
            }
        });
    }

    addVars(vars: { [key: string]: any }): this {
        Object.assign(this._vars, vars);
        return this;
    }

    getBuildNames(selector: BuildNameSelector): string[] {
        let ret: string[] = [];
        const ar = arrayify(selector);
        this.rtbs.forEach(rtb => ar.forEach(sel => {
            const buildName = rtb.buildName;
            if (sel === buildName || (is.RegExp(sel) && sel.test(buildName))) ret.push(buildName)
        }));
        return ret;
    }


    //--- accesors

    get projectName() { return this._options.projectName || ""; }

    get rtbs() { return this._rtbs; }

    get prefix() { return this._options.prefix; }

    get vars() { return this._vars; }

    get buildNames() {
        let buildNames: string[] = [];
        this.rtbs.forEach(rtb => { buildNames.push(rtb.buildName) })
        return buildNames;
    }


    //--- internals

    protected resolveBuildSet(buildSet?: BuildSet): BuildName | GulpTaskFunction | void {
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
                if (conf.verbose) info(`GProject:resolve: taskName=${conf.buildName} already registered`);
                return conf.buildName;
            }

            let rtb = this.getBuilder(conf);
            let mainTask = (done: TaskDoneFunction) => rtb.__build().then(() => done());
            let deps = arrayify(conf.dependencies);
            let task = conf.builder ?  mainTask : undefined;
            let triggers = arrayify(conf.triggers);

            // sanity check for the final task function before calling gulp.task()
            let resolved = this.resolveBuildSet([...deps, task, ...<any>triggers]);
            if (!resolved)
                resolved = mainTask;
            else if (is.String(resolved))
                resolved = gulp.parallel(resolved);

            conf.buildName = this._options.prefix + conf.buildName;
            gulp.task(conf.buildName, <GulpTaskFunction>resolved);

            rtb.__create(conf)
            this._rtbs.push(rtb);
            GBuildManager.rtbs.push(rtb);   // register to global rtb list
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

    protected getBuilder(conf: BuildConfig): RTB {
        let builder = conf.builder;

        // if builder is GBuilderClassName
        if (is.String(builder)) {
            if (builder === 'GBuilder') return new GBuilder();

            // try custom dir first to give a chance to overload default builder
            if (this._options.customBuilderDirs) {
                let customBuildDirs = arrayify(this._options.customBuilderDirs);
                for (const dir of customBuildDirs) {
                    // dmsg('Trying custom builders in ', dir);
                    let pathName = upath.join(process.cwd(), dir, builder);
                    try {
                        let builderClass = require(pathName);
                        return new builderClass(conf);
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
                return new builderClass.default(conf);
            }
            catch (e) {
                if (e.code !== 'MODULE_NOT_FOUND' || e.message.indexOf(pathName) < 0) throw e;
                warn(`builder '${builder}' not found:`, e);
            }
            throw Error('Builder not found: ' + builder + ', or check for modules imported from ' + builder);

        }

        // if builder is BuildFunction
        if (is.Function(builder)) return new RTB(builder);

        // if builders is RTB or its derivatives such as GBuilder
        if (builder instanceof RTB) return builder;

        // if builder is ExternalBuilder
        if (is.Object(builder) && builder!.hasOwnProperty('command'))
            return new RTB(() => exec(<ExternalCommand>builder));

        // if builder is not specified
        if (!builder) return new RTB(() => {
            // dmsg(`BuildName:${buildItem.buildName}: No builder specified.`);
        });
        throw Error(`[buildName:${this._options.prefix + conf.buildName}]Unknown ObjectBuilder.`);
    }
}
