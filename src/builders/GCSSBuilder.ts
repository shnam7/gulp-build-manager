/**
 *  CSS Builder with support for Sass/Scss, Less and PostCSS
 */

import { GBuilder, BuildConfig, FunctionBuilder } from "../core/builder";
import { warn } from "../utils/utils";

export class GCSSBuilder extends GBuilder {
    constructor(conf: BuildConfig) {
        super(conf);
    }

    protected build() {
        this.src().chain(this.ext.css());
        const opts = this.conf.buildOptions;

        // sanity check for options
        if (!this.conf.outFile && opts.outFileOnly)
            warn('[GBM:GCSSBuilder] outFileOnly option requires valid outFile value.');

        // evaluate options
        const concat = !!this.conf.outFile;
        const concatOnly = concat && opts.outFileOnly !== false;

        // dmsg(`outFile=${this.conf.outFile}, outFileOnly=${opts.outFileOnly}`);
        // dmsg(`concat=${concat}, concatOnly=${concatOnly}`);
        // dmsg(`minify=${opts.minify}, minifyOnly=${opts.minifyOnly}`);

        // concat stream
        if (concat) {
            this.pushStream().concat();

            if (!opts.minifyOnly) this.dest();      // concat non-minified
            if (opts.minify || opts.minifyOnly) this.minifyCss().dest();  // concat minified

            this.popStream();
        }

        // non-concat
        if (!concat || !concatOnly) {
            if (!opts.minifyOnly) this.dest();      // concat non-minified
            if (opts.minify || opts.minifyOnly) this.minifyCss().dest();  // concat minified
        }
    }
}

export default GCSSBuilder;
