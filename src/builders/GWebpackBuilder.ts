/**
 *  Webpack Builder
 */
import {GBuilder} from "../core/builder";
import {Options} from "../core/types";
import {pick} from "../core/utils";
import {WebpackPlugin} from "../plugins/WebpackPlugin";

export class GWebpackBuilder extends GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts:Options, defaultModuleOptions:Options) {
    return pick(defaultModuleOptions, 'webpack');
  }

  OnPreparePlugins(mopts:Options, conf:Options) {
    this.addPlugins([
      new WebpackPlugin()
    ]);
  }
}

export default GWebpackBuilder;