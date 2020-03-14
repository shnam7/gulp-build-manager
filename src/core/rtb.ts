/**
 * class RTB - Runtime Builder
 */

import { GulpStream, Options, gulp } from "./common";
import { BuildConfig, FunctionBuilders, FunctionBuilder, CopyParam } from "./builder";
import { toPromise, msg, info, is, ExternalCommand, SpawnOptions, spawn, exec, wait, arrayify } from "../utils/utils";
import { Plugins, GPlugin } from "./plugin";
import filter = require("gulp-filter");
import { GBuildManager } from "./buildManager";
import { GReloaders } from "./reloader";

export class RTB {
    protected _stream?: GulpStream;
    protected _streamQ: GulpStream[] = [];
    protected _promises: Promise<unknown>[] = [];
    protected _promiseSync: Promise<unknown> = Promise.resolve();
    protected _syncMode: boolean = false;
    protected _reloaders?: GReloaders;
    protected _buildFunc: FunctionBuilder = (rtb: RTB) => { rtb.src().dest(); };

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

        // normalize config
        if (is.Array(this.conf.dependencies) && this.conf.dependencies.length === 0)
            this.conf.dependencies = undefined;
        if (is.Array(this.conf.triggers) && this.conf.triggers.length === 0)
            this.conf.triggers = undefined;
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

        if (this._syncMode) this.log('Strating build in sync Mode.');

        // preBuild
        this.promise(this._executor(this.conf.preBuild), true);

        // build
        this.promise(() => {
            let r = this.build();
            return r instanceof Promise ? r : Promise.resolve();
        }, true);

        // flush strream
        if (flushStream) this.promise(() => toPromise(this._stream), true);

        // postBuild
        this.promise(this._executor(this.conf.postBuild), true);

        // sync'ed promises
        this._promises.push(this._promiseSync);

        // finally, reload after all the promises are resolved
        return Promise.all(this._promises).then(() => {
            if (conf.reloadOnFinish === true) this.reload()
        });
    }

    protected build(): void | Promise<unknown> {
        return this._buildFunc(this);
    }


    /**----------------------------------------------------------------
     * Build API: Returns value should be 'this'
     *----------------------------------------------------------------*/

    src(src?: string | string[]): this {
        if (!src) src = this.conf.src;
        if (!src) return this;
        this._stream = gulp.src(src, this.moduleOptions.gulp && this.moduleOptions.gulp.src);

        // check input file ordering
        if (this.conf.order && this.conf.order?.length > 0) {
            let order = require('gulp-order');
            this.pipe(order(this.conf.order, this.moduleOptions.order));
        }

        // check sourceMap option
        return this.sourceMaps({ init: true });
    }

    dest(path?: string): this {
        let opts = this.moduleOptions.gulp || {};
        this.pipe(gulp.dest(path || this.conf.dest || '.', opts.dest));
        return this;
    }

    pipe(destination: any, options?: { end?: boolean; }): this {
        if (this._stream) this._stream = this._stream.pipe(destination, options);
        return this;
    }

    chain(action: Plugins, ...args: any[]): this {
        return this.promise(() => (
            action instanceof GPlugin ? action.process(this, ...args) : action(this, ...args))
            || Promise.resolve()
        );
    }

    on(event: string | symbol, listener: (...args: any[]) => void): this {
        if (this._stream) this._stream = this._stream.on(event, listener);
        return this;
    }

    promise(executor: () => Promise<unknown>, sync: boolean = false): this {
        if (this._syncMode || sync === true)
            this._promiseSync = this._promiseSync.then(executor);
        else
            this._promises.push(executor());
        return this;
    }

    sync(): this {
        // syncMode change need promise to be excuted on proper time in the sequence of all the promise executions
        return this.promise(() => new Promise((resolve) => { this._syncMode = true; resolve(); }));
    }

    async(): this {
        return this.promise(() => new Promise((resolve) => { this._syncMode = false; resolve(); }));
    }

    wait(msec: number = 0, sync: boolean = false): this {
        return this.promise(() => wait(msec), sync);
    }

    // print message in promise execution sequence
    msg(...args: any[]): this {
        return this.promise(() => new Promise(resolve => { msg(args); resolve() }));
    }

    // print message in promise execution sequence only when verbose option enabled
    log(...args: any[]): this {
        return !this.conf.silent ? this.promise(() => new Promise(resolve => { info(args); resolve() })) : this;
    }

    pushStream(): this {
        if (this._stream) {
            this._streamQ.push(this._stream);
            this._stream = this._stream.pipe(require('gulp-clone')());
        }
        return this;
    }

    popStream(): this {
        if (this._streamQ.length > 0) {
            if (this._stream) this.promise(() => toPromise(this._stream));  // back for flushing
            this._stream = this._streamQ.pop()
        }
        return this;
    }

    sourceMaps(options: Options = {}): this {
        if (!this.buildOptions.sourceMap) return this;

        let opts = Object.assign({}, this.moduleOptions.sourcemaps, options);
        if (opts.init)
            this.pipe(require('gulp-sourcemaps').init(opts.init));
        else
            this.pipe(require('gulp-sourcemaps').write(opts.dest || '.', opts.write));
        return this;
    }

    reload(): this {
        if (this._reloaders) this._reloaders.reload(this._stream);
        return this;
    }

    debug(options: Options = {}): this {
        let title = options.title ? options.title : '';
        // title = `[debugPlugin${title ? ':' + title : ''}]`;
        let opts = Object.assign({}, this.moduleOptions.debug, options, { title });
        return this.pipe(require('gulp-debug')(opts));
    }

    filter(pattern: string | string[] | filter.FileFunction = ["**", "!**/*.map"], options: filter.Options = {}): this {
        let opts = Object.assign({}, this.moduleOptions.filter, options);
        return this.pipe(require('gulp-filter')(pattern, opts))
    }

    rename(options: Options = {}): this {
        const opts = Object.assign({}, this.moduleOptions.rename, options.rename || options);
        return this.pipe(require('gulp-rename')(opts));
    }

    copy(param?: CopyParam | CopyParam[], options: Options = {}): this {
        if (!param) return this;   // allow null argument

        let targets = arrayify(param);
        for (let target of targets) {
            this.promise(() => {
                let copyInfo = `[${target.src}] => ${target.dest}`;
                if (options.verbose) msg(`copying: [${copyInfo}]`);
                return toPromise(gulp.src(target.src).pipe(gulp.dest(target.dest)))
                    .then(() => { if (this.conf.verbose) msg(`--> copy done: [${copyInfo}]`) })
            });
        }
        return this;
    }

    del(patterns: string | string[], options: Options = {}): this {
        if (!this.conf.silent) msg('Deleting:', patterns);
        return this.promise(() => require("del")(patterns, options));
    }

    spawn(cmd: string | ExternalCommand, args: string[] = [], options: SpawnOptions = {}): this {
        return this.promise(() => (is.Object(cmd))
            ? spawn(cmd.command, cmd.args, cmd.options)
            : spawn(cmd, args, options)
        )
    }

    exec(cmd: string | ExternalCommand, args: string[] = [], options: SpawnOptions = {}): this {
        return this.promise(() => exec(cmd, args, options));
    }

    // minify javascripts
    uglify(options: Options = {}): this {
        const opts = Object.assign({}, this.moduleOptions.uglifyES, options.uglifyES);
        return this.pipe(require('gulp-uglify-es').default(opts));
    }

    cleanCss(options: Options = {}): this {
        const opts = Object.assign({}, this.moduleOptions.cleanCss, options.cleanCss || options);
        return this.pipe(require('gulp-clean-css')(opts));
    }

    clean(options: Options = {}): this {
        let clean1 = this.conf.clean || [];
        let clean2 = options.clean || [];
        if (is.String(clean1)) clean1 = [clean1];
        if (is.String(clean2)) clean2 = [clean2];
        let cleanList = (<string[]>[]).concat(clean1, clean2);

        // check rename option
        const delOpts = Object.assign({}, this.moduleOptions.del, options.del);
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

        return this.filter().pipe(require('gulp-concat')(outFile, opts.concat)).sourceMaps();
    }

    minifyCss(): this {
        return this.filter().cleanCss().rename({ extname: '.min.css' }).sourceMaps();
    }

    minifyJs(): this {
        return this.filter().uglify()
            .rename({ extname: '.min.js' }).sourceMaps();
    }


    protected _executor(action?: FunctionBuilders): () => Promise<unknown> {
        return () => {
            if (is.Function(action)) {
                let r = action(this);
                return (r instanceof Promise) ? r : Promise.resolve();
            }
            if (is.Object(action)) {
                let r = action.func(this, ...action.args);
                return (r instanceof Promise) ? r : Promise.resolve();
            }
            return Promise.resolve();
        }
    }
}
