/**
 *  CSS Builder with support for Sass/Scss, Less and PostCSS
 */

'use strict';
import gbm from '../';

export default class GCSSBuilder extends gbm.GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts, defaultModuleOptions) {
    return this.pick(defaultModuleOptions, [
      'sass', 'sassLint', 'less', 'lessLint', 'cssnano'
    ]);
  }

  OnPreparePlugins(mopts, conf) {
    const opts = conf.buildOptions || {};
    this.addPlugins([
      new gbm.CSSPlugin(),
      (opts.minify || opts.minifyOnly) ? new gbm.CSSNanoPlugin() : undefined
    ]);
  }
}
module.exports = GCSSBuilder;
