/**
 *  TypeScript Builder
 */

'use strict';
import gbm from '../';

export default class GTypeScriptBuilder extends gbm.GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts, defaultModuleOptions) {
    this.merge(mopts, this.pick(defaultModuleOptions, ['typescript']), {changed:{extension: '.js'}});
  }

  OnPreparePlugins(mopts, conf) {
    const opts = conf.buildOptions;
    this.addPlugins([
      new gbm.TypeScriptPlugin(),
      (opts.minify || opts.minifyOnly) ? new gbm.UglifyPlugin() : undefined,
    ]);
  }
}
module.exports = GTypeScriptBuilder;
