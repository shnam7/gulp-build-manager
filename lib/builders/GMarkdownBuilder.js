"use strict";
/**
 *  Markdown Builder
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GMarkdownBuilder = void 0;
const builder_1 = require("../core/builder");
class GMarkdownBuilder extends builder_1.GBuilder {
    constructor() { super(); }
    build() {
        this.src().ext.markdown().dest();
    }
}
exports.GMarkdownBuilder = GMarkdownBuilder;
exports.default = GMarkdownBuilder;
