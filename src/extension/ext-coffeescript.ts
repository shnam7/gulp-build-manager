import { RTB } from "../core/rtb";
import { requireSafe, npmInstall } from "../utils/npm";
import { Options } from "../utils/utils";

RTB.registerExtension('coffeeScript', (options: Options = {}) => (rtb: RTB) => {
    const opts = rtb.buildOptions;
    const lint = Object.assign({}, opts.lint, options.lint);
    const lintOpt = Object.assign({}, rtb.moduleOptions.coffeelint, options.coffeelint);
    const coffeeOpts = Object.assign({}, rtb.moduleOptions.coffee, options.coffee);

    if (lint) {
        npmInstall(['gulp-coffeelint', 'coffeelint-stylish']);
        const coffeeLint = require('gulp-coffeelint');
        const stylish = require('coffeelint-stylish');
        rtb.pipe(coffeeLint(lintOpt)).pipe(coffeeLint.reporter(stylish));
    }
    rtb.pipe(requireSafe('gulp-coffee')(coffeeOpts));
});
