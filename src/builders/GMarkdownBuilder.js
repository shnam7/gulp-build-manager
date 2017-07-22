/**
 *  Markdown Builder
 */

import GBuilder from './GBuilder';

export default class GMarkdownBuilder extends GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts, defaultModuleOptions) {
    return this.pick(defaultModuleOptions, ['markdown']);
  }

  OnPreparePlugins(mopts, conf) {
    this.addPlugins(stream=>stream.pipe(require('gulp-markdown')(mopts.markdown)));
  }
}
module.exports = GMarkdownBuilder;
