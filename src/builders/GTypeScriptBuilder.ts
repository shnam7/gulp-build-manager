/**
 *  TypeScript Builder
 */

import { GBuilder, BuildConfig, FunctionBuilder } from "../core/builder";
import { TypeScriptPlugin } from "../plugins/TypeScriptPlugin";
import { Options } from "../core/common";

export class GTypeScriptBuilder extends GBuilder {
    constructor(conf: BuildConfig) {
        super(conf);
    }

    protected build() {
        this.src().chain(new TypeScriptPlugin());

        // concat stream is handled by gulp-typescript. only non-concat is handled here
        const opts = this.buildOptions;
        if (!opts.minifyOnly) this.dest();      // concat non-minified

        let jsFilter = require("gulp-filter")(["**/*.js"], { restore: true });
        if (opts.minify || opts.minifyOnly) {
            this
                .filter(["**", "!**/*js.map"])   // exclude non-minified map files
                .pipe(jsFilter).minifyJs()              // minify *.js files only (not dts files)
                .pipe(jsFilter.restore).dest();
        }
    }
}

export default GTypeScriptBuilder;
