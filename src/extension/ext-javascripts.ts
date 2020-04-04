import { Options } from "../core/common";
import { RTB } from "../core/rtb";
import { npmInstall, requireSafe } from "../utils/npm";

RTB.registerExtension('javaScript', (options: Options = {}) => (rtb: RTB) => {
    // check lint option
    if (rtb.buildOptions.lint) {
        const eslint = requireSafe('gulp-eslint');
        const eslintOpts = rtb.moduleOptions.eslint || {};
        rtb.pipe(eslint(eslintOpts.eslint || eslintOpts))
            .pipe(eslint.format(eslintOpts.format))
            .pipe(eslint.failAfterError());
    }

    // make sure peer dependencies are installed
    npmInstall(['gulp-babel', '@babel/core']);
    rtb.pipe(require('gulp-babel')(rtb.moduleOptions.babel)).sourceMaps();
});
