/**
 *  Builder Base Class
 */

import * as gulp from 'gulp';
import {BuildConfig, BuildFunction, BuildFunctionObject, GulpStream, Options, Plugin, Stream} from "./types";
import {GPlugin} from "./plugin";
import {info, is, toPromise} from "../utils/utils";
import {GReloader} from "./reloader";
import * as filter from "gulp-filter";

export class GBuilder {
  stream: Stream;
  streamQ: Stream[] = [];
  promiseQ: Promise<any>[] = [];
  conf: BuildConfig = {buildName: ''};
  buildOptions: Options = {};
  moduleOptions: Options = {};
  reloader: undefined | GReloader = undefined;

  protected customBuildFunc = (builder: GBuilder) => {
    this.src().dest();
  };

  constructor(buildFunc?: BuildFunction) {
    if (buildFunc) this.customBuildFunc = buildFunc;
  }

  protected _run(action?: BuildFunction | BuildFunctionObject) {
    if (is.Function(action)) return (action as BuildFunction)(this);
    if (is.Object(action)) return (action as BuildFunctionObject)
      .func(this, ...(action as BuildFunctionObject).args);
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
      promise = this.chain(GPlugin.copy, {targets: this.conf.copy});
      if (this.conf.flushStream) await promise;
    }

    // postBuild
    await this._run(this.conf.postBuild);

    // and then, reload (after all process including postBuild
    await this.reload();
    return promise;
  }

  build(): void | Promise<this | void> {
    return this.customBuildFunc(this);
  }


  /**----------------------------------------------------------------
   * Builder API functions: Returns value should be 'this'
   *----------------------------------------------------------------*/

  src(src?: string | string[]) {
    if (!src) src = this.conf.src;
    if (!src) return this;

    this.stream = gulp.src(src, this.moduleOptions.gulp && this.moduleOptions.gulp.src);

    // check input file ordering
    if (this.conf.order && this.conf.order.length > 0) {
      let order = require('gulp-order');
      this.pipe(order(this.conf.order, this.moduleOptions.order));
    }

    // check sourceMap option
    return this.sourceMaps({init: true});
  }

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

  dest(path?: string) {
    let opts = this.moduleOptions.gulp || {};
    this.pipe(gulp.dest(path || this.conf.dest || '.', opts.dest));
    return this;
  }

  pipe(destination: NodeJS.WritableStream, options?: { end?: boolean; }): this {
    if (this.stream)
      this.stream = this.stream.pipe(destination as NodeJS.WritableStream, options) as Stream;
    return this;
  }

  on(event: string | symbol, listener: (...args: any[]) => void): this {
    if (this.stream) this.stream = this.stream.on(event, listener);
    return this;
  }

  chain(action: Plugin, ...args: any[]): this {
    // note: return value is discarded to keep AIP interface of returning this
    this.call(action, ...args);
    return this;
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

  debug(options: Options={}) {
    let title = options.title ? options.title : '';
    // title = `[debugPlugin${title ? ':' + title : ''}]`;
    let opts = Object.assign({}, this.moduleOptions.debug, options, {title});
    return this.pipe(require('gulp-debug')(opts));
  }

  filter(pattern: string | string[] | filter.FileFunction = ["**", "!**/*.map"], options: filter.Options = {}) {
    let opts = Object.assign({}, this.moduleOptions.filter, options);
    return this.pipe(require('gulp-filter')(pattern, opts))
  }

  rename(options: Options={}) {
    const opts = Object.assign({}, this.moduleOptions.rename, options.rename || options);
    return this.pipe(require('gulp-rename')(opts));
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
    return this.filter().chain(GPlugin.cleanCss)
      .rename({extname: '.min.css'}).sourceMaps();
  }

  minifyJs() {
    return this.filter().chain(GPlugin.uglify)
      .rename({extname: '.min.js'}).sourceMaps();
  }


  /**----------------------------------------------------------------
   * Builder utility functions: Return values can be anything
   *----------------------------------------------------------------*/
  call(action: Plugin, ...args: any[]): void | Promise<any> {
    return action instanceof GPlugin
      ? (action as GPlugin).process(this, ...args)
      : action(this, ...args);
  }
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
}
