/**
 *  CSS Builder with support for Sass/Scss, Less and PostCSS
 */

import { GTranspiler } from "../core/builder";

export class GCSSBuilder extends GTranspiler {
    constructor() { super(); }

    protected onTranspile() { this.ext.css(); return this; }
    protected onMinify() { return this.minifyCss(); }
}

export default GCSSBuilder;
