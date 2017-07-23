/**
 *  WebPack Builder
 */

'use strict';
import gbm from '../';
import gulp from 'gulp';
import upath from 'upath';
import merge from 'lodash.merge';

export default class GWebPackBuilder extends gbm.GBuilder {
  constructor() { super(); }

  // OnInitStream(mopts, defaultModuleOptions, conf) {
  //   // let buildOptions = conf.buildOptions || {;
  //   // let opts = merge({},
  //   //   conf.dest ? {output:{path:upath.resolve(conf.dest)}} : {},
  //   //   buildOptions.configFile ? require(upath.resolve(buildOptions.configFile)) : {},
  //   //   mopts.webpack
  //   // );
  //   // if (conf.buildOptions)
  //   //   merge(opts, is.String(conf.buildOptions.webpack)
  //   //     ? require(upath.resolve(conf.buildOptions.webpack))
  //   //     : conf.buildOptions.webpack
  //   //   );
  //   // if (conf.dest) merge(opts, {output:{path:upath.resolve(conf.dest)}});
  //   if (!conf.src) conf.src = opts.entry;
  //   if (!conf.dest) conf.dest = opts.output.path;
  //   mopts.webpack = opts;
  //
  //   return super.OnInitStream(mopts, defaultModuleOptions, conf);
  // }

  OnBuilderModuleOptions(mopts, defaultModuleOptions) {
    return this.pick(defaultModuleOptions, ['webpack']);
  }

  OnPreparePlugins(mopts, conf) {
    this.addPlugins([
      new gbm.WebPackPlugin()
    ]);
    // let buildOptions = conf.buildOptions || {};
    // if (buildOptions.minify) this.addPlugins(new gbm.UglifyPlugin({
    //   sourceMap: buildOptions.sourceMap,
    //   filter: ['**', '!**/*.{map,d.ts}']
    // }))
  }

  // OnBuild(stream, mopts, conf) {
  //   let buildOptions = conf.buildOptions || {};
  //   let wpOpts = merge(
  //     {output: {filename: '[name].bundle.js'},},
  //     buildOptions.sourceMap ? {devtool: 'source-map'} : {},
  //     conf.dest ? {output: {path: upath.resolve(conf.dest)}} : {},
  //     buildOptions.configFile ? require(upath.resolve(buildOptions.configFile)) : {},
  //     mopts.webpack
  //   );
  //
  //   if (!stream) stream = gulp.src(wpOpts.entry);
  //   return stream.pipe(require('webpack-stream')(wpOpts));
  // }
}
module.exports = GWebPackBuilder;
