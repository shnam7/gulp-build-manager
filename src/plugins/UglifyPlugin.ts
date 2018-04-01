/**
 *  gbm Plugin - Uglify
 */

import {BuildConfig, GulpStream, Options, Slot} from "../core/types";
import {GBuilder} from "../core/builder";
import {GPlugin} from "../core/plugin";
import {toPromise} from "../utils/utils";

export class UglifyPlugin extends GPlugin {
  constructor(options:Options={}, slots: Slot|Slot[]='build') { super(options, slots); }

  OnStream(stream:GulpStream, mopts:Options, conf:BuildConfig, slot:Slot, builder:GBuilder) {
    const opts = conf.buildOptions || {};

    const minitfy = this.options.minify || opts.minify;
    const minifyOnly = this.options.minifyOnly || opts.minifyOnly;
    if (!minitfy && !minifyOnly) return stream;

    // clone stream to write current build results before minify
    if (stream && !minifyOnly) {
      let destStream = stream.pipe(require('gulp-clone')());
      builder.promises.push(toPromise(builder.dest(destStream, mopts, conf)))
    }

    // check for filter option (to remove .map files, etc.)
    const filter = this.options.filter || ['**', '!**/*.{map,d.ts}'];
    if (filter) stream = stream.pipe(require('gulp-filter')(filter));

    // minify
    stream = stream
      .pipe(require('gulp-uglify')(this.options.uglify || mopts.uglify))
      .on('error', (e:any) => {
        console.log('Uglify:Error on File:', e.fileName);
        console.log('Uglify:Cause of Error:', e.cause);
      });

    // check rename option
    return stream.pipe(require('gulp-rename')(this.options.rename || {extname:'.min.js'}));
  }
}

export default UglifyPlugin;