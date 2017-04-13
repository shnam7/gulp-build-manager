/**
 *  PostCSS Builder
 */

'use strict';
import GBuilder from './GBuilder';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';


class GPostCSSBuilder extends GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts, defaultModuleOptions) {
    return this.pick(defaultModuleOptions, ['postcss']);
  }

  OnBuild(stream, mopts, conf) {
    let plugins = [];
    if (conf.buildOptions.postcss && conf.buildOptions.postcss.plugins)
      for (let plugin of conf.buildOptions.postcss.plugins)
        plugins.push(plugin);

    return stream
      .pipe(sourcemaps.init())
      .pipe(postcss(plugins, mopts.postcss))
      .pipe(rename({extname:'.css'}))
      .pipe(sourcemaps.write('.'))
  }
}

export default GPostCSSBuilder;
module.exports = GPostCSSBuilder;
