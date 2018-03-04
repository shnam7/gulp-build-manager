/**
 *  TypeScript Builder
 */
import {deepmerge, pick} from "../core/utils";
import {Options} from "../core/types";
import {GBuilder} from "../core/builder";
import {TypeScriptPlugin} from "../plugins/TypeScriptPlugin";
import {UglifyPlugin} from "../plugins/UglifyPlugin";

export default class GTypeScriptBuilder extends GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts:Options, defaultModuleOptions:Options) {
    mopts = deepmerge(mopts, pick(defaultModuleOptions, 'typescript'));
    mopts = deepmerge(mopts, {changed:{extension: '.js'}});
    return mopts;
  }

  OnPreparePlugins(mopts:Options, conf:Options) {
    const opts = conf.buildOptions || {};
    this.addPlugins([
      new TypeScriptPlugin(),
      (opts.minify || opts.minifyOnly) ? new UglifyPlugin() : undefined,
    ]);
  }
}