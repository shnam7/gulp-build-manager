/**
 *  gbm Plugin - CoffeeScript
 */
import {Options, Slot, Stream} from "../core/types";
import {GBuilder} from "../core/builder";
import {GPlugin} from "../core/plugin";
import ChangedPlugin from "./ChangedPlugin";

export class CoffeeScriptPlugin extends GPlugin {
  constructor(options:Options={}, slots: Slot|Slot[]='build') { super(options, slots); }

  process(stream:Stream, mopts:Options, conf:Options, slot:Slot, builder:GBuilder) {
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