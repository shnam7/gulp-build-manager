/**
 *  Zip Builder
 */

'use strict';
import GBuilder from './GBuilder';
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import zip from 'gulp-zip';


class GZipBuilder extends GBuilder {
  constructor() { super(); }

  OnInitStream(mopts, defultModuleOptions, conf) {
    // zip should not check for 'changed' to zip everything
    return gulp.src(conf.src, mopts.gulp).pipe(plumber())
  }

  OnBuild(stream, mopts, conf) {
    return stream
      .pipe(zip(conf.outfile))
  }
}

export default GZipBuilder;
module.exports = GZipBuilder;
