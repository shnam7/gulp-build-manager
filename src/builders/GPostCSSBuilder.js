/**
 *  PostCSS Builder
 */

'use strict';
import GBuilder from './GBuilder';
import postcss from 'gulp-postcss';


class GPostCSSBuilder extends GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts, defaultModuleOptions) {
    return this.pick(defaultModuleOptions, ['postcss']);
  }

  OnBuild(stream, mopts, conf) {
    let plugins = [
      require('postcss-nested'),
      require('postcss-mixins'),
      require('postcss-simple-vars'),
      require('autoprefixer')({browsers: ['last 1 version']}),
      require('postcss-easings'),
      require('cssnext'),
    ];

    return stream
      .pipe(sourcemaps.init())
      .pipe(postcss(plugins, mopts.postcss))
      .pipe(sourcemaps.write('.'))
  }
}

export default GPostCSSBuilder;
module.exports = GPostCSSBuilder;
