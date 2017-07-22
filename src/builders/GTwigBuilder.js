/**
 *  Twig Builder
 */

'use strict';
import gbm from '../';

export default class GTwigBuilder extends gbm.GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts, defaultModuleOptions) {
    return this.pick(defaultModuleOptions, ['twig', 'htmlmin', 'htmiPrettify']);
  }

  OnPreparePlugins(mopts, conf) {
    this.addPlugins(new gbm.TwigPlugin());
  }
}
module.exports = GTwigBuilder;
