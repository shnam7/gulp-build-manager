/**
 *  CoffeeScript Builder
 */

import GJavaScriptBuilder from "./GJavaScriptBuilder";

export class GCoffeeScriptBuilder extends GJavaScriptBuilder {
    constructor() { super(); }

    protected onTranspile() { this.ext.coffeeScript(); return this; }
}

export default GCoffeeScriptBuilder;
