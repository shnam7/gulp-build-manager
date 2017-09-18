/**
 *  gbm Plugin - Copy
 */

import gulp from 'gulp';
import GPlugin from '../core/GPlugin';

export default class CopyPlugin extends GPlugin {
  constructor(options={}, slots='build') { super(options, slots); }

  process(stream, mopts, conf, slot, builder) {
    for (let copyItem of this.options) {
      console.log(`[CopyPlugin] copying: [${copyItem.src}] => ${copyItem.dest}`);
      gulp.src(copyItem.src).pipe(gulp.dest(copyItem.dest))
    }
    return stream;
  }
}
module.exports = CopyPlugin;
