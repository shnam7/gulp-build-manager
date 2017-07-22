/**
 *  Image Optimization Builder
 */

'use strict';
import GBuilder from './GBuilder';

export default class GImagesBuilder extends GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts, defaultModuleOptions) {
    return this.pick(defaultModuleOptions, ['imagemin']);
  }

  OnBuild(stream, mopts, conf) {
    return stream.pipe(require('gulp-imagemin')(mopts.imagemin))
  }
}
module.exports = GImagesBuilder;
