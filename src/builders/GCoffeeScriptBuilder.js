/**
 *  CoffeeScript Builder
 */

'use strict';
import GBuilder from './GBuilder';
import coffee from 'gulp-coffee';
import sourcemaps from 'gulp-sourcemaps';


class GCoffeeScriptBuilder extends GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts, defaultModuleOptions) {
    this.merge(mopts, this.pick(defaultModuleOptions, ['coffeescript']));
    this.merge(mopts, {changed:{extension: '.js'}});
  }

  OnBuild(stream, mopts, conf) {
    if (conf.buildOptions && conf.buildOptions.enableLint) {
      let lint = require('gulp-coffeelint');
      let stylish = require('coffeelint-stylish');
      stream = stream.pipe(lint()).pipe(lint.reporter(stylish));
    }

    return stream
      .pipe(sourcemaps.init())
      .pipe(coffee(mopts.coffee))
      .on('error', (e) => {
        console.log('CoffeeScript:Error on File:', e.fileName);
        console.log('CoffeeScript:Cause of Error:', e.cause);
      })
      .pipe(sourcemaps.write('.'))
  }
}

export default GCoffeeScriptBuilder;
module.exports = GCoffeeScriptBuilder
