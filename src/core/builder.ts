/**
 *  Builder Base Class
 */


import * as gulp from 'gulp';
import {pick} from "../core/utils";
import {BuildConfig, Options, Plugin, Stream, TaskDoneFunction} from "../core/types";
import {GPlugin} from "./plugin";

export class GBuilder {
  plugins: Plugin[] = [];
  promises: Promise<void>[] = [];

  constructor() {}

  build(defaultModuleOptions:Options, conf:BuildConfig, done:TaskDoneFunction) {
    let mopts = this.OnInitModuleOptions({}, defaultModuleOptions || {}, conf || {});

    // reset variables
    this.plugins = []; // caution: if not cleared here, added plugins can be accumulated
    this.promises = []; // caution: if not cleared here, promises will be accumulated

    let ret = this.OnPreparePlugins(mopts, conf);
    if (ret) this.plugins = ret;

    // console.log(`'mopts for:${conf.buildName}:`, mopts);
    let stream = this.OnInitStream(mopts, defaultModuleOptions, conf);
    let plugins = conf.plugins ? this.plugins.concat(conf.plugins) : this.plugins;
    let processPlugins = GPlugin.processPlugins;
    stream = processPlugins(plugins, stream, mopts, conf, 'initStream', this);
    stream = processPlugins(plugins, this.OnBuild(stream, mopts, conf), mopts, conf, 'build', this);
    stream = processPlugins(plugins, this.OnDest(stream, mopts, conf), mopts, conf, 'dest', this);
    processPlugins(plugins, this.OnPostBuild(stream, mopts, conf), mopts, conf, 'postBuild', this);
    Promise.all(this.promises).then(()=>done());
  }

  OnInitModuleOptions(mopts:Options={}, defaultModuleOptions:Options={}, conf:BuildConfig) {
    Object.assign(mopts, pick(defaultModuleOptions, 'gulp','changed','order','livereload'));
    Object.assign(mopts, this.OnBuilderModuleOptions(mopts, defaultModuleOptions, conf))
    Object.assign(mopts, conf.moduleOptions);
    return mopts;
  }

  OnPreparePlugins(mopts:Options={}, conf:BuildConfig): void {}

  OnBuilderModuleOptions(mopts:Options={}, defaultModuleOptions:Options={}, conf:BuildConfig) { return {}; }

  OnInitStream(mopts:Options={}, defaultModuleOptions:Options={}, conf:BuildConfig) {
    let stream = conf.src ? gulp.src(conf.src, mopts.gulp) : undefined;

    // check input file ordering
    if (conf.order && conf.order.length > 0) {
      let order = require('gulp-order');
      stream = stream && stream.pipe(order(conf.order, mopts.order));
    }
    return GPlugin.initSourceMaps(stream, conf.buildOptions, mopts);
  }

  OnBuild(stream:Stream, mopts:Options={}, conf:BuildConfig) { return stream; }

  OnDest(stream:Stream, mopts:Options={}, conf:BuildConfig) {
    return stream && this.dest(stream, mopts, conf)
  }

  OnPostBuild(stream:Stream, mopts:Options={}, conf:BuildConfig) {
    if (conf.watch && conf.watch.livereload && stream)
      stream = stream.pipe(require('gulp-livereload')(mopts.livereload));
    return stream;
  }

  /**
   *
   * Add builder plugins
   * @param plugins can be GPlugin, {}, or plugin function with arguments(stream,conf, builder)
   */
  addPlugins(plugins: Plugin | Plugin[]) {
    this.plugins = GPlugin.addPlugins(this.plugins, plugins);
  }

  dest(stream:Stream, mopts:Options={}, conf:BuildConfig, path?:string) {
    if (stream) {
      const opts = mopts.gulp;
      if (conf.flushStream)
        this.promises.push(new Promise((resolve, reject)=>{
          stream.pipe(gulp.dest(path || conf.dest || '.', opts.dest))
            .on('finish', resolve)
            .on('error', reject);
        }));
      else {
        return stream.pipe(gulp.dest(path || conf.dest || '.', opts.dest));
      }
    }
    return stream;
  }
}