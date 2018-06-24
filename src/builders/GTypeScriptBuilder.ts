/**
 *  TypeScript Builder
 */

import {GBuilder} from "../core/builder";
import {TypeScriptPlugin} from "../plugins/TypeScriptPlugin";
import {GPlugin} from "../core/plugin";

export class GTypeScriptBuilder extends GBuilder {
  constructor() { super(); }

  async build() {
    this.src();
    let promise = (new TypeScriptPlugin()).process(this); // get promise for dts
    if (this.conf.flushStream) await promise;  // flush dts files
    if (!this.buildOptions.minifyOnly) this.dest();

    // note: concat is not require, which will be done by typescript if buildOptions.outFile is set
    if (this.buildOptions.minify || this.buildOptions.minifyOnly)
      this.chain(GPlugin.uglify).sourceMaps();
    return this.dest();
  }
}

export default GTypeScriptBuilder;
