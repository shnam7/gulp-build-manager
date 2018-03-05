/**
 *  gbm Plugin - Debug
 */

import {Options, Slot, Stream} from "../core/types";
import {GBuilder} from "../core/builder";
import {GPlugin} from "../core/plugin";

export class DebugPlugin extends GPlugin {
  constructor(options:Options={}, slots: Slot|Slot[]='build') { super(options, slots); }

  process(stream:Stream, mopts:Options, conf:Options, slot:Slot, builder:GBuilder) {
    let debug = require('gulp-debug');
    let title = this.options ? this.options.title : "";
    title = title ? title+':' : "";
    title = '[DebugPlugin]' + slot + ':' + title;
    let opts = Object.assign({}, this.options, {title: title});
    return stream && stream.pipe(debug(opts));
  }
}

export default DebugPlugin;