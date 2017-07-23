/**
 *  JavaScript Builder
 */

import gbm from '../';

export default class GJavaScriptBuilder extends gbm.GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts, defaultModuleOptions) {
    return this.pick(defaultModuleOptions, ['babel', 'uglify', 'eslint', 'eslintExtra']);
  }

  OnPreparePlugins(mopts, conf) {
    const opts = conf.buildOptions || {};
    this.addPlugins([
      new gbm.JavaScriptPlugin(),
      (conf.outFile) ? new gbm.ConcatPlugin() : undefined,
      (opts.minify || opts.minifyOnly) ? new gbm.UglifyPlugin() : undefined,
    ]);
  }
}
module.exports = GJavaScriptBuilder;
