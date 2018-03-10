/**
 *  gbm Plugin - Concatenation
 */
import {GPlugin} from "../core/plugin";
import {BuildConfig, GulpStream, Options, Slot} from "../core/types";
import {GBuilder} from "../core/builder";

export class ConcatPlugin extends GPlugin {
  constructor(options:Options={}, slots: Slot|Slot[]='build') {
    super(options, slots);
  }

  OnStream(stream:GulpStream, mopts:Options, conf:BuildConfig, slot:Slot, builder:GBuilder) {
    // check for filter option (to remove .map files, etc.)
    const filter = this.options.filter || ['**', '!**/*.map'];
    if (filter && stream) stream = stream.pipe(require('gulp-filter')(filter));

    if (!conf.outFile) {
      console.log('[ConcatPlugin] Missing conf.outFile. No output generated.');
      return stream;
    }

    // concat
    return stream && stream.pipe(require('gulp-concat')(conf.outFile, this.options.concat || mopts.concat));
  }
}

export default ConcatPlugin;
