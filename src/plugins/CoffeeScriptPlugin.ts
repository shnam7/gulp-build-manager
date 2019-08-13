/**
 *  gbm Plugin - CoffeeScript
 */
import { Options } from "../core/common";
import { GBuilder } from "../core/builder";
import { GPlugin } from "../core/plugin";

export class CoffeeScriptPlugin extends GPlugin {
    constructor(options: Options = {}) { super(options); }

    process(builder: GBuilder) {
        const opts = builder.conf.buildOptions || {};
        const lint = this.options.lint || opts.lint;
        const lintOpt = this.options.coffeelint || builder.moduleOptions.coffeelint;
        const coffeeOpts = this.options.coffee || builder.moduleOptions.coffee;

        if (lint) {
            const coffeeLint = require('gulp-coffeelint');
            const stylish = require('coffeelint-stylish');
            builder.pipe(coffeeLint(lintOpt)).pipe(coffeeLint.reporter(stylish));
        }
        builder.pipe(require('gulp-coffee')(coffeeOpts)).sourceMaps();
    }
}

export default CoffeeScriptPlugin;
