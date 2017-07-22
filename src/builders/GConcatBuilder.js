/**
 *  Concatenation Builder
 */

import gbm from '../';

export default class GConcatBuilder extends gbm.GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts, defaultModuleOptions) {
    return this.pick(defaultModuleOptions, ['concat']);
  }

  OnPreparePlugins(mopts, conf) {
    this.addPlugins(new gbm.ConcatPlugin());
  }
}
module.exports = GConcatBuilder;
