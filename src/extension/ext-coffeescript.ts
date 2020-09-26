/**
 * gbm extension - coffeescript
 * rtb.coffeescript(options={})
 *
 * Options:
 *  coffee : Overrides rtb.moduleOptions.coffee
 *  coffeelint : Overrides rtb.moduleOptions.coffeelint
 *  babel: Overrides rtb.moduleOptions.babel. If rtb.buildOptions.babel is true, then { bare: true } is added.
 */

import { RTB } from "../core/rtb";
import { Options } from "../utils/utils";
import { requireSafe, npm } from "../utils/npm";

RTB.registerExtension('coffeeScript', (options: Options = {}) => (rtb: RTB) => {
    const opts = rtb.buildOptions;
    const coffeeOpts = Object.assign({}, rtb.moduleOptions.coffee, options.coffee);
    const lintOpt = Object.assign({}, rtb.moduleOptions.coffeelint, options.coffeelint);
    if (opts.babel && !coffeeOpts.hasOwnProperty('bare') ) coffeeOpts.bare = true;

    if (opts.lint) {
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
