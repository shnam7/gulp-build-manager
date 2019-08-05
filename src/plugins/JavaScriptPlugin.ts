/**
 *  gbm Plugin - JavaScript
 */

import { Options } from "../core/types";
import { GBuilder } from "../core/builder";
import { GPlugin } from "../core/plugin";

export class JavaScriptPlugin extends GPlugin {
    constructor(options: Options = {}) { super(options); }

    process(builder: GBuilder) {
        // check lint option
        if (builder.buildOptions.lint) {
            const eslint = require('gulp-eslint');
            const eslintOpts = builder.moduleOptions.eslint || {};
            builder.pipe(eslint(eslintOpts.eslint || eslintOpts))
                .pipe(eslint.format(eslintOpts.format))
                .pipe(eslint.failAfterError());
        }
        builder.pipe(require('gulp-babel')(builder.moduleOptions.babel)).sourceMaps();
    }
}

export default JavaScriptPlugin;
