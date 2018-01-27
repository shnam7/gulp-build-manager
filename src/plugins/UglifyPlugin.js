/**
 *  gbm Plugin - Uglify
 */

// import gulp from 'gulp';
import GPlugin from '../core/GPlugin';
import gulp from 'gulp';

export default class UglifyPlugin extends GPlugin {
  constructor(options={}, slots='build') { super(options, slots); }

  process(stream, mopts, conf, slot, builder) {
    const opts = conf.buildOptions || {};

    const minitfy = this.options.minify || opts.minify;
    const minifyOnly = this.options.minifyOnly || opts.minifyOnly;
    if (!minitfy && !minifyOnly) return stream;

    // flush previous build results before minify
    if (!minifyOnly) stream = builder.dest(stream, mopts, conf);

    // check for filter option (to remove .map files, etc.)
    const filter = this.options.filter || ['**', '!**/*.{map,d.ts}'];
    if (filter) stream = stream.pipe(require('gulp-filter')(filter));

    // minify
    stream = stream
      .pipe(require('gulp-uglify')(this.options.uglify || mopts.uglify))
      .on('error', (e) => {
        console.log('Uglify:Error on File:', e.fileName);
        console.log('Uglify:Cause of Error:', e.cause);
      });

    // check rename option
    return stream.pipe(require('gulp-rename')(this.options.rename || {extname:'.min.js'}));
  }
}
module.exports = UglifyPlugin;
