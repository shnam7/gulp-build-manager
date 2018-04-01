/**
 *  Builder Base Class
 */


import * as gulp from 'gulp';
import {pick} from "../utils/utils";
import {BuildConfig, Options, Plugin, Stream, TaskDoneFunction} from "../core/types";
import {GPlugin} from "./plugin";
import {PluginFunction, PluginObject, Slot, WatchOptions} from "./types";
import {is, toPromise} from "../utils/utils";
import {GReloader} from "./reloader";

export class GBuilder {
  plugins: Plugin[] = [];
  promises: Promise<void>[] = [];
  reloader: undefined | GReloader = undefined;

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
    stream = this.processPlugins(stream, mopts, conf, 'initStream');
    stream = this.processPlugins(this.OnBuild(stream, mopts, conf), mopts, conf, 'build');
    stream = this.processPlugins(this.OnDest(stream, mopts, conf), mopts, conf, 'dest');
    stream = this.processPlugins(this.OnPostBuild(stream, mopts, conf), mopts, conf, 'postBuild');
    stream = this.reload(stream, conf, mopts);
    this.promises.push(toPromise(stream));
    Promise.all(this.promises).then(() => done());
  }

  OnInitModuleOptions(mopts:Options={}, defaultModuleOptions:Options={}, conf:BuildConfig) {
    Object.assign(mopts, pick(defaultModuleOptions, 'gulp','changed','order'));
    Object.assign(mopts, this.OnBuilderModuleOptions(mopts, defaultModuleOptions, conf));
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
    return this.initSourceMaps(stream, conf.buildOptions, mopts);
  }

  OnBuild(stream:Stream, mopts:Options={}, conf:BuildConfig) { return stream; }

  OnDest(stream:Stream, mopts:Options={}, conf:BuildConfig) {
    return stream && this.dest(stream, mopts, conf)
  }

  OnPostBuild(stream:Stream, mopts:Options={}, conf:BuildConfig) { return stream; }

  /**
   *
   * Add builder plugins
   * @param plugins can be GPlugin, {}, or plugin function with arguments(stream,conf, builder)
   */
  dest(stream:Stream, mopts:Options={}, conf:BuildConfig, path?:string) {
    let opts = mopts.gulp || {};
    if (stream) stream.pipe(gulp.dest(path || conf.dest || '.', opts.dest));
    if (conf.flushStream) this.promises.push(toPromise(stream));
    return stream;
  }

  addPlugins(plugins:Plugin | Plugin[]) {
    if (is.Array(plugins))
      this.plugins = this.plugins.concat((plugins as Plugin[])
        .filter(el=>el && !(el.constructor.name==='NullPlugin')));  // filter invalid plugin entries
    else if (plugins)
      this.plugins.push(plugins as Plugin);
  }

  processPlugins(stream:Stream, mopts:Options, conf:BuildConfig, slot:Slot) {
    let plugins = conf.plugins ? this.plugins.concat(conf.plugins) : this.plugins;
    if (plugins.length<=0) return stream;

    for (let plugin of plugins) {
      if (plugin instanceof GPlugin)
        stream = plugin.processPlugin(stream, mopts, conf, slot, this);
      else if (is.Function(plugin) && slot==='build')
        stream = (plugin as PluginFunction)(stream, mopts, conf, slot, this);
      else {
        let func = (plugin as PluginObject)[slot];
        if (func) stream = func(stream, mopts, conf, slot, this);
      }
    }
    return stream;
  }

  initSourceMaps(stream:Stream, buildOptions:Options={}, mopts:Options={}) {
    if (buildOptions.sourceMap && stream) {
      const smOpts = mopts.sourcemaps || {};
      stream = stream.pipe(require('gulp-sourcemaps').init(smOpts.init));
    }
    return stream;
  }

  processSourceMaps(stream:Stream, pluginOptions:Options={}, buildOptions:Options={}, mopts:Options={}) {
    const sourceMap = pluginOptions.sourceMap || buildOptions.sourceMap;
    const smOpts = pluginOptions.sourcemaps || mopts.sourcemaps || {};
    if (sourceMap && stream) stream = stream.pipe(require('gulp-sourcemaps').write(smOpts.dest || '.', smOpts.write));
    return stream;
  }

  reload(stream: Stream, buildOptions:Options, mopts:Options={}) {
    if (buildOptions.reload === false) return stream;
    if (this.reloader) return this.reloader.reload(stream, mopts, buildOptions.watch);
    return stream;
  }
}