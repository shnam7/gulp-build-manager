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
    if (conf.buildOptions.enableLint === true) {
      let lint = require('gulp-sass-lint');
      let stylish = require('gulp-scss-lint-stylish');
      streqm.pipe(lint()) // bug:CRLF causes error
        .pipe(lint({customReport: stylish}))
        .pipe(lint.format())
        .pipe(lint.failOnError())
    }

    stream = stream
      .pipe(sourcemaps.init())
      .pipe(sass(mopts.sass).on('error', sass.logError));

    if (conf.buildOptions.enablePostCSS) {
      let postcss = require('gulp-postcss');
      let plugins = conf.buildOptions.postcss ? conf.buildOptions.postcss.plugins : [];
      stream = stream.pipe(postcss(plugins, mopts.postcss))
    }
    else
        stream = stream.pipe(autoprefixer(mopts.autoprefixer));

    let pipeUncompressed = stream.pipe(clone())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(conf.dest));

    let pipeCompressed = stream.pipe(clone())
      .pipe(rename({extname: '.min.css'}))
      .pipe(cssnano(mopts.cssnano))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(conf.dest));

    return mergeStream(pipeCompressed, pipeUncompressed);
  }

  OnDest(stream, mopts, conf) { return stream; }
}

export default GSassBuilder;
module.exports = GSassBuilder;
