/**
 * class RTB - Runtime Builder
 */

import { GulpStream, Options, gulp } from "./common";
import { BuildConfig, FunctionBuilders, FunctionBuilder, FunctionObjectBuilder, CopyParam } from "./builder";
import { GReloader } from "./reloader";
import { toPromise, msg, info, is, ExternalCommand, SpawnOptions, spawn, exec } from "../utils/utils";
import { Plugins, GPlugin } from "./plugin";
import filter = require("gulp-filter");

export class RTB {
    protected stream?: GulpStream;
    protected promiseQ: Promise<any>[] = [];
    protected streamQ: GulpStream[] = [];

    conf: BuildConfig = { buildName: '' };
    buildOptions: Options = {};
    moduleOptions: Options = {};
    protected reloader?: GReloader;


    protected buildFunc = (rtb: RTB) => {
        rtb.src().dest();
    };

    protected _run(action?: FunctionBuilders) {
        if (is.Function(action)) return (<FunctionBuilder>action)(this);
        if (is.Object(action)) return (<FunctionObjectBuilder>action)
            .func(this, ...(<FunctionObjectBuilder>action).args);
    }

    constructor(conf?: BuildConfig, func?: FunctionBuilder) {
        this.init(conf, func);
    }

    init(conf?: BuildConfig, func?: FunctionBuilder): this {
        this.conf = conf || { buildName: '' };
        if (func) this.buildFunc = func;

        // normalize config
        if (is.Array(this.conf.dependencies) && (<any[]>this.conf.dependencies).length === 0)
            this.conf.dependencies = undefined;
        if (is.Array(this.conf.triggers) && (<any[]>this.conf.triggers).length === 0)
            this.conf.triggers = undefined;

        return this;
    }


    /**----------------------------------------------------------------
     * Build sequence functions: Return value should be void or Promise
     *-----------------------------------------------------------------*/

    async _build(conf: BuildConfig) {
        // reset variables
        this.conf = conf;
        this.buildOptions = conf.buildOptions || {};
        this.moduleOptions = conf.moduleOptions || {};
        const flushStream = this.conf.flushStream;
        let promise = undefined;

        // preBuild
        await this._run(this.conf.preBuild);

        // build
        await this.build();
        if (flushStream) {
            await Promise.all(this.promiseQ);
            await toPromise(this.stream);
        }
        if (this.conf.copy) {   // copy is the last part of the build
            promise = RTB.copy(this.conf.copy, this.buildOptions.copy);
            if (this.conf.flushStream) await promise;
        }

        // postBuild
        await this._run(this.conf.postBuild);

        // and then, reload (after all process including postBuild
        await this.reload();
        return promise;
    }

    build(): void | Promise<any> {
        return this.buildFunc(this);
    }


    /**----------------------------------------------------------------
     * Builder API functions: Returns value should be 'this'
     *----------------------------------------------------------------*/

    pushStream() {
        if (this.stream) {
            this.streamQ.push(this.stream);
            this.stream = this.stream.pipe(require('gulp-clone')());
        }
        return this;
    }

    popStream() {
        if (this.streamQ.length > 0) {
            if (this.stream) this.promiseQ.push(toPromise(this.stream));  // back for flushing
            this.stream = this.streamQ.pop()
        }
        return this;
    }

    src(src?: string | string[]) {
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

    dest(path?: string) {
        let opts = this.moduleOptions.gulp || {};
        this.pipe(gulp.dest(path || this.conf.dest || '.', opts.dest));
        return this;
    }

    pipe(destination: any, options?: { end?: boolean; }): this {
        if (this.stream) this.stream = this.stream!.pipe(destination, options);
        return this;
    }

    on(event: string | symbol, listener: (...args: any[]) => void): this {
        if (this.stream) this.stream = this.stream.on(event, listener);
        return this;
    }

    promise(promise: Promise<any> | void): this {
        if (promise) this.promiseQ.push(promise);
        return this;
    }

    chain(action: Plugins, ...args: any[]): this {
        return this.promise(
            action instanceof GPlugin ? (<GPlugin>action).process(this, ...args) : action(this, ...args)
        );
    }

    sourceMaps(options: Options = {}) {
        if (!this.buildOptions.sourceMap) return this;

        let opts = Object.assign({}, this.moduleOptions.sourcemaps, options);
        if (opts.init)
            this.pipe(require('gulp-sourcemaps').init(opts.init));
        else
            this.pipe(require('gulp-sourcemaps').write(opts.dest || '.', opts.write));
        return this;
    }

    reload() {
        if (this.buildOptions.reload !== false && this.reloader)
            this.reloader.reload(this.stream, this.moduleOptions, this.buildOptions.watch);
        return this;
    }

    debug(options: Options = {}) {
        let title = options.title ? options.title : '';
        // title = `[debugPlugin${title ? ':' + title : ''}]`;
        let opts = Object.assign({}, this.moduleOptions.debug, options, { title });
        return this.pipe(require('gulp-debug')(opts));
    }

    filter(pattern: string | string[] | filter.FileFunction = ["**", "!**/*.map"], options: filter.Options = {}) {
        let opts = Object.assign({}, this.moduleOptions.filter, options);
        return this.pipe(require('gulp-filter')(pattern, opts))
    }

    rename(options: Options = {}) {
        const opts = Object.assign({}, this.moduleOptions.rename, options.rename || options);
        return this.pipe(require('gulp-rename')(opts));
    }

    copy(param?: CopyParam | CopyParam[], options: Options = {}) {
        return this.promise(RTB.copy(param, options));
    }

    clean(options: Options = {}) {
        let clean1 = this.conf.clean || [];
        let clean2 = options.clean || [];
        if (is.String(clean1)) clean1 = [clean1 as string];
        if (is.String(clean2)) clean2 = [clean2 as string];
        let cleanList = (<string[]>[]).concat(clean1, clean2);

        // check rename option
        const delOpts = Object.assign({}, this.moduleOptions.del, options.del);

        if (!options.silent) msg('Deleting:', cleanList);
        this.promiseQ.push(require("del")(cleanList, delOpts));
        return this;
    }

    // minify javascripts
    uglify(options: Options = {}) {
        const opts = Object.assign({}, this.moduleOptions.uglifyES, options.uglifyES);
        return this.pipe(require('gulp-uglify-es').default(opts));
    }

    cleanCss(options: Options = {}) {
        const opts = Object.assign({}, this.moduleOptions.cleanCss, options.cleanCss || options);
        return this.pipe(require('gulp-clean-css')(opts));
    }


    //--- Stream contents handling API: sourceMaps() should be called ---

    concat(options: Options = {}) {
        const outFile = options.outFile || this.conf.outFile;
        if (!outFile) {
            if (options.verbose) info('[concatPlugin] Missing conf.outFile. No output generated.');
            return this;
        }
        let opts = Object.assign({}, this.moduleOptions.concat, options.concat);

        return this.filter().pipe(require('gulp-concat')(outFile, opts.concat)).sourceMaps();
    }

    minifyCss() {
        return this.filter().cleanCss().rename({ extname: '.min.css' }).sourceMaps();
    }

    minifyJs() {
        return this.filter().uglify()
            .rename({ extname: '.min.js' }).sourceMaps();
    }


    /**----------------------------------------------------------------
     * Builder utility functions: Return values can be anything
     *----------------------------------------------------------------*/
    // call(action: Plugin, ...args: any[]): void | Promise<any> {
    //     return action instanceof GPlugin
    //         ? (action as GPlugin).process(this, ...args)
    //         : action(this, ...args);
    // }

    // TODO: check this function again
    // clean(options: Options = {}) {
    //     let clean1 = this.conf.clean || [];
    //     let clean2 = options.clean || [];
    //     if (clean1 && is.String(clean1)) clean1 = [clean1 as string];
    //     if (clean2 && is.String(clean2)) clean2 = [clean2 as string];
    //     let cleanList = (<string[]>[]).concat(clean1 as string[], clean2 as string[]);

    //     // check rename option
    //     const delOpts = Object.assign({}, this.moduleOptions.del, options.del);

    //     if (!options.silent) msg('Deleting:', cleanList);
    //     return require("del")(cleanList, delOpts);
    // }

    //
    // toPromise(stream: Stream): Promise<Stream>{
    //   return toPromise(stream || this.stream);
    // }
    //
    // cloneStream(): Stream {
    //   return this.stream ? require('gulp-clone')(this.stream) : undefined;
    // }
    //
    // mergeStream(stream: Stream): Stream {
    //   if (stream)
    //     this.stream = this.stream ? this.stream.pipe(require('gulp-clone')()) : stream;
    //   return this.stream;
    // }


    //--- static functions

    static copy(param?: CopyParam | CopyParam[], options: Options = {}) {
        if (!param) return Promise.resolve();   // allow null argument

        let targets = is.Array(param) ? param as CopyParam[] : [param] as CopyParam[];

        let promiseQ: Promise<any>[] = [];
        for (let target of targets) {
            if (options.verbose) msg(`[copyPlugin] copying: [${target.src}] => ${target.dest}`);
            promiseQ.push(toPromise(gulp.src(target.src).pipe(gulp.dest(target.dest))));
        }

        return Promise.all(promiseQ);
    }

    static spawn(cmd: string | ExternalCommand, args: string[] = [], options: SpawnOptions = {}) {
        return (is.Object(cmd))
            ? spawn((<ExternalCommand>cmd).command, (<ExternalCommand>cmd).args, (<ExternalCommand>cmd).options)
            : spawn(<string>cmd, args, options);
    }

    static exec(cmd: string | ExternalCommand, args: string[] = [], options: SpawnOptions = {}) {
        return exec(cmd);
        // return (is.Object(cmd))
        //     ? exec((<ExternalCommand>cmd).command, (<ExternalCommand>cmd).args, (<ExternalCommand>cmd).options)
        //     : exec(<string>cmd, args, options);
    }
}
