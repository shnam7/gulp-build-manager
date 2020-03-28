import { Options } from "../core/common";
import { RTB } from "../core/rtb";

RTB.registerExtension('javaScript', (options: Options = {}) => (rtb: RTB) => {
    // check lint option
    if (rtb.buildOptions.lint) {
        const eslint = require('gulp-eslint');
        const eslintOpts = rtb.moduleOptions.eslint || {};
        rtb.pipe(eslint(eslintOpts.eslint || eslintOpts))
            .pipe(eslint.format(eslintOpts.format))
            .pipe(eslint.failAfterError());
    }
    rtb.pipe(require('gulp-babel')(rtb.moduleOptions.babel)).sourceMaps();
});
