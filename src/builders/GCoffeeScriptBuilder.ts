/**
 *  CoffeeScript Builder
 */

import { CoffeeScriptPlugin } from "../plugins/CoffeeScriptPlugin";
import GJavaScriptBuilder from "./GJavaScriptBuilder";

export class GCoffeeScriptBuilder extends GJavaScriptBuilder {
    constructor() { super(); }

    transpile() {
        return this.chain(new CoffeeScriptPlugin());
    }
}

export default GCoffeeScriptBuilder;
