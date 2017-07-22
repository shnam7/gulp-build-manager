/**
 *  gbm Plugin - Changed
 */

import GPlugin from '../core/GPlugin';
import upath from 'upath';
import merge from 'lodash.merge';

export default class WebPackPlugin extends GPlugin {
  constructor(options={}, slots='build') { super(options, slots); }

  process(stream, mopts, conf, slot) {
    // check for filter option (to remove .map files, etc.)
    const filter = this.options.filter || ['**', '!**/*.map'];
    if (filter) stream = stream.pipe(require('gulp-filter')(filter));

    const opts = conf.buildOptions;
    const configFile = this.options.configFile || opts.configFile;
    const wpOpts = merge(
      { output: {path: upath.resolve(conf.dest)} },         // default
      configFile ? require(upath.resolve(configFile)) : {}, // config file
      mopts.webpack,  // override config file
    );

    // if (conf.dest) merge(opts, {output:{path:upath.resolve(conf.dest)}});
    if (!conf.src) conf.src = wpOpts.entry;
    if (!conf.dest) conf.dest = wpOpts.output.path;

    return stream.pipe(require('webpack-stream')(wpOpts));
  }
}
module.exports = WebPackPlugin;