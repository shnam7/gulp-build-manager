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
    stream.constructor.prototype.processLint = function() {
      if (!conf.buildOptions.enableLint) return this;
      let lint = require('gulp-jshint');
      let stylish = require('jshint-stylish');
      return this
        .pipe(lint('.jshintrc'))
        .pipe(lint.reporter(stylish));
    };
    stream.constructor.prototype.processBabel = function(mopts) {
      if (!conf.buildOptions.enableBabel) return this;
      let babel = require('gulp-babel');
      return this.pipe(babel(mopts.babel))
    };
    stream.constructor.prototype.processConcat = function (outFile) {
      if (!outFile) return this;
      let concat = require('gulp-concat');
      return this.pipe(concat(outFile))
    };
    stream = stream.processLint();

    let pipeCompressed = stream.pipe(clone())
      .pipe(sourcemaps.init())
      .processBabel(mopts)
      .processConcat(conf.outFile)
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
      .processBabel(mopts)
      .processConcat(conf.outFile)
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(conf.dest));

    return mergeStream(pipeCompressed, pipeUncompressed);
  }

  OnDest(stream, mopts, conf) { return stream; }
}

export default GJavaScriptBuilder;
module.exports = GJavaScriptBuilder;
