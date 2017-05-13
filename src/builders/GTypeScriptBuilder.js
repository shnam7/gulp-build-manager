/**
 *  TypeScript Builder
 */

'use strict';
import GBuilder from './GBuilder';
import typescript from 'gulp-typescript';
import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import save from 'gulp-save';
import upath from 'upath';
import is from './../utils/is';

class GTypeScriptBuilder extends GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts, defaultModuleOptions) {
    this.merge(mopts, this.pick(defaultModuleOptions, ['typescript']));
    this.merge(mopts, {changed:{extension: '.js'}});
  }

  OnBuild(stream, mopts, conf) {
    let tsProject = undefined;
    try {
      tsProject = typescript.createProject(conf.buildOptions.tsConfig, mopts.typescript);
    }
    catch (e) {
      if (e.code !== 'ENOENT') throw e;
      console.log('WARN: buildOptions.tsConfig specified but not found:', upath.resolve(conf.buildOptions.tsConfig));
      tsProject = typescript.createProject(mopts.typescript);
    }

    // create unique cache name to avoid colision with other parallel tasks
    let cacheJS = conf.src + 'jsFiles';
    let cacheOutFile = conf.src + 'outFile';

    // transpile .ts files
    stream = stream
      .pipe(sourcemaps.init())
      .pipe(tsProject()).js
      .pipe(save(cacheJS))
      .pipe(sourcemaps.write('.'));

    if (conf.outFile) {
      let concat = require('gulp-concat');
      let uglify = require('gulp-uglify');
      let rename = require('gulp-rename');
      let dest = is.String(conf.dest) ? conf.dest : process.cwd();

      stream = stream
        // flush transpiled files to dest
        .pipe(gulp.dest(conf.dest))

        // process concat
        .pipe(save.restore(cacheJS)).pipe(save.clear(cacheJS))
        .pipe(sourcemaps.init())
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
        .pipe(sourcemaps.write('.'))
    }
    return stream;
  }
}

export default GTypeScriptBuilder;
module.exports = GTypeScriptBuilder;
