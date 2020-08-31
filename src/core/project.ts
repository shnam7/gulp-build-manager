import * as upath from 'upath';
import { BuildConfig, BuildName, GBuilder, BuildSet, TaskDoneFunction, BuildSetParallel, BuildItems, BuildNameSelector, BuildItem, CleanerConfig, WatcherConfig } from "./builder";
import { RTB, GulpTaskFunction, CleanOptions } from "./rtb";
import { is, arrayify, info, ExternalCommand, warn, exec, msg } from "../utils/utils";
import { GBuildManager } from './buildManager';
import { GReloader, GBrowserSync } from './reloader';

export type ProjectOptions = {
    projectName?: string;       // optional
    prefix?: string;
    customBuilderDirs?: string | string[];
}

export class GProject {
    protected _options: ProjectOptions = { prefix: "" };
    protected _rtbs: RTB[] = [];
    protected _reloaders: GReloader[] = [];
    protected _vars:any  = {};

    constructor(builditems: BuildItem | BuildItems = {}, options: ProjectOptions = {}) {
        Object.assign(this._options, options);
        this.addBuildItems(builditems);
    }

    addBuildItem(buildItem: BuildItem): this {
        if (buildItem.builder === 'watcher') return this.addWatcher(buildItem as WatcherConfig);
        if (buildItem.builder === 'cleaner') return this.addCleaner(buildItem as CleanerConfig);

        this.resolveBuildSet(buildItem)
        return this;
    }

    addBuildItems(items: BuildItem | BuildItems): this {
        // detect if items is single buildItem
        if (GBuilder.isBuildItem(items)) return this.addBuildItem(items as BuildItem);
        Object.entries(items as BuildItems).forEach(([key, conf]) => this.addBuildItem(conf));
        return this;
    }

    addWatcher(config: string | WatcherConfig = { builder: 'watcher' }): this {
        const gulp = require('gulp');
        const opts: WatcherConfig = is.String(config) ? { name: config, builder: 'watcher' } : Object.assign({}, config);

        if (opts.browserSync) this._reloaders.push(new GBrowserSync(opts.browserSync));
        if (opts.livereload) this._reloaders.push(new GBrowserSync(opts.livereload));

        // create watch build item
        return this.addBuildItem({
            name: opts.name || '@watch',
            builder: (rtbWatcher) => {
                // watch build items
                this._rtbs.forEach(rtb => {
                    if (opts.filter) {
                        let skip = true;
                        arrayify(opts.filter).forEach(filter => { if (rtb.name.match(filter)) { skip = false; return; } })
                        if (skip) return;
                    }

                    this._reloaders.forEach(reloader => rtb.on('reload', (rtb, type, path, stats) => {
                        // console.log(`[${rtb.name}:reload]: stream=${!!rtb.stream} type=${type}, path=${path}, stats=${stats}`);
                        if (rtb.stream)
                            rtb.pipe(reloader.stream(opts))
                        else
                            reloader.reload(type=='change' ? path: undefined)
                    }));

                    let watched = arrayify(rtb.conf.watch ? rtb.conf.watch : rtb.conf.src).concat(arrayify(rtb.conf.addWatch));
                    if (watched.length <= 0 || rtb.name.length === 0) return;
                    msg(`Watching ${rtb.name}: [${watched}]`);
                    let gulpWatcher = gulp.watch(watched, gulp.parallel(rtb.name));

                    // transfer gulp watch events to rtb
                    if (rtb.conf.reloadOnChange !== false)
                        gulpWatcher.on('all', (...args: any[]) => rtb.once('finish', () => rtb.emit('reload', rtb, ...args)));
                });

                // pure watch target
                const watched = arrayify(opts.watch);
                if (watched.length > 0) {
                    msg(`Watching ${rtbWatcher.name}: [${watched}]`);
                    let gulpWatcher = gulp.watch(watched, (done: any) => done());

                    if (rtbWatcher.conf.reloadOnChange != false) {
                        gulpWatcher.on('all', (path: string) => {
                            this._reloaders.forEach(reloader => reloader.reload(path));
                        });
                    }
                }

                // activate reloaders
                this._reloaders.forEach(reloader => reloader.activate());
            }
        });
    }

    addCleaner(config: string | CleanerConfig = { builder: 'cleaner' }): this {
        const opts: CleanerConfig = is.String(config) ? { name: config, builder: 'cleaner' } : Object.assign({}, config );

        return this.addBuildItem({
            name: opts.name || '@clean',
            builder: (rtb) => {
                let cleanList = arrayify(opts.clean);
                this._rtbs.forEach(rtb => {
                    if (opts.filter) {
                        let skip = true;
                        arrayify(opts.filter).forEach(filter => { if (rtb.name.match(filter)) { skip = false; return; } })
                        if (skip) return;
                    }

                    if (rtb.conf.clean) cleanList = cleanList.concat(arrayify(rtb.conf.clean))
                });

                msg('[GBM:clean]:', cleanList);
                rtb.del(cleanList, { silent: true, sync: opts.sync });
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
            if (rtb.name.match(sel)) ret.push(rtb.name)
        }));
        return ret;
    }


    //--- accesors

    get projectName() { return this._options.projectName || ""; }

    get rtbs() { return this._rtbs; }

    get prefix() { return this._options.prefix; }

    get vars() { return this._vars; }


    //--- internals

    protected resolveBuildSet(buildSet?: BuildSet): BuildName | GulpTaskFunction | void {
        if (!buildSet) return;

        // if buildSet is BuildName or GulpTaskFunction
        if (is.String(buildSet) || is.Function(buildSet))
            return buildSet as (BuildName | GulpTaskFunction);

        const gulp = require('gulp');
        // if buildSet is BuildConfig
        if (GBuilder.isBuildItem(buildSet)) {
            let conf = buildSet as BuildConfig;

            // check for duplicate task registeration
            let gulpTask = gulp.task(conf.name);
            if (gulpTask && (gulpTask.displayName === conf.name)) {
                // duplicated build name may not be error in case it was resolved multiple time due to deps or triggers
                // So, info message is displayed only when verbose mode is turned on.
                // However, it's recommended to avoid it by using buildNames in deppendencies and triggers field of BuildConfig
                if (conf.verbose) info(`GProject:resolve: taskName=${conf.name} already registered`);
                return conf.name;
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

            // deprecated name check
            if (!conf.name && conf.buildName) {
                conf.name = conf.buildName;
                // warn(`[GBM:${this._options.prefix + conf.name}] buildConfig.buildName is deprecated. Use buildConfig.name instead.`);
            }

            conf.name = this._options.prefix + conf.name;
            rtb.__create(conf)
            gulp.task(conf.name, <GulpTaskFunction>resolved);

            this._rtbs.push(rtb);
            GBuildManager.rtbs.push(rtb);   // register to global rtb list
            return conf.name;
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
            // dmsg(`BuildName:${buildItem.name}: No builder specified.`);
        });
        throw Error(`[name:${this._options.prefix + conf.name}]Unknown ObjectBuilder.`);
    }
}
