"use strict";
/**
 *  TypeScript Builder
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GTypeScriptBuilder = void 0;
const builder_1 = require("../core/builder");
const npm_1 = require("../utils/npm");
class GTypeScriptBuilder extends builder_1.GBuilder {
    constructor() { super(); }
    build() {
        this.src().ext.typeScript();
        // concat stream is handled by gulp-typescript. only non-concat is handled here
        const opts = this.buildOptions;
        if (!opts.minifyOnly)
            this.dest(); // concat non-minified
        let jsFilter = npm_1.requireSafe("gulp-filter")(["**/*.js"], { restore: true });
        if (opts.minify || opts.minifyOnly) {
            this.filter()
                .pipe(jsFilter).minifyJs() // minify *.js files only (not dts files)
                .pipe(jsFilter.restore).dest();
        }
    }
}
exports.GTypeScriptBuilder = GTypeScriptBuilder;
exports.default = GTypeScriptBuilder;
