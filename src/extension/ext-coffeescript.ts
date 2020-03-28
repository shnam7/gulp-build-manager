import { RTB } from "../core/rtb";
import { Options } from "../core/common";

RTB.registerExtension('coffeeScript', (options: Options = {}) => (rtb: RTB) => {
    const opts = rtb.conf.buildOptions || {};
    const lint = options.lint || opts.lint;
    const lintOpt = options.coffeelint || rtb.moduleOptions.coffeelint;
    const coffeeOpts = options.coffee || rtb.moduleOptions.coffee;

    if (lint) {
        const coffeeLint = require('gulp-coffeelint');
        const stylish = require('coffeelint-stylish');
        rtb.pipe(coffeeLint(lintOpt)).pipe(coffeeLint.reporter(stylish));
    }
    rtb.pipe(require('gulp-coffee')(coffeeOpts)).sourceMaps();
});
