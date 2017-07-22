/**
 *  gbm Plugin - Plumber
 */

import GPlugin from '../core/GPlugin';

export default class PlumberPlugin extends GPlugin {
  constructor(options={}, slots='initStream') { super(options, slots); }

  process(stream, mopts, conf, slot) {
    let plumber = require('gulp-plumber');
    return stream.pipe(plumber(this.options));
  }
}
module.exports = PlumberPlugin;