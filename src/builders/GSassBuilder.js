/**
 *  Sass/Scss Builder
 */

'use strict';
import GBuilder from './GBuilder';
import gulp from 'gulp';
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
    stream.constructor.prototype.processLint = function() {
      if (!conf.buildOptions.enableLint) return this;
      let lint = require('gulp-sass-lint');
      let stylish = require('gulp-scss-lint-stylish');
      return this.pipe(lint()) // bug:CRLF causes error
        .pipe(lint({customReport: stylish}))
        .pipe(lint.format())
        .pipe(lint.failOnError())
    };
    stream.constructor.prototype.processPostCSS = function(mopts) {
      if (!conf.buildOptions.enablePostCSS) return this.pipe(autoprefixer(mopts.autoprefixer));
      let postcss = require('gulp-postcss');
      let plugins = conf.buildOptions.postcss ? conf.buildOptions.postcss.plugins : [];
      return this.pipe(postcss(plugins, mopts.postcss));
    };

    stream = stream.processLint()
      .pipe(sourcemaps.init())
      .pipe(sass(mopts.sass).on('error', sass.logError))
      .processPostCSS(mopts);
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
