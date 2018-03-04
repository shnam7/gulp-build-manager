/**
 *  gbm Plugin - Changed
 */
import {Options, Slot, Stream} from "../core/types";
import {GBuilder} from "../core/builder";
import {GPlugin} from "../core/plugin";

export class ChangedPlugin extends GPlugin {
  constructor(options:Options={}, slots: Slot|Slot[]='initStream') { super(options, slots); }

  process(stream:Stream, mopts:Options, conf:Options, slot:Slot, builder:GBuilder) {
    let dest = this.options.dest || conf.dest;
    return stream && stream.pipe(require('gulp-changed')(dest, this.options));
  }
}

export default ChangedPlugin;