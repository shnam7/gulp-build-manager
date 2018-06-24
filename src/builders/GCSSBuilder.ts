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

    // if outfileOnly is not set, treat the default value to be true
    if (!this.conf.outFile || this.buildOptions.outFileOnly == false) {
      //---before concat
      if (this.buildOptions.minify || this.buildOptions.minifyOnly)
        this.pushStream().chain(GPlugin.cleancss).sourceMaps().dest().popStream();
      if (!this.buildOptions.minifyOnly) this.dest();
    }

    // concat and the next actions
    if (this.conf.outFile) this.chain(GPlugin.concat).sourceMaps();
    if (!this.buildOptions.minifyOnly) this.dest();
    if (this.buildOptions.minify || this.buildOptions.minifyOnly)
      this.chain(GPlugin.cleancss).sourceMaps().dest();
    return this;
  }
}

export default GCSSBuilder;
