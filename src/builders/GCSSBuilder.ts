/**
 *  CSS Builder with support for Sass/Scss, Less and PostCSS
 */

import { GTranspiler, BuildConfig } from "../core/builder";

export class GCSSBuilder extends GTranspiler {
    constructor(conf: BuildConfig) { super(conf); }

    protected onTranspile() { return this.chain(this.ext.css()); }
    protected onMinify() { return this.minifyCss(); }
}

export default GCSSBuilder;
