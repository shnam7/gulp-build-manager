/**
 *  RTLCSS Builder
 *
 */

import { GBuilder, BuildConfig, FunctionBuilder } from "../core/builder";

export class GRTLCSSBuilder extends GBuilder {
    constructor(conf: BuildConfig) {
        super(conf);
    }

    protected build() {
        let rtlOpts = this.moduleOptions.rtlcss || {};
        let renameOpts = this.moduleOptions.rename || { suffix: '-rtl' };

        this.src()
            .pipe(require('gulp-rtlcss')(rtlOpts))
            .rename(renameOpts)
            .dest();
    }
}

export default GRTLCSSBuilder;
