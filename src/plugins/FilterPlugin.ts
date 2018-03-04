/**
 *  gbm Plugin - Filter
 */

import {Options, Slot, Stream} from "../core/types";
import {GBuilder} from "../core/builder";
import {GPlugin} from "../core/plugin";
import ChangedPlugin from "./ChangedPlugin";

export class FilterPlugin extends GPlugin {
  filter:any = undefined;

  constructor(public patterns:string[], options={}, slots:Slot|Slot[]='build') {
    super(options, slots);
  }

  process(stream:Stream, mopts:Options, conf:Options, slot:Slot, builder:GBuilder) {
    this.filter = require('gulp-filter');
    return stream && stream.pipe(this.filter(this.patterns, this.options));
  }

  restore(stream:Stream) {
    return stream && stream.pipe(this.filter.restore);
  }
}

export default FilterPlugin;