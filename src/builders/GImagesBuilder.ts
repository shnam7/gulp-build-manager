/**
 *  Image Optimization Builder
 */
import {Options, Stream} from "../core/types";
import {GBuilder} from "../core/builder";
import {pick} from "../core/utils";

export default class GImagesBuilder extends GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts:Options, defaultModuleOptions:Options) {
    return pick(defaultModuleOptions, 'imagemin');
  }

  OnBuild(stream:Stream, mopts:Options, conf:Options) {
    return stream && stream.pipe(require('gulp-imagemin')(mopts.imagemin))
  }
}