/**
 *  Builder Base Class
 */

import * as gulp from 'gulp';
import {BuildConfig, BuildFunction, BuildFunctionObject, Options, Plugin, Stream} from "./types";
import {GPlugin} from "./plugin";
import {is, toPromise} from "../utils/utils";
import {GReloader} from "./reloader";

export class GBuilder {
  stream: Stream;
  streamQ: Stream[] = [];
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

  async _build(conf: BuildConfig) {    //: Promise<void | GulpStream | this>
    // reset variables
    this.conf = conf;
    this.buildOptions = conf.buildOptions || {};
    this.moduleOptions = conf.moduleOptions || {};

    await this._run(this.conf.preBuild);
    await this.build();
    await this.reload();
    await this._run(this.conf.postBuild);
    if (this.conf.flushStream) return toPromise(this.stream);
  }

  build(): void | Promise<this | void> {
    return this.customBuildFunc(this);
  }


  /**----------------------------------------------------------------
   * Build utility functions: Returns value should be 'this'
   *----------------------------------------------------------------*/

  src(src?: string | string[]) {
    if (!src) src = this.conf.src;
    if (!src) return this;

    this.stream = gulp.src(src, this.moduleOptions.gulp);

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
    action instanceof GPlugin
      ? (action as GPlugin).process(this, ...args)
      : action(this, ...args);
    return this;
  }

  sourceMaps(options: Options = {}) {
    if (!this.buildOptions.sourceMap) return this;

    const smOpts = options.sourcemaps || this.moduleOptions.sourcemaps || {};
    if (options.init)
      this.pipe(require('gulp-sourcemaps').init(smOpts.init));
    else
      this.pipe(require('gulp-sourcemaps').write(smOpts.dest || '.', smOpts.write));
    return this;
  }

  reload() {
    if (this.buildOptions.reload !== false && this.reloader)
      this.reloader.reload(this.stream, this.moduleOptions, this.buildOptions.watch);
    return this;
  }

  toPromise(stream: Stream) {
    return toPromise(stream || this.stream);
  }
}
