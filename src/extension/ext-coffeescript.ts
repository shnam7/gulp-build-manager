/**
 *  gbm extension - coffeescript
 *
 *  buildOptions:
 *    lint: Enable lint
 *    babel: Enable babel
 *
 *  moduleOptions:
 *    coffee : Options to gulp-coffee. Default is { bare: true } if rtb.buildOptions.babel is true.
 *    coffeelint : Options to gulp-coffeelint.
 *    babel: Options to gulp-babel.
 */

import { RTB } from "../core/rtb";
import { Options } from "../utils/utils";
import { requireSafe, npm } from "../utils/npm";

RTB.registerExtension('coffeeScript', (options: Options = {}) => (rtb: RTB) => {
    const { buildOptions: opts, moduleOptions: mopts } = rtb.conf;
    const coffeeOpts = Object.assign({}, mopts.coffee, options.coffee);
    const lintOpts = Object.assign({}, mopts.coffeelint, options.coffeelint);
    if (opts.babel && !coffeeOpts.hasOwnProperty('bare') ) coffeeOpts.bare = true;

    if (opts.lint) {
        npm.install(['gulp-coffeelint', 'coffeelint-stylish']);
        const coffeeLint = require('gulp-coffeelint');
        const stylish = require('coffeelint-stylish');
        rtb.pipe(coffeeLint(lintOpts)).pipe(coffeeLint.reporter(stylish));
    }
    rtb.pipe(requireSafe('gulp-coffee')(coffeeOpts));

    if (opts.babel) {
        // make sure peer dependencies are installed
        npm.install(['gulp-babel', '@babel/core']);
        const babelOpts = Object.assign({}, mopts.babel, options.babel);
        rtb.pipe(require('gulp-babel')(babelOpts));
    }
});
