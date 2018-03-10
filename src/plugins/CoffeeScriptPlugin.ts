/**
 *  gbm Plugin - CoffeeScript
 */
import {BuildConfig, GulpStream, Options, Slot} from "../core/types";
import {GBuilder} from "../core/builder";
import {GPlugin} from "../core/plugin";

export class CoffeeScriptPlugin extends GPlugin {
  constructor(options:Options={}, slots: Slot|Slot[]='build') { super(options, slots); }

  OnStream(stream:GulpStream, mopts:Options, conf:BuildConfig, slot:Slot, builder:GBuilder) {
    const opts = conf.buildOptions || {};
    const lint = this.options.lint || opts.lint;
    const lintOpt = this.options.coffeelint || mopts.coffeelint;
    const coffeeOpts = this.options.coffees || mopts.coffee;

    if (lint) {
      const coffeeLint = require('gulp-coffeelint');
      const stylish = require('coffeelint-stylish');
      if (stream) stream = stream.pipe(coffeeLint(lintOpt)).pipe(coffeeLint.reporter(stylish));
    }
    return stream && stream.pipe(require('gulp-coffee')(coffeeOpts));
  }
}

export default CoffeeScriptPlugin;