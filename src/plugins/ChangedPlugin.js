/**
 *  gbm Plugin - Changed
 */

import GPlugin from '../core/GPlugin';

export default class ChangedPlugin extends GPlugin {
  constructor(options={}, slots='initStream') { super(options, slots); }

  process(stream, mopts, conf, slot, builder) {
    let dest = this.options.dest || conf.dest;
    return stream.pipe(require('gulp-changed')(dest, this.options));
  }
}
module.exports = ChangedPlugin;
