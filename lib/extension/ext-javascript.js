"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rtb_1 = require("../core/rtb");
const npm_1 = require("../utils/npm");
rtb_1.RTB.registerExtension('javaScript', (options = {}) => (rtb) => {
    const opts = rtb.buildOptions;
    const mopts = rtb.moduleOptions;
    // check lint option
    if (opts.lint) {
        const eslint = npm_1.requireSafe('gulp-eslint');
        const eslintOpts = Object.assign({}, mopts.eslint, options.eslint);
        rtb.pipe(eslint(eslintOpts))
            .pipe(eslint.format(eslintOpts.format))
            .pipe(eslint.failAfterError());
    }
    if (opts.babel) {
        const babelOpts = Object.assign({}, rtb.moduleOptions.babel, options.babel);
        // make sure peer dependencies are installed
        npm_1.npm.install(['gulp-babel', '@babel/core']);
        rtb.pipe(require('gulp-babel')(babelOpts));
    }
});
