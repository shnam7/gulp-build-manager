/**
 *  Sass/Scss Builder
 */

'use strict';
import GBuilder from './GBuilder';
import gulp from 'gulp';
import nop from 'gulp-nop';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import clone from 'gulp-clone';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import cssnano from 'gulp-cssnano';
import mergeStream from 'merge-stream';


class GSassBuilder extends GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts, defaultModuleOptions) {
    return this.pick(defaultModuleOptions, ['sass', 'cssnano']);
  }

  OnBuild(stream, mopts, conf) {
    let lint = nop;
    lint.format = nop;
    lint.failOnError = nop;
    let stylish = nop;
    if (conf.buildOptions.enableLint === true) {
      lint = require('gulp-sass-lint');
      stylish = require('gulp-scss-lint-stylish');
    }

    let source = stream
      .pipe(lint()) // bug:CRLF causes error
      .pipe(lint({customReport: stylish}))
      .pipe(lint.format())
      .pipe(lint.failOnError())
      .pipe(sass(mopts.sass).on('error', sass.logError))
      .pipe(sourcemaps.init())
      .pipe(autoprefixer(mopts.autoprefixer));

    let pipeUncompressed = source.pipe(clone())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(conf.dest));

    let pipeCompressed = source.pipe(clone())
      .pipe(rename({extname: '.min.css'}))
      .pipe(cssnano(mopts.cssnano))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(conf.dest));

    return mergeStream(pipeCompressed, pipeUncompressed);
  }

  OnDest(stream, mopts, conf) {
    if (conf.watch && conf.watch.livereload) {
      let livereload = require('gulp-livereload');
      return stream.pipe(livereload());
    }
    return stream;
  }
}

export default GSassBuilder;
module.exports = GSassBuilder;
