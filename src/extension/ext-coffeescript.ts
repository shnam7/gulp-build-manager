import { RTB } from "../core/rtb";
import { Options } from "../core/common";
import { requireSafe, npmInstall } from "../utils/npm";

RTB.registerExtension('coffeeScript', (options: Options = {}) => (rtb: RTB) => {
    const opts = rtb.conf.buildOptions || {};
    const lint = options.lint || opts.lint;
    const lintOpt = Object.assign({}, rtb.conf.moduleOptions.coffeelint, options.coffeelint);
    const coffeeOpts = Object.assign({}, rtb.conf.moduleOptions.coffee, options.coffee);

    if (lint) {
        npmInstall(['gulp-coffeelint', 'coffeelint-stylish']);
        const coffeeLint = require('gulp-coffeelint');
        const stylish = require('coffeelint-stylish');
        rtb.pipe(coffeeLint(lintOpt)).pipe(coffeeLint.reporter(stylish));
    }
    rtb.pipe(requireSafe('gulp-coffee')(coffeeOpts)).sourceMaps();
});
