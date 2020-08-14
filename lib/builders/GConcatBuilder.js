"use strict";
/**
 *  Concatenation Builder
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GConcatBuilder = void 0;
const builder_1 = require("../core/builder");
class GConcatBuilder extends builder_1.GBuilder {
    constructor() { super(); }
    build() { this.src().concat().dest(); }
}
exports.GConcatBuilder = GConcatBuilder;
exports.default = GConcatBuilder;
