/**
 *  JavaScript Builder
 */

'use strict';
import GBuilder from './GBuilder';
import sourcemaps from 'gulp-sourcemaps';
import upath from 'upath';
import is from './../utils/is';

class GConcatBuilder extends GBuilder {
  constructor() { super(); }

  OnBuild(stream, mopts, conf) {
    stream = stream.pipe(sourcemaps.init());
    let concat = require('gulp-concat');
    let dest = is.String(conf.dest) ? conf.dest : process.cwd();

    return stream
      .pipe(concat(upath.resolve(dest, conf.outFile)))
      .pipe(sourcemaps.write('.'))
  }
}

export default GConcatBuilder;
module.exports = GConcatBuilder;
