/**
 * class RTB - Runtime Builder
 */

import * as upath from 'upath';
import * as glob from 'glob';
import * as filter from 'gulp-filter';
import { GBuildManager } from "./buildManager";
import { GulpStream, Options, gulp } from "./common";
import { BuildConfig, FunctionBuilder } from "./builder";
import { toPromise, msg, info, is, ExternalCommand, SpawnOptions, exec, wait, arrayify, copy } from "../utils/utils";
import { npmLock, npmUnlock, requireSafe } from '../utils/npm';
import { EventEmitter } from 'events';
import del = require('del');


type PromiseExecutor = () => void | Promise<unknown>;

interface BuildConfigNorm extends BuildConfig {
    buildOptions: Options;
    moduleOptions: Options;
}

export type CopyParam = { src: string | string[], dest: string };

export interface CleanOptions extends del.Options {
    clean?: string | string[];
    sync?: boolean;
}

export type RTBExtension = (...args: any[]) => FunctionBuilder;


//--- class RTB
export class RTB extends EventEmitter {
    protected _stream?: GulpStream;
    protected _streamQ: GulpStream[] = [];
    protected _promises: Promise<unknown>[] = [];
    protected _promiseSync: Promise<unknown> = Promise.resolve();
    protected _syncMode: boolean = false;
    protected _buildFunc: FunctionBuilder = (rtb: RTB) => { rtb.src().dest(); };
    protected _conf: BuildConfigNorm = { buildName: '', buildOptions: {}, moduleOptions: {} };

    constructor(func?: FunctionBuilder) {
        super();
        if (func) this._buildFunc = func;
    }


    /**----------------------------------------------------------------
     * Build sequence functions: Return value should be void or Promise
     *-----------------------------------------------------------------*/
    protected _execute(action?: FunctionBuilder, ...args: any[]): void | Promise<unknown> {
        if (is.Function(action)) return action(this, args);
    }

    protected build(): void | Promise<unknown> {
        return this._buildFunc(this);
    }

    protected _init(): void | Promise<unknown> {
        this._syncMode = false;
        this.emit('init');
        if (this._syncMode) console.log('RTB: Strating build in sync Mode.');
    }

    protected _exit() {
        this.emit('exit', this);
        this._stream = undefined;
        this._streamQ = [];
    }

    __ready(conf: BuildConfig): this {
        Object.assign(this._conf, conf);
        this.moduleOptions = Object.assign({}, GBuildManager.defaultModuleOptions, conf.moduleOptions);
        this.emit('ready', this);
        return this;
    }

    __build() : Promise<unknown> {
        return Promise.resolve()
            .then(this._init.bind(this))
            .then(npmLock)
            .then(this._execute.bind(this, this.conf.preBuild))
            .then(this.build.bind(this))
            .then(this._execute.bind(this, this.conf.postBuild))
            .then(() => this._promiseSync)
            .then(() => Promise.all(this._promises))
            .then(npmUnlock)
            .then(() => { if (this.conf.flushStream) return toPromise(this._stream); })
            .then(this._exit.bind(this))
    }


    /**----------------------------------------------------------------
     * Build API: Returns value should be 'this'
     *----------------------------------------------------------------*/

    src(src?: string | string[]): this {
        if (!src) src = this.conf.src;
        if (!src) return this;

        const mopts = this.moduleOptions;
        this._stream = gulp.src(src, mopts.gulp && mopts.gulp.src);

        // check input file ordering
        if (this.conf.order && this.conf.order?.length > 0) {
            let order = requireSafe('gulp-order');
            this.pipe(order(this.conf.order, mopts.order));
        }
        this.emit('after-src', this);

        // check sourceMap option
        return this.sourceMaps({ init: true });
    }

    dest(path?: string): this {
        this.emit('before-dest', this);
        this.sourceMaps().pipe(gulp.dest(path || this.conf.dest || '.', this.moduleOptions.gulp?.dest));
        return this;
    }

    pipe(destination: any, options?: { end?: boolean; }): this {
        if (this._stream) this._stream = this._stream.pipe(destination, options);
        return this;
    }

    chain(action: FunctionBuilder, ...args: any[]): this {
        return this.promise(action(this, ...args));
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

    debug(options: Options = {}): this {
        let title = options.title ? options.title : '';
        let opts = Object.assign({}, this.moduleOptions.debug, { title }, options);
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

    copy(param?: CopyParam | CopyParam[], options: Options = {}): this {
        if (!param) return this;   // allow null argument

        const _copy = (target: any): Promise<unknown> => {
            let copyInfo = `[${target.src}] => ${target.dest}`;
            if (options.verbose) msg(`[${this.buildName}]:copying: ${copyInfo}`);
            return copy(target.src, target.dest)
                .then(() => { if (this.conf.verbose) msg(`[${this.buildName}]:copying: ${copyInfo} --> done`) });
        }
        arrayify(param).forEach(target => this.promise(
            (options.sync || this._syncMode) ? () => _copy(target) : _copy(target)
        ));
        return this;
    }

    del(patterns: string | string[], options: Options = {}): this {
        let silent = this.conf.silent || options.silent;
        if (!silent) msg('Deleting:', patterns);

        return (options.sync || this._syncMode)
            ? this.promise(() => requireSafe("del")(patterns, options), options.sync)
            : this.promise(requireSafe("del")(patterns, options), options.sync);
    }

    exec(cmd: string | ExternalCommand, args: string[] = [], options: SpawnOptions = {}): this {
        return (options.sync || this._syncMode)
            ? this.promise(() => exec(cmd, args, options), options.sync)
            : this.promise(exec(cmd, args, options), options.sync);
    }

    clean(options: CleanOptions = {}): this {
        let cleanList = arrayify(this.conf.clean).concat(arrayify(options.clean));
        const delOpts = Object.assign({}, this.moduleOptions.del, options);
        return this.del(cleanList, delOpts)
    }


    //--- Stream contents handling API: sourceMaps() should be called ---
    concat(options: Options = {}): this {
        const outFile = options.outFile || this.conf.outFile;
        if (!outFile) {
            if (options.verbose) info('[rtb:concat] Missing conf.outFile. No output generated.');
            return this;
        }
        let opts = Object.assign({}, this.moduleOptions.concat, options.concat);

        return this.filter().pipe(requireSafe('gulp-concat')(outFile, opts.concat));
    }

    minifyCss(options: Options = {}): this {
        const opts = Object.assign({}, this.moduleOptions.cleanCss, options.cleanCss || options);
        return this.filter().pipe(requireSafe('gulp-clean-css')(opts)).rename({ extname: '.min.css' });
    }

    minifyJs(options: Options = {}): this {
        const opts = Object.assign({}, this.moduleOptions.uglifyES, options.uglifyES);
        return this.filter().pipe(requireSafe('gulp-uglify-es').default(opts)).rename({ extname: '.min.js' });
    }


    //--- extension support
    get conf() { return this._conf; }
    get buildName() { return this.conf.buildName; }
    get buildOptions() { return this.conf.buildOptions; }
    get moduleOptions() { return this.conf.moduleOptions; }
    get stream() { return this._stream; }

    set buildOptions(opts: Options) { Object.assign(this.conf.buildOptions, opts); }
    set moduleOptions(mopts: Options) { Object.assign(this.conf.moduleOptions, mopts); }

    get ext() { return RTB._extension; }

    protected static _extension: {[key:string]: RTBExtension} = {}

    static registerExtension(name: string, ext: RTBExtension): void {
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
