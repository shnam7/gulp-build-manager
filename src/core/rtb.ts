/**
 * class RTB - Runtime Builder
 */

import { GulpStream, Options, gulp } from "./common";
import { BuildConfig, FunctionBuilders, FunctionBuilder, CopyParam } from "./builder";
import { GReloader } from "./reloader";
import { toPromise, msg, info, is, ExternalCommand, SpawnOptions, spawn, exec, wait } from "../utils/utils";
import { Plugins, GPlugin } from "./plugin";
import filter = require("gulp-filter");

export class RTB {
    protected stream?: GulpStream;
    protected streamQ: GulpStream[] = [];
    protected promises: Promise<unknown>[] = [];
    protected promiseSync: Promise<unknown> = Promise.resolve();
    protected syncMode = false;
    protected verbose = false;

    conf: BuildConfig = { buildName: '' };
    buildOptions: Options = {};
    moduleOptions: Options = {};
    protected reloader?: GReloader;

    protected buildFunc = (rtb: RTB) => {
        rtb.src().dest();
    };


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

    constructor(conf?: BuildConfig, func?: FunctionBuilder) {
        this.init(conf, func);
    }

    init(conf?: BuildConfig, func?: FunctionBuilder): this {
        this.conf = conf || { buildName: '' };
        if (func) this.buildFunc = func;

        // normalize config
        if (is.Array(this.conf.dependencies) && this.conf.dependencies.length === 0)
            this.conf.dependencies = undefined;
        if (is.Array(this.conf.triggers) && this.conf.triggers.length === 0)
            this.conf.triggers = undefined;

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
        this.syncMode = conf.sync || false;
        this.verbose = conf.verbose || false;

        if (this.syncMode) this.log('Strating build in sync Mode.');

        // preBuild
        this.promise(this._executor(this.conf.preBuild));

        // build
        this.promise(() => {
            let r = this.build();
            return r instanceof Promise ? r : Promise.resolve();
        });

        // flush strream
        if (flushStream) this.promise(() => toPromise(this.stream));

        // postBuild
        this.promise(this._executor(this.conf.postBuild));

        // sync'ed promises
        this.promises.push(this.promiseSync);

        // finally, reload after all the promises are resolved
        return Promise.all(this.promises).then(() => this.reload());
    }

    build(): void | Promise<unknown> {
        return this.buildFunc(this);
    }


    /**----------------------------------------------------------------
     * Build API: Returns value should be 'this'
     *----------------------------------------------------------------*/

    src(src?: string | string[]): this {
        if (!src) src = this.conf.src;
        if (!src) return this;
        this.stream = gulp.src(src, this.moduleOptions.gulp && this.moduleOptions.gulp.src);

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
        if (this.stream) this.stream = this.stream!.pipe(destination, options);
        return this;
    }

    chain(action: Plugins, ...args: any[]): this {
        return this.promise(() => (
            action instanceof GPlugin ? action.process(this, ...args) : action(this, ...args))
            || Promise.resolve()
        );
    }

    on(event: string | symbol, listener: (...args: any[]) => void): this {
        if (this.stream) this.stream = this.stream.on(event, listener);
        return this;
    }

    promise(executor: ()=>Promise<unknown>): this {
        if (this.syncMode)
            this.promiseSync = this.promiseSync.then(executor);
        else
            this.promises.push(executor());
        return this;
    }

    sync(): this {
        // syncMode change need promise to be excuted on proper time in the sequence of all the promise executions
        return this.promise(() => new Promise((resolve) => { this.syncMode = true; resolve(); }));
    }

    async(): this {
        return this.promise(() => new Promise((resolve) => { this.syncMode = false; resolve(); }));
    }

    wait(msec: number = 0): this {
        return this.promise(() => wait(msec));
    }

    // print message in promise execution sequence
    msg(...args: any[]): this {
        return this.promise(() => new Promise(resolve => { info(args); resolve() }));
    }

    // print message in promise execution sequence only when verbose option enabled
    log(...args: any[]): this {
        return this.verbose ? this.promise(() => new Promise(resolve => { info(args); resolve() })) : this;
    }

    pushStream(): this {
        if (this.stream) {
            this.streamQ.push(this.stream);
            this.stream = this.stream.pipe(require('gulp-clone')());
        }
        return this;
    }

    popStream(): this {
        if (this.streamQ.length > 0) {
            if (this.stream) this.promise(() => toPromise(this.stream));  // back for flushing
            this.stream = this.streamQ.pop()
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
        if (this.buildOptions.reload !== false && this.reloader)
            this.reloader.reload(this.stream, this.moduleOptions, this.buildOptions.watch);
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

        if (!options.silent) msg('Deleting:', cleanList);
        return this.promise(() => require("del")(cleanList, delOpts));
    }

    copy(param?: CopyParam | CopyParam[], options: Options = {}): this {
        if (!param) return this;   // allow null argument

        let targets = is.Array(param) ? param : [param];
        for (let target of targets) {
            this.promise(() => {
                let copyInfo = `[${target.src}] => ${target.dest}`;
                if (options.verbose) msg(`copying: [${copyInfo}]`);
                return toPromise(gulp.src(target.src).pipe(gulp.dest(target.dest)))
                    .then(() => { if (this.verbose) info(`--> copy done: [${copyInfo}]`) })
            });
        }
        return this;
    }

    spawn(cmd: string | ExternalCommand, args: string[] = [], options: SpawnOptions = {}): this {
        return this.promise(() => (is.Object(cmd))
            ? spawn(cmd.command, cmd.args, cmd.options)
            : spawn(cmd, args, options)
        )
    }

    exec(cmd: string | ExternalCommand, args: string[] = [], options: SpawnOptions = {}): this {
        return this.promise(() => exec(cmd));
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
}
