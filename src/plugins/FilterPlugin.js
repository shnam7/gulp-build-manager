/**
 *  gbm Plugin - Filter
 */

import GPlugin from '../core/GPlugin';

export default class FilterPlugin extends GPlugin {
  constructor(patterns, options={}, slots='build') {
    super(options, slots);
    this.patterns = patterns;
    this._filter = undefined;
  }

  process(stream, mopts, conf, builder, slot) {
    this._filter = require('gulp-filter');
    return stream.pipe(this._filter(this.patterns, this.options));
  }

  restore(stream) {
    return stream && stream.pipe(this._filter.restore);
  }
}
module.exports = FilterPlugin;
