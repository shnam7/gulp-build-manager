/**
 *  Builder Base Class
 */

'use strict';
import gulp from 'gulp';
import merge from 'lodash.merge';
import pick from 'lodash.pick';
import GPlugin from '../core/GPlugin';

export default class GBuilder {
  constructor() {
    this._plugins = [];
    this.done = [];
  }

  build(defaultModuleOptions, conf, done) {
    this.done = done;   // save done function.
    let mopts = {};
    merge(mopts, this.OnInitModuleOptions(mopts, defaultModuleOptions, conf));

    // reset plugins
    this._plugins = []; // caution: if not cleared here, added plugins can be accumulated
    let ret = this.OnPreparePlugins(mopts, conf);
    if (ret) this._plugins = ret;

    // console.log(`'mopts for:${conf.buildName}:`, mopts);
    let stream = this.OnInitStream(mopts, defaultModuleOptions, conf);
    let plugins = conf.plugins ? this._plugins.concat(conf.plugins) : this._plugins;
    let processPlugins = GPlugin.processPlugins;
    stream = processPlugins(plugins, stream, mopts, conf, 'initStream');
    stream = processPlugins(plugins, this.OnBuild(stream, mopts, conf), mopts, conf, 'build');
    stream = processPlugins(plugins, this.OnDest(stream, mopts, conf), mopts, conf, 'dest');
    stream = processPlugins(plugins, this.OnPostBuild(stream, mopts, conf), mopts, conf, 'postBuild');
    return stream || this.done ? this.done() : undefined;
  }

  OnInitModuleOptions(mopts, defaultModuleOptions, conf) {
    merge(mopts, pick(defaultModuleOptions, ['gulp','changed','order','livereload']));
    merge(mopts, this.OnBuilderModuleOptions(mopts, defaultModuleOptions));
    merge(mopts, conf.moduleOptions);
  }

  OnPreparePlugins(mopts, conf) { return []; }

  OnBuilderModuleOptions(mopts, defaultModuleOptions, conf) {}

  OnInitStream(mopts, defaultModuleOptions, conf) {
    let stream = conf.src && gulp.src(conf.src, mopts.gulp);

    // check input file ordering
    if (conf.order && conf.order.length > 0) {
      let order = require('gulp-order');
      stream = stream.pipe(order(conf.order, mopts.order));
    }
    return GPlugin.initSourceMaps(stream, conf.buildOptions, mopts);
  }

  OnBuild(stream, mopts, conf) { return stream; }

  OnDest(stream, mopts, conf) {
    return stream && stream.pipe(gulp.dest(conf.dest));
  }

  OnPostBuild(stream, mopts, conf) {
    if (conf.watch && conf.watch.livereload && stream)
      stream = stream.pipe(require('gulp-livereload')(mopts.livereload));
    return stream;
  }

  /**
   *
   * Add builder plugins
   * @param plugins can be GPlugin, {}, or plugin function with arguments(stream,conf, builder)
   */
  addPlugins(plugins) {
    this._plugins = GPlugin.addPlugins(this._plugins, plugins);
  }

  pick(...arg) { return pick(...arg); }
  merge(...arg) { return merge(...arg); }
}

module.exports = GBuilder;    // interface for require() call
