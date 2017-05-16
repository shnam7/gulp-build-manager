/**
 *  Zip Builder
 */

'use strict';
import GBuilder from './GBuilder';
import gulp from 'gulp';
import zip from 'gulp-zip';


class GZipBuilder extends GBuilder {
  constructor() { super(); }

  OnInitStream(mopts, defultModuleOptions, conf) {
    // zip should not check for 'changed' to zip everything
    let stream = gulp.src(conf.src, mopts.gulp);
    if (conf.buildOptions && conf.buildOptions.enablePlumber) {
      let plumber = require('gulp-plumber');
      stream = stream.pipe(plumber());
    }
    return stream;
  }

  OnBuild(stream, mopts, conf) {
    return stream && stream.pipe(zip(conf.outFile))
  }
}

export default GZipBuilder;
module.exports = GZipBuilder;
