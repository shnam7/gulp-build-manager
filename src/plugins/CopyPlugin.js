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
      let copyStream = gulp.src(copyItem.src);
      if (conf.flushStream) {
        builder.promise.push(new Promise((resolve, reject)=>{
          copyStream.pipe(gulp.dest(copyItem.dest))
            .on('end', resolve)
            .on('error', reject);
        }));
      }
      else
        copyStream.pipe(gulp.dest(copyItem.dest))
    }
    return stream;
  }
}
module.exports = CopyPlugin;
