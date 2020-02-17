/**
 *  gbm Plugin - CoffeeScript
 */
import { Options } from "../core/common";
import { GPlugin } from "../core/plugin";
import { RTB } from "../core/rtb";

export class CoffeeScriptPlugin extends GPlugin {
    constructor(options: Options = {}) { super(options); }

    process(rtb: RTB) {
        const opts = rtb.conf.buildOptions || {};
        const lint = this.options.lint || opts.lint;
        const lintOpt = this.options.coffeelint || rtb.moduleOptions.coffeelint;
        const coffeeOpts = this.options.coffee || rtb.moduleOptions.coffee;

        if (lint) {
            const coffeeLint = require('gulp-coffeelint');
            const stylish = require('coffeelint-stylish');
            rtb.pipe(coffeeLint(lintOpt)).pipe(coffeeLint.reporter(stylish));
        }
        rtb.pipe(require('gulp-coffee')(coffeeOpts)).sourceMaps();
    }
}

export default CoffeeScriptPlugin;
