/**
 *  JavaScript Builder
 */

import {Options} from "../core/types";
import {GBuilder} from "../core/builder";
import {pick} from "../core/utils";
import JavaScriptPlugin from "../plugins/JavaScriptPlugin";
import {ConcatPlugin} from "../plugins/ConcatPlugin";
import {UglifyPlugin} from "../plugins/UglifyPlugin";

export default class GJavaScriptBuilder extends GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts:Options, defaultModuleOptions:Options) {
    return pick(defaultModuleOptions, 'babel', 'uglify', 'eslint', 'eslintExtra');
  }

  OnPreparePlugins(mopts:Options, conf:Options) {
    const opts = conf.buildOptions || {};
    this.addPlugins([
      new JavaScriptPlugin(),
      (conf.outFile) ? new ConcatPlugin() : undefined,
      (opts.minify || opts.minifyOnly) ? new UglifyPlugin() : undefined,
    ]);
  }
}