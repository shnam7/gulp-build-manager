"use strict";
/**
 *  Zip Builder
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GZipBuilder = void 0;
const builder_1 = require("../core/builder");
const npm_1 = require("../utils/npm");
class GZipBuilder extends builder_1.GBuilder {
    constructor() { super(); }
    build() {
        this.src().pipe(npm_1.requireSafe('gulp-zip')(this.conf.outFile)).dest();
    }
}
exports.GZipBuilder = GZipBuilder;
exports.default = GZipBuilder;
