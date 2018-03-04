/**
 *  CoffeeScript Builder
 */
import {GBuilder} from "../core/builder";
import {Options} from "../core/types";
import {deepmerge, pick} from "../core/utils";
import {CoffeeScriptPlugin} from "../plugins/CoffeeScriptPlugin";
import {ConcatPlugin} from "../plugins/ConcatPlugin";
import {UglifyPlugin} from "../plugins/UglifyPlugin";

export class GCoffeeScriptBuilder extends GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts:Options, defaultModuleOptions:Options) {
    mopts = deepmerge(mopts, pick(defaultModuleOptions, 'coffee', 'coffeeLint', 'uglify'));
    mopts = deepmerge(mopts, {changed:{extension: '.js'}});
    return mopts;
  }

  OnPreparePlugins(mopts:Options, conf:Options) {
    this.addPlugins([
      new CoffeeScriptPlugin(),
      (conf.outFile) ? new ConcatPlugin() : undefined,
      new UglifyPlugin(),
    ]);
  }
}

export default GCoffeeScriptBuilder;