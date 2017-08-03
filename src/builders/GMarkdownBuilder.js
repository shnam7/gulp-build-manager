/**
 *  Markdown Builder
 */

'use strict';
import gbm from '../';

export default class GMarkdownBuilder extends gbm.GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts, defaultModuleOptions) {
    return this.pick(defaultModuleOptions, ['markdown']);
  }

  OnPreparePlugins(mopts, conf) {
    this.addPlugins(new gbm.MarkdownPlugin());
  }
}
module.exports = GMarkdownBuilder;
