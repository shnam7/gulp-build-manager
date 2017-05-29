/**
 *  PostCSS Builder
 */

'use strict';
import GBuilder from './GBuilder';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import merge from 'lodash.merge';


class GPostCSSBuilder extends GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts, defaultModuleOptions) {
    merge(mopts, {changed:{extension: '.css'}});
    return this.pick(defaultModuleOptions, ['postcss']);
  }

  OnBuild(stream, mopts, conf) {
    let plugins = [];
    if (conf.buildOptions
      && conf.buildOptions.postcss
      && conf.buildOptions.postcss.plugins) {
      for (let plugin of conf.buildOptions.postcss.plugins)
        plugins.push(plugin);
    }

    return stream
      .pipe(sourcemaps.init())
      .pipe(postcss(plugins, mopts.postcss))
      .pipe(rename({extname:'.css'}))
      .pipe(sourcemaps.write('.'))
  }
}

export default GPostCSSBuilder;
module.exports = GPostCSSBuilder;
