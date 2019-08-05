/**
 *  JavaScript Builder
 */

import { GBuilder } from "../core/builder";
import JavaScriptPlugin from "../plugins/JavaScriptPlugin";
import { warn } from "../utils/utils";

export class GJavaScriptBuilder extends GBuilder {
    constructor() { super(); }

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
