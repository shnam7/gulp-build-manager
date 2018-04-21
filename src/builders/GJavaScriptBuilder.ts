/**
 *  JavaScript Builder
 */

import {GBuilder} from "../core/builder";
import JavaScriptPlugin from "../plugins/JavaScriptPlugin";
import {GPlugin} from "../core/plugin";

export class GJavaScriptBuilder extends GBuilder {
  constructor() { super(); }

  async build() {
    this.src().chain(new JavaScriptPlugin());
    if (!this.buildOptions.minifyOnly) await this.dest();
    if (this.conf.outFile) this.chain(GPlugin.concat);
    if (this.buildOptions.minify || this.buildOptions.minifyOnly) this.chain(GPlugin.uglify);
    return this.dest();
  }
}

export default GJavaScriptBuilder;
