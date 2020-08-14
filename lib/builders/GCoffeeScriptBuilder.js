"use strict";
/**
 *  CoffeeScript Builder
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GCoffeeScriptBuilder = void 0;
const GJavaScriptBuilder_1 = require("./GJavaScriptBuilder");
class GCoffeeScriptBuilder extends GJavaScriptBuilder_1.default {
    constructor() { super(); }
    onTranspile() { return this.chain(this.ext.coffeeScript()); }
}
exports.GCoffeeScriptBuilder = GCoffeeScriptBuilder;
exports.default = GCoffeeScriptBuilder;
