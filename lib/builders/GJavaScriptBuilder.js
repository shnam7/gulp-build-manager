"use strict";
/**
 *  JavaScript Builder
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GJavaScriptBuilder = void 0;
const builder_1 = require("../core/builder");
class GJavaScriptBuilder extends builder_1.GTranspiler {
    constructor() { super(); }
    onTranspile() { return this.chain(this.ext.javaScript()); }
    onMinify() { return this.minifyJs(); }
}
exports.GJavaScriptBuilder = GJavaScriptBuilder;
exports.default = GJavaScriptBuilder;
