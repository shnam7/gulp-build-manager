"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rtb_1 = require("../core/rtb");
const npm_1 = require("../utils/npm");
rtb_1.RTB.registerExtension('coffeeScript', (options = {}) => (rtb) => {
    const opts = rtb.buildOptions;
    const lint = Object.assign({}, opts.lint, options.lint);
    const lintOpt = Object.assign({}, rtb.moduleOptions.coffeelint, options.coffeelint);
    const coffeeOpts = Object.assign({}, rtb.moduleOptions.coffee, options.coffee);
    if (lint) {
        npm_1.npm.install(['gulp-coffeelint', 'coffeelint-stylish']);
        const coffeeLint = require('gulp-coffeelint');
        const stylish = require('coffeelint-stylish');
        rtb.pipe(coffeeLint(lintOpt)).pipe(coffeeLint.reporter(stylish));
    }
    rtb.pipe(npm_1.requireSafe('gulp-coffee')(coffeeOpts));
});
