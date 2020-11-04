/**
 *  RTLCSS Builder
 *
 */

import { GBuilder } from "../core/builder";
import { requireSafe } from "../utils/npm";

export class GRTLCSSBuilder extends GBuilder {
    constructor() { super(); }

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
