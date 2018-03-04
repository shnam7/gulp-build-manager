/**
 *  CSS Builder with support for Sass/Scss, Less and PostCSS
 */
import {GBuilder} from "../core/builder";
import {pick} from "../core/utils";
import {Options} from "../core/types";
import {CSSPlugin} from "../plugins/CSSPlugin";
import {CSSNanoPlugin} from "../plugins/CSSNanoPlugin";

export class GCSSBuilder extends GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts:Options, defaultModuleOptions:Options) {
    return pick(defaultModuleOptions, 'sass', 'sassLint', 'less', 'lessLint', 'cssnano');
  }

  OnPreparePlugins(mopts:Options, conf:Options) {
    const opts = conf.buildOptions || {};
    this.addPlugins([
      new CSSPlugin(),
      (opts.minify || opts.minifyOnly) ? new CSSNanoPlugin() : undefined
    ]);
  }
}

export default GCSSBuilder;