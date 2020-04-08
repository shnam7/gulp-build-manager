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
        let rtlOpts = this.moduleOptions.rtlcss;
        let renameOpts = Object.assign({ suffix: '-rtl' }, this.moduleOptions.rename);

        this.src()
            .pipe(requireSafe('gulp-rtlcss')(rtlOpts))
            .rename(renameOpts)
            .dest();
    }
}

export default GRTLCSSBuilder;
