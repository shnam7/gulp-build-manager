"use strict";
/**
 *  Webpack Builder
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GWebpackBuilder = void 0;
const builder_1 = require("../core/builder");
const utils_1 = require("../utils/utils");
class GWebpackBuilder extends builder_1.GBuilder {
    constructor() { super(); }
    build() {
        if (this.conf.src)
            utils_1.warn(`[GBM:GWebpackBuilder] src:${this.conf.src} will be ignored. Use webpackConfig file to build src.`);
        this.chain(this.ext.webpack());
    }
}
exports.GWebpackBuilder = GWebpackBuilder;
exports.default = GWebpackBuilder;
