/**
 *  CoffeeScript Builder
 */

import GJavaScriptBuilder from "./GJavaScriptBuilder";
import { BuildConfig } from "../core/builder";

export class GCoffeeScriptBuilder extends GJavaScriptBuilder {
    constructor(conf: BuildConfig) { super(conf); }

    transpile() {
        return this.chain(this.ext.coffeeScript());
    }
}

export default GCoffeeScriptBuilder;
