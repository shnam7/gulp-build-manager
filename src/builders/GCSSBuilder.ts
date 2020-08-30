/**
 *  CSS Builder with support for Sass/Scss, Less and PostCSS
 */

import { GTranspiler } from "../core/builder";

export class GCSSBuilder extends GTranspiler {
    constructor() { super(); }

    protected onTranspile() { return this.chain(this.ext.css()); }
    protected onMinify() { return this.minifyCss(); }
}

export default GCSSBuilder;
