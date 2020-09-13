"use strict";
/**
 *  Twig Builder
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GTwigBuilder = void 0;
const builder_1 = require("../core/builder");
class GTwigBuilder extends builder_1.GBuilder {
    constructor() { super(); }
    build() {
        this.src().ext.twig().dest();
    }
}
exports.GTwigBuilder = GTwigBuilder;
exports.default = GTwigBuilder;
