/**
 *  gbm Plugin - CoffeeScript
 */

import GPlugin from '../core/GPlugin';

export default class CoffeeScriptPlugin extends GPlugin {
  constructor(options={}, slots='build') { super(options, slots); }

  process(stream, mopts, conf, slot, builder) {
    const opts = conf.buildOptions || {};
    const lint = this.options.lint || opts.lint;
    const lintOpt = this.options.coffeelint || mopts.coffeelint;
    const coffeeOpts = this.options.coffeescript || mopts.coffeescript;

    if (lint) {
      const coffeeLint = require('gulp-coffeelint');
      const stylish = require('coffeelint-stylish');
      stream = stream.pipe(coffeeLint(lintOpt))
        .pipe(coffeeLint.reporter(stylish));
    }
    return stream.pipe(require('gulp-coffee')(coffeeOpts));
  }
}
module.exports = CoffeeScriptPlugin;
