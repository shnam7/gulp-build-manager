/**
 *  Zip Builder
 */

'use strict';
import GBuilder from './GBuilder';

export default class GZipBuilder extends GBuilder {
  constructor() { super(); }

  OnPreparePlugins(mopts, conf) {
    this.addPlugins(stream=>stream && stream.pipe(require('gulp-zip')(conf.outFile)));
  }
}
module.exports = GZipBuilder;
