/**
 *  JavaScript Builder
 */

'use strict';
import GBuilder from './GBuilder';
import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import clone from 'gulp-clone';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import mergeStream from 'merge-stream';


class GJavaScriptBuilder extends GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts, defaultModuleOptions) {
    return this.pick(defaultModuleOptions, ['babel', 'uglify']);
  }

  OnBuild(stream, mopts, conf) {
    let babel = require(conf.buildOptions.enableBabel ? 'gulp-babel' : 'nop');
    let concat = require(conf.outFile ? 'gulp-concat' : 'nop');

    if (conf.buildOptions.enableLint === true) {
      let lint = require('gulp-jshint');
      let stylish = require('jshint-stylish');
      stream = stream
        .pipe(lint('.jshintrc'))
        .pipe(lint.reporter(stylish));
    }

    let pipeCompressed = stream.pipe(clone())
      .pipe(sourcemaps.init())
      .pipe(babel(mopts.babel))
      .pipe(concat(conf.outFile))
      .pipe(uglify(mopts.uglify))
      .on('error', (e) => {
        console.log('Uglify:Error on File:', e.fileName);
        console.log('Uglify:Cause of Error:', e.cause);
      })
      .pipe(rename({extname: '.min.js'}))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(conf.dest));

    let pipeUncompressed = stream.pipe(clone())
      .pipe(sourcemaps.init())
      .pipe(babel(mopts.babel))
      .pipe(concat(conf.outFile))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(conf.dest));

    return mergeStream(pipeCompressed, pipeUncompressed);
  }

  OnDest(stream, mopts, conf) { return stream; }
}

export default GJavaScriptBuilder;
module.exports = GJavaScriptBuilder;
