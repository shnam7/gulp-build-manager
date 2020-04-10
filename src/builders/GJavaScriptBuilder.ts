/**
 *  JavaScript Builder
 */

import { GTranspiler, BuildConfig } from "../core/builder";

export class GJavaScriptBuilder extends GTranspiler {
    constructor(conf: BuildConfig) { super(conf); }

    protected onTranspile() { return this.chain(this.ext.javaScript()); }
    protected onMinify() { return this.minifyJs(); }
}

export default GJavaScriptBuilder;
