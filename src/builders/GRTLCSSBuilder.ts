/**
 *  RTLCSS Builder
 *
 */

import { GBuilder, BuildConfig, FunctionBuilder } from "../core/builder";
import { Options } from "../core/common";

export class GRTLCSSBuilder extends GBuilder {
    constructor(conf: BuildConfig) {
        super(conf);
    }

    build() {
        let rtlOpts = this.moduleOptions.rtlcss || {};
        let renameOpts = this.moduleOptions.rename || { suffix: '-rtl' };

        this.src()
            .pipe(require('gulp-rtlcss')(rtlOpts))
            .rename(renameOpts)
            .dest();
    }
}

export default GRTLCSSBuilder;
