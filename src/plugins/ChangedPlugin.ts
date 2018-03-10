/**
 *  gbm Plugin - Changed
 */
import {BuildConfig, GulpStream, Options, Slot} from "../core/types";
import {GBuilder} from "../core/builder";
import {GPlugin} from "../core/plugin";

export class ChangedPlugin extends GPlugin {
  constructor(options:Options={}, slots: Slot|Slot[]='initStream') { super(options, slots); }

  OnStream(stream:GulpStream, mopts:Options, conf:BuildConfig, slot:Slot, builder:GBuilder) {
    let dest = this.options.dest || conf.dest;
    return stream.pipe(require('gulp-changed')(dest, this.options));
  }
}

export default ChangedPlugin;