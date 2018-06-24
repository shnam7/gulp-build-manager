/**
 *  gbm Plugin - Changed
 */

import * as gulp from 'gulp';
import * as upath from 'upath';
import {Options} from "../core/types";
import {GBuilder} from "../core/builder";
import {GPlugin} from "../core/plugin";
import {is, msg} from "../utils/utils";

/**
 * Configuration priorities:
 * - load webpack.config.js if buildOptions.webpackConfig is set
 * - override the config file with moduleOptions.webpack
 * - override it with builder.conf.src (src can be an array to specify multiple entries
 * - override it with builder.conf.outFile and builder.conf.dest
 */
export class WebpackPlugin extends GPlugin {

  constructor(options:Options={}) { super(options); }

  process(builder:GBuilder) {
    // resolve: workaround function to handle platform dependency of backslashes
    const resolve = (process.platform==='win32') ? upath.win32.resolve : upath.resolve;
    const merge = require('lodash.merge');

    const opts = builder.conf.buildOptions || {};
    const configFile = this.options.configFile || opts.webpackConfig;

    // load configFile first, and then override with moduleOptions.webpack
    let wpOpts = merge(configFile ? require(upath.resolve(configFile)) : {}, builder.moduleOptions.webpack);

    // override webpack entry file with conf.src
    if (builder.conf.src) {
      if (is.Array(builder.conf.src)) {
        let src:string[] = [];
        (builder.conf.src as string[]).forEach((name)=>src.push(resolve(name)));
        merge(wpOpts, {entry: src});
      }
      else
        merge(wpOpts, {entry: resolve(builder.conf.src)});
    }

    // override webpack output settings with conf.dest and conf.outFile
    if (builder.conf.dest) merge(wpOpts, {output: {path: builder.conf.dest}});
    if (builder.conf.outFile) merge(wpOpts, {output: {filename: builder.conf.outFile}});

    if (!wpOpts.output || !wpOpts.output.filename) merge(wpOpts, {output: {filename: '[name].bundle.js'}});

    // sanitize conf.src and conf.dest to go through gulp streams
    if (!builder.conf.src) builder.conf.src = wpOpts.entry;
    if (!builder.conf.dest) builder.conf.dest = wpOpts.output.path;

    if (!builder.stream)
      builder.stream = builder.conf.src ? gulp.src(builder.conf.src, builder.moduleOptions.gulp) : undefined;
    if (!builder.stream) return;
    if (wpOpts.output.path) wpOpts.output.path = resolve(wpOpts.output.path);

    msg(`Webpack Config=${JSON.stringify(wpOpts)}`);
    builder.pipe(require('webpack-stream')(wpOpts, require('webpack')));
  }
}

export default WebpackPlugin;
