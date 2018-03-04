/**
 *  Zip Builder
 */
import {GBuilder} from "../core/builder";
import {Options} from "../core/types";

export default class GZipBuilder extends GBuilder {
  constructor() { super(); }

  OnPreparePlugins(mopts:Options, conf:Options) {
    this.addPlugins(stream=>stream && stream.pipe(require('gulp-zip')(conf.outFile)));
  }
}