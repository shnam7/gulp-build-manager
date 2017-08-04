/**
 *  gbm Plugin - Concatenation
 */

import GPlugin from '../core/GPlugin';

export default class ConcatPlugin extends GPlugin {
  constructor(options={}, slots='build') {
    super(options, slots); }

  process(stream, mopts, conf, slot, builder) {
    // check for filter option (to remove .map files, etc.)
    const filter = this.options.filter || ['**', '!**/*.map'];
    if (filter) stream = stream.pipe(require('gulp-filter')(filter));

    if (!conf.outFile) {
      console.log('[ConcatPlugin] Missing conf.outFile. No output generated.');
      return stream;
    }

    // concat
    return stream.pipe(require('gulp-concat')(conf.outFile, this.options.concat || mopts.concat));
  }
}
module.exports = ConcatPlugin;
