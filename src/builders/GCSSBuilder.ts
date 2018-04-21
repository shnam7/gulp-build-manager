/**
 *  CSS Builder with support for Sass/Scss, Less and PostCSS
 */

import {GBuilder} from "../core/builder";
import {CSSPlugin} from "../plugins/CSSPlugin";
import {GPlugin} from "../core/plugin";

export class GCSSBuilder extends GBuilder {
  constructor() { super(); }

  async build() {
    this.src().chain(new CSSPlugin());
    if (!this.buildOptions.minifyOnly) await this.dest();
    if (this.conf.outFile) this.chain(GPlugin.concat);
    if (this.buildOptions.minify || this.buildOptions.minifyOnly) this.chain(GPlugin.cssnano);
    return this.dest();
  }
}

export default GCSSBuilder;
