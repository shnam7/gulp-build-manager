/**
 *  JavaScript Builder
 */

import { GTranspiler } from "../core/builder";

export class GJavaScriptBuilder extends GTranspiler {
    constructor() { super(); }

    protected onTranspile() { return this.chain(this.ext.javaScript()); }
    protected onMinify() { return this.minifyJs(); }
}

export default GJavaScriptBuilder;
