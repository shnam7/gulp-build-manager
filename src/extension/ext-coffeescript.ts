import { RTB } from "../core/rtb";
import { Options, info } from "../utils/utils";
import { requireSafe, npm } from "../utils/npm";

RTB.registerExtension('coffeeScript', (options: Options = {}) => (rtb: RTB) => {
    const opts = rtb.buildOptions;
    const lint = Object.assign({}, opts.lint, options.lint);
    const lintOpt = Object.assign({}, rtb.moduleOptions.coffeelint, options.coffeelint);
    const coffeeOpts = Object.assign({}, rtb.moduleOptions.coffee, options.coffee);
    if (opts.babel && !coffeeOpts.hasOwnProperty('bare') ) coffeeOpts.bare = true;

    if (lint) {
        npm.install(['gulp-coffeelint', 'coffeelint-stylish']);
        const coffeeLint = require('gulp-coffeelint');
        const stylish = require('coffeelint-stylish');
        rtb.pipe(coffeeLint(lintOpt)).pipe(coffeeLint.reporter(stylish));
    }
    rtb.pipe(requireSafe('gulp-coffee')(coffeeOpts));

    if (opts.babel) {
        const babelOpts = Object.assign({}, rtb.moduleOptions.babel, options.babel);
        // make sure peer dependencies are installed
        npm.install(['gulp-babel', '@babel/core']);
        rtb.pipe(require('gulp-babel')(babelOpts));
    }
});
