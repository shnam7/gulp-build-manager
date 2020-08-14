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
    constructor(buildGroup = {}, options = {}) {
        this._options = { prefix: "" };
        this._rtbs = [];
        this._reloaders = [];
        this._vars = {};
        Object.assign(this._options, options);
        this.addBuildItems(buildGroup);
    }
    addBuildItem(conf) {
        this.resolveBuildSet(conf);
        return this;
    }
    addBuildItems(items) {
        // detect if set is single BuildConfig object, not BuildGroup
        if (items.hasOwnProperty('buildName'))
            return this.addBuildItem(items);
        Object.entries(items).forEach(([key, conf]) => this.addBuildItem(conf));
        return this;
    }
    addWatcher(options = {}, buildName = '@watch') {
        const gulp = require('gulp');
        if (utils_1.is.String(options)) {
            buildName = options;
            options = {};
        }
        const opts = options; // for type assertion
        if (opts.browserSync)
            this._reloaders.push(new reloader_1.GBrowserSync(opts.browserSync));
        if (opts.livereload)
            this._reloaders.push(new reloader_1.GBrowserSync(opts.livereload));
        // create watch build item
        return this.addBuildItem({
            buildName,
            builder: (rtbWatcher) => {
                this._rtbs.forEach(rtb => {
                    this._reloaders.forEach(reloader => rtb.on('reload', (rtb, type, path, stats) => {
                        // console.log(`[${rtb.buildName}:reload]: stream=${!!rtb.stream} type=${type}, path=${path}, stats=${stats}`);
                        if (rtb.stream)
                            rtb.pipe(reloader.stream(opts));
                        else
                            reloader.reload(type == 'change' ? path : undefined);
                    }));
                    let watched = utils_1.arrayify(rtb.conf.watch ? rtb.conf.watch : rtb.conf.src).concat(utils_1.arrayify(rtb.conf.addWatch));
                    if (watched.length <= 0 || rtb.buildName.length === 0)
                        return;
                    utils_1.msg(`Watching ${rtb.buildName}: [${watched}]`);
                    let gulpWatcher = gulp.watch(watched, gulp.parallel(rtb.buildName));
                    // transfer gulp watch events to rtb
                    if (rtb.conf.reloadOnChange !== false)
                        gulpWatcher.on('all', (...args) => rtb.once('finish', () => rtb.emit('reload', rtb, ...args)));
                });
                // pure watch target
                const watched = utils_1.arrayify(opts.watch);
                if (watched.length > 0) {
                    utils_1.msg(`Watching ${rtbWatcher.buildName}: [${watched}]`);
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
    addCleaner(options = {}, buildName = '@clean') {
        if (utils_1.is.String(options)) {
            buildName = options;
            options = {};
        }
        const opts = options; // for type assertion
        return this.addBuildItem({
            buildName,
            builder: (rtb) => {
                let cleanList = utils_1.arrayify(opts.clean);
                this._rtbs.forEach(rtb => {
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
            const buildName = rtb.buildName;
            if (sel === buildName || (utils_1.is.RegExp(sel) && sel.test(buildName)))
                ret.push(buildName);
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
        if (utils_1.is.Object(buildSet) && buildSet.hasOwnProperty('buildName')) {
            let conf = buildSet;
            // check for duplicate task registeration
            let gulpTask = gulp.task(conf.buildName);
            if (gulpTask && (gulpTask.displayName === conf.buildName)) {
                // duplicated buildName may not be error in case it was resolved multiple time due to deps or triggers
                // So, info message is displayed only when verbose mode is turned on.
                // However, it's recommended to avoid it by using buildNames in deppendencies and triggers field of BuildConfig
                if (conf.verbose)
                    utils_1.info(`GProject:resolve: taskName=${conf.buildName} already registered`);
                return conf.buildName;
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
            conf.buildName = this._options.prefix + conf.buildName;
            gulp.task(conf.buildName, resolved);
            rtb.__create(conf);
            this._rtbs.push(rtb);
            buildManager_1.GBuildManager.rtbs.push(rtb); // register to global rtb list
            return conf.buildName;
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
                // dmsg(`BuildName:${buildItem.buildName}: No builder specified.`);
            });
        throw Error(`[buildName:${this._options.prefix + conf.buildName}]Unknown ObjectBuilder.`);
    }
}
exports.GProject = GProject;
