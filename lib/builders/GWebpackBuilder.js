"use strict";
/**
 *  Webpack Builder
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GWebpackBuilder = void 0;
const builder_1 = require("../core/builder");
class GWebpackBuilder extends builder_1.GBuilder {
    constructor() { super(); }
    build() { this.ext.webpack(); }
}
exports.GWebpackBuilder = GWebpackBuilder;
exports.default = GWebpackBuilder;
