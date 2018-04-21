/**
 *  CoffeeScript Builder
 */

import {GBuilder} from "../core/builder";
import {CoffeeScriptPlugin} from "../plugins/CoffeeScriptPlugin";
import {GPlugin} from "../core/plugin";

export class GCoffeeScriptBuilder extends GBuilder {
  constructor() { super(); }

  async build() {
    this.src().chain(new CoffeeScriptPlugin());
    if (!this.buildOptions.minifyOnly) await this.dest();
    if (this.conf.outFile) this.chain(GPlugin.concat);
    if (this.buildOptions.minify || this.buildOptions.minifyOnly) this.chain(GPlugin.uglify);
    return this.dest();
  }
}

export default GCoffeeScriptBuilder;
