/**
 *  TypeScript Builder
 */

import { GBuilder } from "../core/builder";
import { requireSafe } from "../utils/npm";

export class GTypeScriptBuilder extends GBuilder {
    constructor() { super(); }

    protected build() {
        this.src().ext.typeScript();

        // concat stream is handled by gulp-typescript. only non-concat is handled here
        const opts = this.buildOptions;
        if (!opts.minifyOnly) this.dest();      // concat non-minified

        let jsFilter = requireSafe("gulp-filter")(["**/*.js"], { restore: true });
        if (opts.minify || opts.minifyOnly) {
            this.filter()
                .pipe(jsFilter).minifyJs()              // minify *.js files only (not dts files)
                .pipe(jsFilter.restore).dest();
        }
    }
}

export default GTypeScriptBuilder;
