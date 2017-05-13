/**
 *  Sass/Scss Builder
 */

'use strict';
import GBuilder from './GBuilder';
import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import save from 'gulp-save';
import sass from 'gulp-sass';
import cssnano from 'gulp-cssnano';


class GSassBuilder extends GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts, defaultModuleOptions) {
    return this.pick(defaultModuleOptions, ['sass', 'cssnano']);
  }

  OnBuild(stream, mopts, conf) {
    if (conf.buildOptions && conf.buildOptions.enableLint) {
      let lint = require('gulp-sass-lint');
      let stylish = require('gulp-scss-lint-stylish');
      stream = stream.pipe(lint()) // bug:CRLF causes error
        .pipe(lint({customReport: stylish}))
        .pipe(lint.format())
        .pipe(lint.failOnError())
    }
    stream = stream
      .pipe(sourcemaps.init())
      .pipe(sass(mopts.sass).on('error', sass.logError));

    if (conf.buildOptions && conf.buildOptions.enablePostCSS) {
      let postcss = require('gulp-postcss');
      let plugins = (conf.buildOptions && conf.buildOptions.postcss) ? conf.buildOptions.postcss.plugins : [];
      stream = stream.pipe(postcss(plugins, mopts.postcss));
    }
    else {
      let autoprefixer = require('gulp-autoprefixer');
      stream = stream.pipe(autoprefixer(mopts.autoprefixer));
    }

    // create unique cache name to avoid colision with other parallel tasks
    let cacheCSS = conf.src + 'cssFiles';
    return stream
      .pipe(save(cacheCSS))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(conf.dest))

      .pipe(save.restore(cacheCSS)).pipe(save.clear(cacheCSS))
      .pipe(sourcemaps.init())
      .pipe(rename({extname: '.min.css'}))
      .pipe(cssnano(mopts.cssnano))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(conf.dest));
  }
}

export default GSassBuilder;
module.exports = GSassBuilder;
