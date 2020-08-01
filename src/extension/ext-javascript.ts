import { Options } from "../utils/utils";
import { RTB } from "../core/rtb";
import { requireSafe, npm } from "../utils/npm";

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
        npm.install(['gulp-babel', '@babel/core']);
        rtb.pipe(require('gulp-babel')(rtb.moduleOptions.babel));
    }
});
