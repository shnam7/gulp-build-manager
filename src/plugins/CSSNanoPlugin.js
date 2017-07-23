/**
 *  gbm Plugin - CSSNano
 */

import GPlugin from '../core/GPlugin';
import gulp from 'gulp';

export default class CSSNanoPlugin extends GPlugin {
  constructor(options={}, slots='build') { super(options, slots); }

  process(stream, mopts, conf, slot) {
    const opts = conf.buildOptions || {};
    const minitfy = this.options.minify || opts.minify;
    const minifyOnly = this.options.minifyOnly || opts.minifyOnly;
    if (!minitfy && !minifyOnly) return stream;

    // flush previous build results before minify
    if (!minifyOnly) stream = stream.pipe(gulp.dest(conf.dest));

    // check for filter option (to remove .map files, etc.)
    const filter = this.options.filter || ['**', '!**/*.map'];
    if (filter) stream = stream.pipe(require('gulp-filter')(filter));

    // minify
    stream = stream.pipe(require('gulp-cssnano')(this.options.cssnano || mopts.cssnano));

    // check rename option
    return stream.pipe(require('gulp-rename')(this.options.rename || {extname:'.min.css'}));
  }
}
module.exports = CSSNanoPlugin;
