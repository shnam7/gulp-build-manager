/**
 *  gbm Plugin - Changed
 */

import * as gulp from 'gulp';
import * as upath from 'upath';
import {BuildConfig, Options, Slot, Stream} from "../core/types";
import {GBuilder} from "../core/builder";
import {GPlugin} from "../core/plugin";
import {is} from "../utils/utils";

export class WebpackPlugin extends GPlugin {

  constructor(options:Options={}, slots: Slot|Slot[]='build') { super(options, slots); }

  process(stream:Stream, mopts:Options, conf:BuildConfig, slot:Slot, builder:GBuilder) {
    // resolve: workaround function to handle platform dependency of backslashes
    const resolve = (process.platform==='win32') ? upath.win32.resolve : upath.resolve;
    const merge = require('lodash.merge');

    const opts = conf.buildOptions || {};
    const configFile = this.options.configFile || opts.webpackConfig;

    // load configFile first, and then override with mopts.webpack
    let wpOpts = merge(configFile ? require(upath.resolve(configFile)) : {}, mopts.webpack);

    // override webpack entry file with conf.src
    if (conf.src) {
      if (is.Array(conf.src)) {
        let src:string[] = [];
        (conf.src as string[]).forEach((name)=>src.push(resolve(name)));
        merge(wpOpts, {entry: src});
      }
      else
        merge(wpOpts, {entry: resolve(conf.src)});
    }

    // override webpack output settings with conf.dest and conf.outFile
    if (conf.dest) merge(wpOpts, {output: {path: conf.dest}});
    if (conf.outFile) merge(wpOpts, {output: {filename: conf.dest}});

    if (!wpOpts.output || !wpOpts.output.filename) merge(wpOpts, {output: {filename: '[name].bundle.js'}});
    console.log('a222', wpOpts.output.path, wpOpts.output.filename);

    // sanitize conf.src and conf.dest to go through gulp streams
    if (!conf.src) conf.src = wpOpts.entry;
    if (!conf.dest) conf.dest = wpOpts.output.path;

    if (!stream) stream = conf.src ? gulp.src(conf.src, mopts.gulp) : undefined;
    if (!stream) return stream;

    // check for filter option (to remove .map files, etc.)
    // const filter = this.options.filter || ['**', '!**/*.map'];
    // if (filter) stream = stream.pipe(require('gulp-filter')(filter)) as GulpStream;

    if (wpOpts.output.path) wpOpts.output.path = resolve(wpOpts.output.path);

    console.log(`Webpack Config=${JSON.stringify(wpOpts)}`);
    return stream.pipe(require('webpack-stream')(wpOpts, require('webpack')));
  }
}

export default WebpackPlugin;