/**
 *  gbm Plugin - Uglify
 */

import GPlugin from '../core/GPlugin';

export default class NullPlugin extends GPlugin {
  constructor(options={}, slots='build') { super(options, slots); }
  process(stream, mopts, conf, slot) { return stream; }
}
module.exports = NullPlugin;
