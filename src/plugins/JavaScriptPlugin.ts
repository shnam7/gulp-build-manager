/**
 *  gbm Plugin - JavaScript
 */

import { Options } from "../core/common";
import { GPlugin } from "../core/plugin";
import { RTB } from "../core/rtb";

export class JavaScriptPlugin extends GPlugin {
    constructor(options: Options = {}) { super(options); }

    process(rtb: RTB) {
        // check lint option
        if (rtb.buildOptions.lint) {
            const eslint = require('gulp-eslint');
            const eslintOpts = rtb.moduleOptions.eslint || {};
            rtb.pipe(eslint(eslintOpts.eslint || eslintOpts))
                .pipe(eslint.format(eslintOpts.format))
                .pipe(eslint.failAfterError());
        }
        rtb.pipe(require('gulp-babel')(rtb.moduleOptions.babel)).sourceMaps();
    }
}

export default JavaScriptPlugin;
