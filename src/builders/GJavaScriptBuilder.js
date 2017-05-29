/**
 *  JavaScript Builder
 */

'use strict';
import GBuilder from './GBuilder';
import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import save from 'gulp-save';
import upath from 'upath';
import is from './../utils/is';

class GJavaScriptBuilder extends GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts, defaultModuleOptions) {
    return this.pick(defaultModuleOptions, ['babel', 'uglify']);
  }

  OnBuild(stream, mopts, conf) {
    // check lint
    if (conf.buildOptions && conf.buildOptions.enableLint) {
      let lint = require('gulp-jshint');
      let stylish = require('jshint-stylish');
      stream = stream.pipe(lint('.jshintrc')).pipe(lint.reporter(stylish));
    }
    stream = stream.pipe(sourcemaps.init());

    // check babel
    if (conf.buildOptions && conf.buildOptions.enableBabel) {
      let babel = require('gulp-babel');
      stream = stream.pipe(babel(mopts.babel));
    }

    // check outFile
    if (conf.outFile) {
      let concat = require('gulp-concat');
      let uglify = require('gulp-uglify');
      let rename = require('gulp-rename');
      let cacheOutFile = conf.src + 'outFile';
      let dest = is.String(conf.dest) ? conf.dest : process.cwd();

      stream = stream
        // process concat
        .pipe(concat(upath.resolve(dest, conf.outFile)))
        .pipe(save(cacheOutFile))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('.'))

        // uglify
        .pipe(save.restore(cacheOutFile)).pipe(save.clear(cacheOutFile))
        .pipe(sourcemaps.init())
        .pipe(uglify(mopts.uglify))
        .on('error', (e) => {
          console.log('Uglify:Error on File:', e.fileName);
          console.log('Uglify:Cause of Error:', e.cause);
        })
        .pipe(rename({extname: '.min.js'}))
    }
    return stream.pipe(sourcemaps.write('.'));
  }
}

export default GJavaScriptBuilder;
module.exports = GJavaScriptBuilder;
