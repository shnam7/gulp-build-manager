/**
 *  gbm Plugin - Debug
 */

import GPlugin from '../core/GPlugin';
import merge from 'lodash.merge';

export default class DebugPlugin extends GPlugin {
  constructor(options={}, slots='build') { super(options, slots); }

  process(stream, mopts, conf, slot) {
    let debug = require('gulp-debug');
    let title = this.options ? this.options.title : "";
    title = title ? title+':' : "";
    title = '[DebugPlugin]' + slot + ':' + title;
    let opts = merge({}, this.options, {title: title});
    return stream.pipe(debug(opts));
  }
}
module.exports = DebugPlugin;