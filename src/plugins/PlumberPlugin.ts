/**
 *  gbm Plugin - Plumber
 */

import {BuildConfig, GulpStream, Options, Slot} from "../core/types";
import {GBuilder} from "../core/builder";
import {GPlugin} from "../core/plugin";

export class PlumberPlugin extends GPlugin {
  constructor(options:Options={}, slots: Slot|Slot[]='initStream') { super(options, slots); }

  OnStream(stream:GulpStream, mopts:Options, conf:BuildConfig, slot:Slot, builder:GBuilder) {
    let plumber = require('gulp-plumber');
    return stream.pipe(plumber(this.options));
  }
}

export default PlumberPlugin;