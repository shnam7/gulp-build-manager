/**
 *  JavaScript Builder
 */

import { GBuilder, BuildConfig, FunctionBuilder } from "../core/builder";
import JavaScriptPlugin from "../plugins/JavaScriptPlugin";
import { warn } from "../utils/utils";
import { Options } from "../core/common";

export class GJavaScriptBuilder extends GBuilder {
    constructor(conf: BuildConfig) {
        super(conf);
    }

    transpile() {
        return this.chain(new JavaScriptPlugin());
    }

    build() {
        this.src().transpile();
        const opts = this.buildOptions;

        // sanity check for options
        if (!this.conf.outFile && opts.outFileOnly)
            warn('[GBM:GJavaScriptBuilder] outFileOnly option requires valid outFile value.');

        // evaluate options
        const concat = !!this.conf.outFile;
        const concatOnly = concat && opts.outFileOnly !== false;

        // concat stream
        if (concat) {
            this.pushStream().concat();

            if (!opts.minifyOnly) this.dest();      // concat non-minified
            if (opts.minify || opts.minifyOnly) this.minifyJs().dest();  // concat minified

            this.popStream();
        }

        // non-concat
        if (!concat || !concatOnly) {
            if (!opts.minifyOnly) this.dest();      // concat non-minified
            if (opts.minify || opts.minifyOnly) this.minifyJs().dest();  // concat minified
        }
    }
}

export default GJavaScriptBuilder;
