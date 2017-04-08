/**
 *  Images Builder
 */

'use strict';
import GBuilder from './GBuilder';
import imagemin from 'gulp-imagemin';


class GImagesBuilder extends GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts, defaultModuleOptions) {
    return this.pick(defaultModuleOptions, ['images']);
  }

  OnBuild(stream, mopts, conf) {
    return stream.pipe(imagemin(mopts.imagemin))
  }
}

export default GImagesBuilder;
module.exports = GImagesBuilder;
