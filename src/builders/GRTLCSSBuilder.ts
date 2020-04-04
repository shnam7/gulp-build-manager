/**
 *  RTLCSS Builder
 *
 */

import { GBuilder, BuildConfig, FunctionBuilder } from "../core/builder";
import { requireSafe } from "../utils/npm";

export class GRTLCSSBuilder extends GBuilder {
    constructor(conf: BuildConfig) {
        super(conf);
    }

    protected build() {
        let rtlOpts = this.conf.moduleOptions.rtlcss || {};
        let renameOpts = this.conf.moduleOptions.rename || { suffix: '-rtl' };

        this.src()
            .pipe(requireSafe('gulp-rtlcss')(rtlOpts))
            .rename(renameOpts)
            .dest();
    }
}

export default GRTLCSSBuilder;
