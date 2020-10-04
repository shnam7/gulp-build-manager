"use strict";
/**
 *  gbm extension - javascript
 *
 *  buildOptions:
 *    babel: Enable babel
 *    lint: Enable lint
 *
 *  moduleOptions:
 *    babel: Options to gulp-babel.
 *    eslint: Options to gulp-eslint.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const rtb_1 = require("../core/rtb");
const npm_1 = require("../utils/npm");
rtb_1.RTB.registerExtension('javaScript', (options = {}) => (rtb) => {
    const { buildOptions: opts, moduleOptions: mopts } = rtb.conf;
    // check lint option
    if (opts.lint) {
        const eslint = npm_1.requireSafe('gulp-eslint');
        const eslintOpts = Object.assign({}, mopts.eslint, options.eslint);
        rtb.pipe(eslint(eslintOpts))
            .pipe(eslint.format(eslintOpts.format))
            .pipe(eslint.failAfterError());
    }
    if (opts.babel) {
        npm_1.npm.install(['gulp-babel', '@babel/core']); // make sure peer dependencies are installed
        const babelOpts = Object.assign({}, mopts.babel, options.babel);
        rtb.pipe(require('gulp-babel')(babelOpts));
    }
});
