/**
 *  CoffeeScript Builder
 */

import gbm from '../';

export default class GCoffeeScriptBuilder extends gbm.GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts, defaultModuleOptions) {
    this.merge(mopts, this.pick(defaultModuleOptions, ['coffee', 'coffeeLint', 'uglify']), {changed:{extension: '.js'}});
  }

  OnPreparePlugins(mopts, conf) {
    this.addPlugins([
      new gbm.CoffeeScriptPlugin(),
      (conf.outFile) ? new gbm.ConcatPlugin() : undefined,
      // new gbm.DebugPlugin(),
      new gbm.UglifyPlugin(),
    ]);
  }
}
module.exports = GCoffeeScriptBuilder;
