/**
 *  CSS Builder with support for Sass/Scss, Less and PostCSS
 */
import {GBuilder} from "../core/builder";
import {pick} from "../core/utils";
import {BuildConfig, Options, Stream} from "../core/types";
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

  OnPostBuild(stream:Stream, mopts:Options={}, conf:BuildConfig) {
    // filter sourcemap files so that reloader works properly
    if (stream) stream = stream.pipe(require('gulp-filter')(['**', '!**/*.map']));
    return stream
  }
}

export default GCSSBuilder;