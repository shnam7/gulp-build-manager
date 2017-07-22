/**
 *  gbm Plugin - Uglify
 */

import GPlugin from '../core/GPlugin';
import gulp from 'gulp';

export default class DestPlugin extends GPlugin {
  constructor(options={}, slots='build') { super(options, slots); }

  process(stream, mopts, conf, slot) {
    return stream.pipe(gulp.dest(this.options.dest || conf.dest));
  }
}
module.exports = DestPlugin;
