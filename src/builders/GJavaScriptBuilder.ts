/**
 *  JavaScript Builder
 */

import { GTranspiler } from "../core/builder";

export class GJavaScriptBuilder extends GTranspiler {
    constructor() { super(); }

    protected onTranspile() { this.ext.javaScript(); return this; }
    protected onMinify() { return this.minifyJs(); }
}

export default GJavaScriptBuilder;
