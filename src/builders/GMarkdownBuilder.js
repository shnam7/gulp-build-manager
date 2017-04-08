/**
 *  Markdown Builder
 */

'use strict';
import GBuilder from './GBuilder';
import markdown from 'gulp-markdown';


class GMarkdownBuilder extends GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts, defaultModuleOptions) {
    return this.pick(defaultModuleOptions, ['markdown']);
  }

  OnBuild(stream, mopts, conf) {
    return stream.pipe(markdown(mopts.markdown))
  }
}

export default GMarkdownBuilder;
module.exports = GMarkdownBuilder;
