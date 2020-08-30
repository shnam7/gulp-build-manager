/**
 *  CoffeeScript Builder
 */

import GJavaScriptBuilder from "./GJavaScriptBuilder";

export class GCoffeeScriptBuilder extends GJavaScriptBuilder {
    constructor() { super(); }

    protected onTranspile() { return this.chain(this.ext.coffeeScript()); } }

export default GCoffeeScriptBuilder;
