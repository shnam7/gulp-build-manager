/**
 *  gbm Plugin - Plumber
 */

import {Options, Slot, Stream} from "../core/types";
import {GBuilder} from "../core/builder";
import {GPlugin} from "../core/plugin";
import ChangedPlugin from "./ChangedPlugin";

export class PlumberPlugin extends GPlugin {
  constructor(options:Options={}, slots: Slot|Slot[]='initStream') { super(options, slots); }

  process(stream:Stream, mopts:Options, conf:Options, slot:Slot, builder:GBuilder) {
    let plumber = require('gulp-plumber');
    return stream && stream.pipe(plumber(this.options));
  }
}

export default PlumberPlugin;