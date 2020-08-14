"use strict";
/**
 *  CSS Builder with support for Sass/Scss, Less and PostCSS
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GCSSBuilder = void 0;
const builder_1 = require("../core/builder");
class GCSSBuilder extends builder_1.GTranspiler {
    constructor() { super(); }
    onTranspile() { return this.chain(this.ext.css()); }
    onMinify() { return this.minifyCss(); }
}
exports.GCSSBuilder = GCSSBuilder;
exports.default = GCSSBuilder;
