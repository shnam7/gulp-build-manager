/**
 * class RTB - Runtime Builder
 */

import * as upath from 'upath';
import * as glob from 'glob';
import filter = require("gulp-filter");import { GBuildManager } from "./buildManager";
import { GulpStream, Options, gulp } from "./common";
import { BuildConfig, FunctionBuilder, CopyParam } from "./builder";
import { toPromise, msg, info, is, ExternalCommand, SpawnOptions, exec, wait, arrayify, copy } from "../utils/utils";
import { GReloaders } from "./reloader";
import { npmLock, npmUnlock, requireSafe } from '../utils/npm';


type RTBExtension = (...args: any[]) => FunctionBuilder;
type PromiseExecutor = () => void | Promise<unknown>;
type ActionItem = { priority: number, action: FunctionBuilder };

export class RTB {
    protected _stream?: GulpStream;
    protected _streamQ: GulpStream[] = [];
    protected _promises: Promise<unknown>[] = [];
    protected _promiseSync: Promise<unknown> = Promise.resolve();
    protected _syncMode: boolean = false;
    protected _reloaders?: GReloaders;
    protected _buildFunc: FunctionBuilder = (rtb: RTB) => { rtb.src().dest(); };
    protected _actions: Map<string, ActionItem[]> = new Map();

    //--- internal functions

    conf: BuildConfig = { buildName: '' };
    buildOptions: Options = {};
    moduleOptions: Options = {};

    constructor(conf: BuildConfig) {
        this._init(conf);
    }

    /**----------------------------------------------------------------
     * Configuration functions
     *-----------------------------------------------------------------*/

    protected _init(conf: BuildConfig): this {
        this.conf = conf || { buildName: '' };
        this.conf.moduleOptions = Object.assign({}, GBuildManager.defaultModuleOptions, conf.moduleOptions);
        return this;
    }

    setbuildFunc(func: (rtb:RTB) => Promise<unknown> | void) {
        this._buildFunc = func;
        return this;
    }

    setReloaders(reloaders: GReloaders) {
        this._reloaders = reloaders;
        return this;
    }


    /**----------------------------------------------------------------
     * Build sequence functions: Return value should be void or Promise
     *-----------------------------------------------------------------*/

    _build(conf: BuildConfig) : Promise<unknown> {
        // reset variables
        this.conf = conf;
        this.buildOptions = conf.buildOptions || {};
        this.moduleOptions = conf.moduleOptions || {};
        const flushStream = this.conf.flushStream;
        this._syncMode = conf.sync || false;

        // build sequence use new promise independent of API promises (this._promises and this._promiseSync)
        if (this._syncMode) console.log('RTB: Strating build in sync Mode.');
        return Promise.resolve()
            .then(() => npmLock())
            .then(() => this._execute(this.conf.preBuild))
            .then(() => this.build())
            .then(() => this._execute(this.conf.postBuild))
            .then(() => { if (flushStream) return toPromise(this._stream); })
            .then(() => this._promiseSync)
            .then(() => Promise.all(this._promises))
            .then(() => npmUnlock())
            .then(() => { if (conf.reloadOnFinish === true) this.reload(); });
    }

    protected build(): void | Promise<unknown> {
        return this._buildFunc(this);
    }


    /**----------------------------------------------------------------
     * build actions API for customization - similar to WordPress 'actions'
     *-----------------------------------------------------------------*/

    addAction(tag: string, action: FunctionBuilder, priority: number = 10): this {
        let ar = this._actions.get(tag) || [];
        let idx = 0;
        for (; idx<ar.length; idx++) if (ar[idx].priority > priority) break;

        ar.splice(idx, 0, { priority, action })
        this._actions.set(tag, ar);
        return this;
    }

    removeAction(tag: string, action: FunctionBuilder, priority: number): this {
        let ar = this._actions.get(tag);
        if (!ar) return this;

        for (let idx=0; idx<ar.length; idx++)
            if (ar[idx].action === action && ar[idx].priority === priority) ar.splice(idx, 0)
        this._actions.set(tag, ar);
        return this;
    }

    doActions(tag: string, ...args: any[]): this {
        let ar = this._actions.get(tag);
        if (ar) ar.forEach((item: ActionItem) => {
            this.promise(()=>item.action(this, ...args))
        });
        return this;
    }


    /**----------------------------------------------------------------
     * Build API: Returns value should be 'this'
     *----------------------------------------------------------------*/

    src(src?: string | string[]): this {
        if (!src) src = this.conf.src;
        if (!src) return this;
        this.doActions('before_src');
        this._stream = gulp.src(src, this.moduleOptions.gulp && this.moduleOptions.gulp.src);

        // check input file ordering
        if (this.conf.order && this.conf.order?.length > 0) {
            let order = requireSafe('gulp-order');
            this.pipe(order(this.conf.order, this.moduleOptions.order));
        }
        this.doActions('after_src');

        // check sourceMap option
        return this.sourceMaps({ init: true });
    }

    dest(path?: string): this {
        let opts = this.moduleOptions.gulp || {};
        this.doActions('before_dest');
        this.pipe(gulp.dest(path || this.conf.dest || '.', opts.dest));
        this.doActions('after_dest');
        return this;
    }

    pipe(destination: any, options?: { end?: boolean; }): this {
        if (this._stream) this._stream = this._stream.pipe(destination, options);
        return this;
    }

    chain(action: FunctionBuilder, ...args: any[]): this {
        return this.promise(action(this, ...args));
    }

    on(event: string | symbol, listener: (...args: any[]) => void): this {
        if (this._stream) this._stream = this._stream.on(event, listener);
        return this;
    }

    //--- accept function or promise
    promise(promise?: Promise<unknown> | void | PromiseExecutor, sync: boolean = false): this {
        if (promise instanceof Promise) {
            if (sync || this._syncMode)
                this._promiseSync = this._promiseSync.then(() => promise);
            else
                this._promises.push(promise);
        }
        else if (is.Function(promise)) {
            if (sync || this._syncMode)
                this._promiseSync = this._promiseSync.then(promise as PromiseExecutor);
            else {
                promise = (promise as PromiseExecutor)();
                if (promise) this._promises.push(promise);
            }
        }
        return this;
    }

    sync(): this {
        this._syncMode = true;
        return this;
    }

    async(): this {
        this._syncMode = true;
        return this;
    }

    wait(msec: number = 0, sync: boolean = false): this {
        return (sync || this._syncMode)
            ? this.promise(() => wait(msec), sync)
            : this.promise(wait(msec), sync);
    }

    pushStream(): this {
        if (this._stream) {
            this._streamQ.push(this._stream);
            this._stream = this._stream.pipe(requireSafe('gulp-clone')());
        }
        return this;
    }

    popStream(): this {
        if (this._streamQ.length > 0) {
            if (this._stream) this.promise(toPromise(this._stream));  // back for flushing
            this._stream = this._streamQ.pop()
        }
        return this;
    }

    sourceMaps(options: Options = {}): this {
        if (!this.buildOptions.sourceMap) return this;

        let opts = Object.assign({}, this.moduleOptions.sourcemaps, options);
        if (opts.init)
            this.pipe(requireSafe('gulp-sourcemaps').init(opts.init));
        else
            this.pipe(requireSafe('gulp-sourcemaps').write(opts.dest || '.', opts.write));
        return this;
    }

    reload(): this {
        if (this._reloaders) this._reloaders.reload(this._stream);
        return this;
    }

    debug(options: Options = {}): this {
        let title = options.title ? options.title : '';
        let opts = Object.assign({}, this.moduleOptions.debug, options, { title });
        return this.pipe(requireSafe('gulp-debug')(opts));
    }

    filter(pattern: string | string[] | filter.FileFunction = ["**", "!**/*.map"], options: filter.Options = {}): this {
        let opts = Object.assign({}, this.moduleOptions.filter, options);
        return this.pipe(requireSafe('gulp-filter')(pattern, opts))
    }

    rename(options: Options = {}): this {
        const opts = Object.assign({}, this.moduleOptions.rename, options.rename || options);
        return this.pipe(requireSafe('gulp-rename')(opts));
    }

    copy(param?: CopyParam | CopyParam[], options: Options = {}, sync: boolean = false): this {
        if (!param) return this;   // allow null argument

        const _copy = (target: any): Promise<unknown> => {
            let copyInfo = `[${target.src}] => ${target.dest}`;
            if (options.verbose) msg(`copying: [${copyInfo}]`);
            return copy(target.src, target.dest)
                .then(() => { if (this.conf.verbose) msg(`--> copy done: [${copyInfo}]`) });
        }
        arrayify(param).forEach(target => this.promise(
            (sync || this._syncMode) ? () => _copy(target) : _copy(target)
        ));
        return this;
    }

    del(patterns: string | string[], options: Options = {}, sync: boolean = false): this {
        if (!this.conf.silent) msg('Deleting:', patterns);
        return (sync || this._syncMode)
            ? this.promise(() => requireSafe("del")(patterns, options), sync)
            : this.promise(requireSafe("del")(patterns, options), sync);
    }

    exec(cmd: string | ExternalCommand, args: string[] = [], options: SpawnOptions = {}, sync: boolean = false): this {
        return (sync || this._syncMode)
            ? this.promise(() => exec(cmd, args, options), sync)
            : this.promise(exec(cmd, args, options), sync);
    }

    // minify javascripts
    uglify(options: Options = {}): this {
        const opts = Object.assign({}, this.moduleOptions.uglifyES, options.uglifyES);
        return this.pipe(requireSafe('gulp-uglify-es').default(opts));
    }

    cleanCss(options: Options = {}): this {
        const opts = Object.assign({}, this.moduleOptions.cleanCss, options.cleanCss || options);
        return this.pipe(requireSafe('gulp-clean-css')(opts));
    }

    clean(options: Options = {}, sync: boolean = false): this {
        let cleanList = arrayify(this.conf.clean).concat(arrayify(options.clean));

        const delOpts = Object.assign({}, this.moduleOptions.del, options.del);
        return this.del(cleanList, delOpts, sync)
    }


    //--- Stream contents handling API: sourceMaps() should be called ---
    concat(options: Options = {}): this {
        const outFile = options.outFile || this.conf.outFile;
        if (!outFile) {
            if (options.verbose) info('[rtb:concat] Missing conf.outFile. No output generated.');
            return this;
        }
        let opts = Object.assign({}, this.moduleOptions.concat, options.concat);

        return this.filter().pipe(requireSafe('gulp-concat')(outFile, opts.concat)).sourceMaps();
    }

    minifyCss(): this {
        return this.filter().cleanCss().rename({ extname: '.min.css' }).sourceMaps();
    }

    minifyJs(): this {
        return this.filter().uglify()
            .rename({ extname: '.min.js' }).sourceMaps();
    }

    protected _execute(action?: FunctionBuilder, ...args: any[]): void | Promise<unknown> {
        if (is.Function(action)) return action(this, args);
    }



    //--- extension support

    get ext() { return RTB._extension; }

    protected static _extension: {[key:string]: RTBExtension} = {}

    static registerExtension(name: string, ext: RTBExtension) {
        if (this._extension[name])
            throw Error(`RTB:registerExtension: extension name=${name} already exists.`)
        this._extension[name] = ext;
    }

    static loadExtensions(globModules: string | string[]) {
        let files: string[] = [];
        let cb = (file: string) => upath.removeExt(file, '.js');
        arrayify(globModules).forEach(dir => {
            glob.sync(dir).forEach(file => files.push(cb(file)));
            files.forEach(file => require(file));
        });
    }
}

// load built-in extensions
RTB.loadExtensions(upath.join(__dirname, '../extension/*.js'))
