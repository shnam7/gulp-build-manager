/**
 *  CoffeeScript Builder
 */

import {GBuilder} from "../core/builder";
import {CoffeeScriptPlugin} from "../plugins/CoffeeScriptPlugin";
import {GPlugin} from "../core/plugin";
import JavaScriptPlugin from "../plugins/JavaScriptPlugin";

export class GCoffeeScriptBuilder extends GBuilder {
  constructor() { super(); }

  async build() {
    this.src().chain(new CoffeeScriptPlugin());

    // if outfileOnly is not set, it's default value is treated to be true
    if (!this.conf.outFile || this.buildOptions.outFileOnly == false) {
      //---before concat
      if (this.buildOptions.minify || this.buildOptions.minifyOnly)
        this.pushStream().chain(GPlugin.uglify).dest().popStream();
      if (!this.buildOptions.minifyOnly) this.dest();
    }

    // concat and the next actions
    if (this.conf.outFile) this.chain(GPlugin.concat);
    if (!this.buildOptions.minifyOnly) this.dest();
    if (this.buildOptions.minify || this.buildOptions.minifyOnly) this.chain(GPlugin.uglify).dest();
    return this;
  }
}

export default GCoffeeScriptBuilder;
