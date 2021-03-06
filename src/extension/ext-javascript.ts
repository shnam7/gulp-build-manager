import { Options } from "../core/common";
import { RTB } from "../core/rtb";
import { npmInstall, requireSafe } from "../utils/npm";

RTB.registerExtension('javaScript', (options: Options = {}) => (rtb: RTB) => {
    const opts = rtb.buildOptions;
    const mopts = rtb.moduleOptions;

    // check lint option
    if (opts.lint) {
        const eslint = requireSafe('gulp-eslint');
        const eslintOpts = Object.assign({}, mopts.eslint, options.eslint);
        rtb.pipe(eslint(eslintOpts))
            .pipe(eslint.format(eslintOpts.format))
            .pipe(eslint.failAfterError());
    }

    if (opts.babel) {
        // make sure peer dependencies are installed
        npmInstall(['gulp-babel', '@babel/core']);
        rtb.pipe(require('gulp-babel')(rtb.moduleOptions.babel));
    }
});
