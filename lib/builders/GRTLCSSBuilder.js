"use strict";
/**
 *  RTLCSS Builder
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GRTLCSSBuilder = void 0;
const builder_1 = require("../core/builder");
const npm_1 = require("../utils/npm");
class GRTLCSSBuilder extends builder_1.GBuilder {
    constructor() { super(); }
    build() {
        let rtlOpts = this.moduleOptions.rtlcss;
        let renameOpts = Object.assign({ suffix: '-rtl' }, this.moduleOptions.rename);
        this.src()
            .pipe(npm_1.requireSafe('gulp-rtlcss')(rtlOpts))
            .rename(renameOpts)
            .dest();
    }
}
exports.GRTLCSSBuilder = GRTLCSSBuilder;
exports.default = GRTLCSSBuilder;
