/**
 *  gbm Plugin - Changed
 */

import * as upath from 'upath';
import {Options, Slot, Stream} from "../core/types";
import {GBuilder} from "../core/builder";
import {GPlugin} from "../core/plugin";
import {deepmerge} from "../core/utils";

export class WebPackPlugin extends GPlugin {
  constructor(options:Options={}, slots: Slot|Slot[]='build') { super(options, slots); }

  process(stream:Stream, mopts:Options, conf:Options, slot:Slot, builder:GBuilder) {
    // check for filter option (to remove .map files, etc.)
    const filter = this.options.filter || ['**', '!**/*.map'];
    if (filter && stream) stream = stream.pipe(require('gulp-filter')(filter));

    const opts = conf.buildOptions || {};
    const configFile = this.options.configFile || opts.configFile;
    let wpOpts = deepmerge(
      { output: {path: upath.resolve(conf.dest), filename:'[name].bundle.js'}},         // default
      configFile ? require(upath.resolve(configFile)) : {});
    wpOpts = deepmerge(wpOpts, mopts.webpack);  // override config file

    if (conf.dest) wpOpts = deepmerge(wpOpts, {output:{path:upath.resolve(conf.dest)}});
    if (!conf.src) conf.src = wpOpts.entry;
    if (!conf.dest) conf.dest = wpOpts.output.path;

    return stream && stream.pipe(require('webpack-stream')(wpOpts));
  }
}

export default WebPackPlugin;