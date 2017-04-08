/**
 *  JavaScript Builder
 */

'use strict';
import GBuilder from './GBuilder';
import gulp from 'gulp';
import nop from 'gulp-nop';
import sourcemaps from 'gulp-sourcemaps';
import clone from 'gulp-clone';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import mergeStream from 'merge-stream';


class GJavaScriptBuilder extends GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts, defaultModuleOptions) {
    return this.pick(defaultModuleOptions, ['babel', 'uglify']);
  }

  OnBuild(stream, mopts, conf) {
    let babel = conf.buildOptions.enableBabel ? require('gulp-babel') : nop;
    let lint = nop; lint.reporter= nop;
    let stylish=nop;
    if (conf.buildOptions.enableLint === true) {
      lint = require('gulp-jshint');
      stylish = require('jshint-stylish');
    }
    let concat2 = conf.outfile ? concat  : nop;
    // if (babel !== nop) console.log('GJavaScriptBuilder:using babel...');

    let source = stream
      .pipe(lint('.jshintrc'))
      .pipe(lint.reporter(stylish));

    let pipeCompressed = source.pipe(clone())
      .pipe(sourcemaps.init())
      .pipe(babel(mopts.babel))
      .pipe(concat2(conf.outfile))
      .pipe(uglify(mopts.uglify))
      .on('error', (e) => {
        console.log('Uglify:Error on File:', e.fileName);
        console.log('Uglify:Cause of Error:', e.cause);
      })
      .pipe(rename({extname: '.min.js'}))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(conf.dest));

    let pipeUncompressed = source.pipe(clone())
      .pipe(sourcemaps.init())
      .pipe(babel(mopts.babel))
      .pipe(concat2(conf.outfile))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(conf.dest));

    return mergeStream(pipeCompressed, pipeUncompressed);
  }

  OnDest(stream) { return stream; }
}

export default GJavaScriptBuilder;
module.exports = GJavaScriptBuilder;