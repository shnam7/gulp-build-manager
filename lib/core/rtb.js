"use strict";
/**
 * class RTB - Runtime Builder
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RTB = void 0;
const upath = require("upath");
const glob = require("glob");
const del = require("del");
const buildManager_1 = require("./buildManager");
const utils_1 = require("../utils/utils");
const events_1 = require("events");
function toPromise(stream) {
    return stream ? utils_1.requireSafe('stream-to-promise')(stream) : Promise.resolve(stream);
}
//--- class RTB
// RTB event sequence: create > start > (after-src > before-dest) > finish
class RTB extends events_1.EventEmitter {
    constructor(func) {
        super();
        this._streamQ = [];
        this._promises = [];
        this._promiseSync = Promise.resolve();
        this._syncMode = false;
        this._buildFunc = () => { };
        this._conf = { name: '', buildOptions: {}, moduleOptions: {} };
        if (func)
            this._buildFunc = func;
    }
    /**----------------------------------------------------------------
     * Build sequence functions: Return value should be void or Promise
     *-----------------------------------------------------------------*/
    _execute(action) {
        if (utils_1.is.Function(action))
            return action(this);
        // if wrong argument, warn the user
        if (action)
            throw Error(`[GBM:RTB:${this.name}]BuildFunction type error. Check preBuid or postBuild props in BuildConfig.`);
    }
    build() {
        return this._buildFunc(this);
    }
    _start() {
        if (this.conf.npmInstall)
            utils_1.npm.install(this.conf.npmInstall);
        this._syncMode = false;
        this.emit('start');
        if (this._syncMode)
            console.log('RTB: Strating build in sync Mode.');
    }
    _finish() {
        this.emit('finish', this);
        this._stream = undefined;
        this._streamQ = [];
    }
    //--- internal functions to be used by friend classes: GBuildManager
    //: init RTB instance
    __create(conf) {
        Object.assign(this._conf, conf);
        this.moduleOptions = Object.assign({}, buildManager_1.GBuildManager.defaultModuleOptions, conf.moduleOptions);
        this.emit('create', this);
        return this;
    }
    //: gulp task entry point
    __build() {
        return Promise.resolve()
            .then(this._start.bind(this))
            .then(this._execute.bind(this, this.conf.preBuild))
            .then(this.build.bind(this))
            .then(this._execute.bind(this, this.conf.postBuild))
            .then(() => this._promiseSync)
            .then(() => Promise.all(this._promises))
            .then(() => { if (this.conf.flushStream)
            return toPromise(this._stream); })
            .then(this._finish.bind(this));
    }
    /**----------------------------------------------------------------
     * Build API: Returns value should be 'this'
     *----------------------------------------------------------------*/
    src(src) {
        var _a, _b, _c, _d;
        if (!src)
            src = this.conf.src;
        if (!src)
            return this;
        const mopts = this.moduleOptions;
        this._stream = utils_1.requireSafe('gulp').src(src, (_a = mopts.gulp) === null || _a === void 0 ? void 0 : _a.src);
        // check input file ordering
        if (this.conf.order && ((_b = this.conf.order) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            let order = utils_1.requireSafe('gulp-order');
            this.pipe(order(this.conf.order, mopts.order));
        }
        this.emit('after-src', this);
        // check sourceMap option
        if (this.buildOptions.sourceMap)
            this.pipe(utils_1.requireSafe('gulp-sourcemaps').init((_d = (_c = this.moduleOptions) === null || _c === void 0 ? void 0 : _c.sourcemaps) === null || _d === void 0 ? void 0 : _d.init));
        return this;
    }
    dest(path) {
        var _a;
        this.emit('before-dest', this);
        // check sourceMap option
        if (this.buildOptions.sourceMap) {
            let opts = this.moduleOptions.sourcemaps || {};
            if (!opts.dest && opts.inline !== true)
                opts.dest = '.';
            this.pipe(utils_1.requireSafe('gulp-sourcemaps').write(opts.dest, opts.write));
        }
        return this.pipe(utils_1.requireSafe('gulp').dest(path || this.conf.dest || '.', (_a = this.moduleOptions.gulp) === null || _a === void 0 ? void 0 : _a.dest));
    }
    pipe(destination, options) {
        if (this._stream)
            this._stream = this._stream.pipe(destination, options);
        return this;
    }
    chain(action) {
        return this.promise(action(this));
    }
    //--- accept function or promise
    promise(promise, sync = false) {
        if (promise instanceof Promise) {
            if (sync || this._syncMode)
                this._promiseSync = this._promiseSync.then(() => promise);
            else
                this._promises.push(promise);
        }
        else if (utils_1.is.Function(promise)) {
            if (sync || this._syncMode)
                this._promiseSync = this._promiseSync.then(promise);
            else {
                promise = promise();
                if (promise)
                    this._promises.push(promise);
            }
        }
        return this;
    }
    sync() {
        this._syncMode = true;
        return this;
    }
    async() {
        this._syncMode = true;
        return this;
    }
    wait(msec = 0, sync = false) {
        return (sync || this._syncMode)
            ? this.promise(() => utils_1.wait(msec), sync)
            : this.promise(utils_1.wait(msec), sync);
    }
    pushStream() {
        if (this._stream) {
            this._streamQ.push(this._stream);
            this._stream = this._stream.pipe(utils_1.requireSafe('gulp-clone')());
        }
        return this;
    }
    popStream() {
        if (this._streamQ.length > 0) {
            if (this._stream)
                this.promise(toPromise(this._stream)); // back for flushing
            this._stream = this._streamQ.pop();
        }
        return this;
    }
    debug(options = {}) {
        let title = options.title ? options.title : '';
        let opts = Object.assign({}, this.moduleOptions.debug, { title }, options);
        return this.pipe(utils_1.requireSafe('gulp-debug')(opts));
    }
    filter(pattern = ["**", "!**/*.map"], options = {}) {
        let opts = Object.assign({}, this.moduleOptions.filter, options);
        return this.pipe(utils_1.requireSafe('gulp-filter')(pattern, opts));
    }
    rename(options = {}) {
        const opts = Object.assign({}, this.moduleOptions.rename, options.rename || options);
        return this.pipe(utils_1.requireSafe('gulp-rename')(opts));
    }
    copy(param, options = {}) {
        if (!param)
            return this; // allow null argument
        const verbose = this.conf.verbose && options.verbose !== false;
        const _copy = (target) => {
            let copyInfo = `[${target.src}] => ${target.dest}`;
            if (verbose)
                utils_1.msg(`[${this.name}]:copying: ${copyInfo}`);
            return utils_1.copy(target.src, target.dest)
                .then(() => { if (verbose)
                utils_1.msg(`[${this.name}]:copying: ${copyInfo} --> done`); });
        };
        utils_1.arrayify(param).forEach(target => this.promise((options.sync || this._syncMode) ? () => _copy(target) : _copy(target)));
        return this;
    }
    del(patterns, options = {}) {
        let silent = this.conf.silent || options.silent;
        if (!silent)
            utils_1.msg('Deleting:', patterns);
        return (options.sync || this._syncMode)
            ? this.promise(() => del(patterns, options), options.sync)
            : this.promise(del(patterns, options), options.sync);
    }
    exec(cmd, args = [], options = {}) {
        return (options.sync || this._syncMode)
            ? this.promise(() => utils_1.exec(cmd, args, options), options.sync)
            : this.promise(utils_1.exec(cmd, args, options), options.sync);
    }
    clean(options = {}) {
        let cleanList = utils_1.arrayify(this.conf.clean).concat(utils_1.arrayify(options.clean));
        const delOpts = Object.assign({}, this.moduleOptions.del, options);
        return this.del(cleanList, delOpts);
    }
    //--- Stream contents handling API: sourceMaps() should be called ---
    concat(options = {}) {
        const outFile = options.outFile || this.conf.outFile;
        if (!outFile) {
            const verbose = this.conf.verbose && options.verbose !== false;
            if (verbose)
                utils_1.info('[rtb:concat] Missing conf.outFile. No output generated.');
            return this;
        }
        let opts = Object.assign({}, this.moduleOptions.concat, options.concat);
        return this.filter().pipe(utils_1.requireSafe('gulp-concat')(outFile, opts.concat));
    }
    minifyCss(options = {}) {
        const opts = Object.assign({}, this.moduleOptions.cleanCss, options.cleanCss || options);
        return this.filter().pipe(utils_1.requireSafe('gulp-clean-css')(opts)).rename({ extname: '.min.css' });
    }
    minifyJs(options = {}) {
        const opts = Object.assign({}, this.moduleOptions.terser, options.terser);
        return this.filter().pipe(utils_1.requireSafe('gulp-terser')(opts)).rename({ extname: '.min.js' });
    }
    //--- extension support
    get conf() { return this._conf; }
    get name() { return this.conf.name; }
    get buildOptions() { return this.conf.buildOptions; }
    get moduleOptions() { return this.conf.moduleOptions; }
    get stream() { return this._stream; }
    set buildOptions(opts) { Object.assign(this.conf.buildOptions, opts); }
    set moduleOptions(mopts) { Object.assign(this.conf.moduleOptions, mopts); }
    get ext() { return RTB._extension; }
    static registerExtension(name, ext) {
        if (this._extension[name])
            throw Error(`RTB:registerExtension: extension name=${name} already exists.`);
        this._extension[name] = ext;
    }
    static loadExtensions(globModules) {
        let files = [];
        let cb = (file) => upath.removeExt(file, '.js');
        utils_1.arrayify(globModules).forEach(dir => {
            glob.sync(dir).forEach(file => files.push(cb(file)));
            files.forEach(file => require(file));
        });
    }
    // deprecated
    get buildName() {
        // warn('[GBM:rtb:builName] rtb.buildName is deprecated. Use rtb.name instead.');
        return this.conf.name;
    }
}
exports.RTB = RTB;
RTB._extension = {};
// load built-in extensions
RTB.loadExtensions(upath.join(__dirname, '../extension/*.js'));
