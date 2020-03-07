/**
 *  CoffeeScript Builder
 */

import GJavaScriptBuilder from "./GJavaScriptBuilder";
import { BuildConfig } from "../core/builder";
import { CoffeeScriptPlugin } from "../plugins/CoffeeScriptPlugin";

export class GCoffeeScriptBuilder extends GJavaScriptBuilder {
    constructor(conf: BuildConfig) {
        super(conf);
    }

    transpile() {
        return this.chain(new CoffeeScriptPlugin());
    }
}

export default GCoffeeScriptBuilder;
