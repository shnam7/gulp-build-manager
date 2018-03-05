/**
 *  TypeScript Builder
 */
import {pick} from "../core/utils";
import {Options} from "../core/types";
import {GBuilder} from "../core/builder";
import {TypeScriptPlugin} from "../plugins/TypeScriptPlugin";
import {UglifyPlugin} from "../plugins/UglifyPlugin";

export class GTypeScriptBuilder extends GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts:Options, defaultModuleOptions:Options) {
    Object.assign(mopts, pick(defaultModuleOptions, 'typescript'));
    Object.assign(mopts, {changed:{extension: '.js'}});
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

export default GTypeScriptBuilder;