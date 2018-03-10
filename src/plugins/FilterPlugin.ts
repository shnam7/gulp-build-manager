/**
 *  gbm Plugin - Filter
 */

import {BuildConfig, GulpStream, Options, Slot} from "../core/types";
import {GBuilder} from "../core/builder";
import {GPlugin} from "../core/plugin";

export class FilterPlugin extends GPlugin {
  filter:any = undefined;

  constructor(public patterns:string[], options={}, slots:Slot|Slot[]='build') {
    super(options, slots);
  }

  OnStream(stream:GulpStream, mopts:Options, conf:BuildConfig, slot:Slot, builder:GBuilder) {
    this.filter = require('gulp-filter');
    return stream && stream.pipe(this.filter(this.patterns, this.options));
  }

  restore(stream:GulpStream) {
    return stream.pipe(this.filter.restore);
  }
}

export default FilterPlugin;