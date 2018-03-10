/**
 *  gbm Plugin - Debug
 */

import {BuildConfig, GulpStream, Options, Slot} from "../core/types";
import {GBuilder} from "../core/builder";
import {GPlugin} from "../core/plugin";

export class DebugPlugin extends GPlugin {
  constructor(options:Options={}, slots: Slot|Slot[]='build') { super(options, slots); }

  OnStream(stream:GulpStream, mopts:Options, conf:BuildConfig, slot:Slot, builder:GBuilder) {
    let debug = require('gulp-debug');
    let title = this.options ? this.options.title : "";
    title = title ? title+':' : "";
    title = '[DebugPlugin]' + slot + ':' + title;
    let opts = Object.assign({}, this.options, {title: title});
    return stream.pipe(debug(opts));
  }
}

export default DebugPlugin;