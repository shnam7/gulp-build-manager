"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GProject = void 0;
const upath = require("upath");
const builder_1 = require("./builder");
const rtb_1 = require("./rtb");
const utils_1 = require("../utils/utils");
const buildManager_1 = require("./buildManager");
const reloader_1 = require("./reloader");
class GProject {
    constructor(builditems = {}, options = {}) {
        this._options = { prefix: "" };
        this._rtbs = [];
        this._reloaders = [];
        this._vars = {};
        Object.assign(this._options, options);
        this.addBuildItems(builditems);
    }
    addBuildItem(buildItem) {
        if (buildItem.builder === 'watcher')
            return this.addWatcher(buildItem);
        if (buildItem.builder === 'cleaner')
            return this.addCleaner(buildItem);
        this.resolveBuildSet(buildItem);
        return this;
    }
    addBuildItems(items) {
        // detect if items is single buildItem
        if (builder_1.GBuilder.isBuildItem(items))
            return this.addBuildItem(items);
        Object.entries(items).forEach(([key, conf]) => this.addBuildItem(conf));
        return this;
    }
    addWatcher(config = {}) {
        const gulp = require('gulp');
        const opts = utils_1.is.String(config) ? { name: config } : Object.assign({}, config);
        if (opts.browserSync)
            this._reloaders.push(new reloader_1.GBrowserSync(opts.browserSync));
        if (opts.livereload)
            this._reloaders.push(new reloader_1.GBrowserSync(opts.livereload));
        // create watch build item
        return this.addBuildItem({
            name: opts.name || '@watch',
            builder: (rtbWatcher) => {
                // watch build items
                this._rtbs.forEach(rtb => {
                    if (opts.filter) {
                        let skip = true;
                        utils_1.arrayify(opts.filter).forEach(filter => { if (rtb.name.match(filter)) {
                            skip = false;
                            return;
                        } });
                        if (skip)
                            return;
                    }
                    this._reloaders.forEach(reloader => rtb.on('reload', (rtb, type, path, stats) => {
                        // console.log(`[${rtb.name}:reload]: stream=${!!rtb.stream} type=${type}, path=${path}, stats=${stats}`);
                        if (rtb.stream)
                            rtb.pipe(reloader.stream(opts));
                        else
                            reloader.reload(type == 'change' ? path : undefined);
                    }));
                    let watched = utils_1.arrayify(rtb.conf.watch ? rtb.conf.watch : rtb.conf.src).concat(utils_1.arrayify(rtb.conf.addWatch));
                    if (watched.length <= 0 || rtb.name.length === 0)
                        return;
                    utils_1.msg(`Watching ${rtb.name}: [${watched}]`);
                    let gulpWatcher = gulp.watch(watched, gulp.parallel(rtb.name));
                    // transfer gulp watch events to rtb
                    if (rtb.conf.reloadOnChange !== false)
                        gulpWatcher.on('all', (...args) => rtb.once('finish', () => rtb.emit('reload', rtb, ...args)));
                });
                // pure watch target
                const watched = utils_1.arrayify(opts.watch);
                if (watched.length > 0) {
                    utils_1.msg(`Watching ${rtbWatcher.name}: [${watched}]`);
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
    addCleaner(config = {}) {
        const opts = utils_1.is.String(config) ? { name: config } : Object.assign({}, config);
        return this.addBuildItem({
            name: opts.name || '@clean',
            builder: (rtb) => {
                let cleanList = utils_1.arrayify(opts.clean);
                this._rtbs.forEach(rtb => {
                    if (opts.filter) {
                        let skip = true;
                        utils_1.arrayify(opts.filter).forEach(filter => { if (rtb.name.match(filter)) {
                            skip = false;
                            return;
                        } });
                        if (skip)
                            return;
                    }
                    if (rtb.conf.clean)
                        cleanList = cleanList.concat(utils_1.arrayify(rtb.conf.clean));
                });
                utils_1.msg('[GBM:clean]:', cleanList);
                rtb.del(cleanList, { silent: true, sync: opts.sync });
            }
        });
    }
    addVars(vars) {
        Object.assign(this._vars, vars);
        return this;
    }
    getBuildNames(selector) {
        let ret = [];
        const ar = utils_1.arrayify(selector);
        this.rtbs.forEach(rtb => ar.forEach(sel => {
            if (rtb.name.match(sel))
                ret.push(rtb.name);
        }));
        return ret;
    }
    //--- accesors
    get projectName() { return this._options.projectName || ""; }
    get rtbs() { return this._rtbs; }
    get prefix() { return this._options.prefix; }
    get vars() { return this._vars; }
    //--- internals
    resolveBuildSet(buildSet) {
        if (!buildSet)
            return;
        // if buildSet is BuildName or GulpTaskFunction
        if (utils_1.is.String(buildSet) || utils_1.is.Function(buildSet))
            return buildSet;
        const gulp = require('gulp');
        // if buildSet is BuildConfig
        if (builder_1.GBuilder.isBuildItem(buildSet)) {
            let conf = buildSet;
            // check for duplicate task registeration
            let gulpTask = gulp.task(conf.name);
            if (gulpTask && (gulpTask.displayName === conf.name)) {
                // duplicated build name may not be error in case it was resolved multiple time due to deps or triggers
                // So, info message is displayed only when verbose mode is turned on.
                // However, it's recommended to avoid it by using buildNames in deppendencies and triggers field of BuildConfig
                if (conf.verbose)
                    utils_1.info(`GProject:resolve: taskName=${conf.name} already registered`);
                return conf.name;
            }
            let rtb = this.getBuilder(conf);
            let mainTask = (done) => rtb.__build().then(() => done());
            let deps = utils_1.arrayify(conf.dependencies);
            let task = conf.builder ? mainTask : undefined;
            let triggers = utils_1.arrayify(conf.triggers);
            // sanity check for the final task function before calling gulp.task()
            let resolved = this.resolveBuildSet([...deps, task, ...triggers]);
            if (!resolved)
                resolved = mainTask;
            else if (utils_1.is.String(resolved))
                resolved = gulp.parallel(resolved);
            // deprecated name check
            if (!conf.name && conf.buildName) {
                conf.name = conf.buildName;
                // warn(`[GBM:${this._options.prefix + conf.name}] buildConfig.buildName is deprecated. Use buildConfig.name instead.`);
            }
            conf.name = this._options.prefix + conf.name;
            rtb.__create(conf);
            gulp.task(conf.name, resolved);
            this._rtbs.push(rtb);
            buildManager_1.GBuildManager.rtbs.push(rtb); // register to global rtb list
            return conf.name;
        }
        // if buildSet is BuildSetSeries: recursion
        else if (utils_1.is.Array(buildSet)) {
            // strip redundant arrays
            while (buildSet.length === 1 && utils_1.is.Array(buildSet[0]))
                buildSet = buildSet[0];
            let list = [];
            for (let bs of buildSet) {
                let ret = this.resolveBuildSet(bs);
                if (ret)
                    list.push(ret);
            }
            if (list.length === 0)
                return;
            return list.length > 1 ? gulp.series.apply(null, list) : list[0];
        }
        // if buildSet is BuildSetParallel: recursion
        else if (utils_1.is.Object(buildSet) && buildSet.hasOwnProperty('set')) {
            // strip redundant arrays
            let set = buildSet.set;
            while (set.length === 1 && utils_1.is.Array(set[0]))
                set = set[0];
            let list = [];
            for (let bs of set) {
                let ret = this.resolveBuildSet(bs);
                if (ret)
                    list.push(ret);
            }
            if (list.length === 0)
                return;
            return list.length > 1 ? gulp.parallel.apply(null, list) : list[0];
        }
        // info('GProject:resolve:buildSet='); dmsg(buildSet);
        throw Error('GProject:resolve:Unknown type of buildSet');
    }
    getBuilder(conf) {
        let builder = conf.builder;
        // if builder is GBuilderClassName
        if (utils_1.is.String(builder)) {
            if (builder === 'GBuilder')
                return new builder_1.GBuilder();
            // try custom dir first to give a chance to overload default builder
            if (this._options.customBuilderDirs) {
                let customBuildDirs = utils_1.arrayify(this._options.customBuilderDirs);
                for (const dir of customBuildDirs) {
                    // dmsg('Trying custom builders in ', dir);
                    let pathName = upath.join(process.cwd(), dir, builder);
                    try {
                        let builderClass = require(pathName);
                        return new builderClass(conf);
                    }
                    catch (e) {
                        if (e.code !== 'MODULE_NOT_FOUND' || e.message.indexOf(pathName) < 0)
                            throw e;
                    }
                }
            }
            // now try builder directory, ../builders
            let pathName = upath.join(__dirname, '../builders', builder);
            try {
                let builderClass = require(pathName);
                return new builderClass.default(conf);
            }
            catch (e) {
                if (e.code !== 'MODULE_NOT_FOUND' || e.message.indexOf(pathName) < 0)
                    throw e;
                utils_1.warn(`builder '${builder}' not found:`, e);
            }
            throw Error('Builder not found: ' + builder + ', or check for modules imported from ' + builder);
        }
        // if builder is BuildFunction
        if (utils_1.is.Function(builder))
            return new rtb_1.RTB(builder);
        // if builders is RTB or its derivatives such as GBuilder
        if (builder instanceof rtb_1.RTB)
            return builder;
        // if builder is ExternalBuilder
        if (utils_1.is.Object(builder) && builder.hasOwnProperty('command'))
            return new rtb_1.RTB(() => utils_1.exec(builder));
        // if builder is not specified
        if (!builder)
            return new rtb_1.RTB(() => {
                // dmsg(`BuildName:${buildItem.name}: No builder specified.`);
            });
        throw Error(`[name:${this._options.prefix + conf.name}]Unknown ObjectBuilder.`);
    }
}
exports.GProject = GProject;
