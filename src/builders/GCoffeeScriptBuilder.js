/**
 *  CoffeeScript Builder
 */

'use strict';
import GBuilder from './GBuilder';
import nop from 'gulp-nop';
import coffee from 'gulp-coffee';


class GCoffeeScriptBuilder extends GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts, defaultModuleOptions) {
    this.merge(mopts, this.pick(defaultModuleOptions, ['coffeescript']));
    this.merge(mopts, {changed:{extension: '.js'}});
  }

  OnBuild(stream, mopts, conf) {
    let lint = nop; lint.reporter= nop;
    let stylish=nop;
    if (conf.buildOptions.enableLint === true) {
      lint = require('gulp-coffeelint');
      stylish = require('coffeelint-stylish');
    }

    return stream
      .pipe(lint())
      .pipe(lint.reporter(stylish))
      .pipe(coffee(mopts.coffee))
      .on('error', (e) => {
        console.log('CoffeeScript:Error on File:', e.fileName);
        console.log('CoffeeScript:Cause of Error:', e.cause);
      })
  }
}

export default GCoffeeScriptBuilder;
module.exports = GCoffeeScriptBuilder
