"use strict";
/**
 *  Image Optimization Builder
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GImagesBuilder = void 0;
const builder_1 = require("../core/builder");
const npm_1 = require("../utils/npm");
class GImagesBuilder extends builder_1.GBuilder {
    constructor() { super(); }
    build() {
        this.src().pipe(npm_1.requireSafe('gulp-imagemin')(this.moduleOptions.imagemin)).dest();
    }
}
exports.GImagesBuilder = GImagesBuilder;
exports.default = GImagesBuilder;
