/**
 *  CoffeeScript Builder
 */

import GJavaScriptBuilder from "./GJavaScriptBuilder";
import { BuildConfig } from "../core/builder";

export class GCoffeeScriptBuilder extends GJavaScriptBuilder {
    constructor() { super(); }

    protected onTranspile() { return this.chain(this.ext.coffeeScript()); } }

export default GCoffeeScriptBuilder;
