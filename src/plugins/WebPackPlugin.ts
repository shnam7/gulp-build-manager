/**
 *  gbm Plugin - Changed
 */

import * as upath from 'upath';
import {BuildConfig, GulpStream, Options, Slot} from "../core/types";
import {GBuilder} from "../core/builder";
import {GPlugin} from "../core/plugin";

export class WebPackPlugin extends GPlugin {
  constructor(options:Options={}, slots: Slot|Slot[]='build') { super(options, slots); }

  OnStream(stream:GulpStream, mopts:Options, conf:BuildConfig, slot:Slot, builder:GBuilder) {
    // check for filter option (to remove .map files, etc.)
    const filter = this.options.filter || ['**', '!**/*.map'];
    if (filter) stream = stream.pipe(require('gulp-filter')(filter));

    const opts = conf.buildOptions || {};
    const configFile = this.options.configFile || opts.configFile;
    let wpOpts = Object.assign(
      { output: {path: upath.resolve(conf.dest), filename:'[name].bundle.js'}},         // default
      configFile ? require(upath.resolve(configFile)) : {}, mopts.webpack);  // override config file

    if (conf.dest) Object.assign(wpOpts, {output:{path:upath.resolve(conf.dest)}});
    if (!conf.src) conf.src = wpOpts.entry;
    if (!conf.dest) conf.dest = wpOpts.output.path;

    return stream.pipe(require('webpack-stream')(wpOpts));
  }
}

export default WebPackPlugin;