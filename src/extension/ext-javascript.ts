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

 import { Options } from "../utils/utils";
import { RTB } from "../core/rtb";
import { requireSafe, npm } from "../utils/npm";

RTB.registerExtension('javaScript', (options: Options = {}) => (rtb: RTB) => {
    const { buildOptions: opts, moduleOptions: mopts } = rtb.conf;

    // check lint option
    if (opts.lint) {
        const eslint = requireSafe('gulp-eslint');
        const eslintOpts = Object.assign({}, mopts.eslint, options.eslint);
        rtb.pipe(eslint(eslintOpts))
            .pipe(eslint.format(eslintOpts.format))
            .pipe(eslint.failAfterError());
    }

    if (opts.babel) {
        npm.install(['gulp-babel', '@babel/core']); // make sure peer dependencies are installed
        const babelOpts = Object.assign({}, mopts.babel, options.babel);
        rtb.pipe(require('gulp-babel')(babelOpts));
    }
});
