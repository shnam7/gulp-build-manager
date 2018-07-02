/**
 *  TypeScript Builder
 */

import {GBuilder} from "../core/builder";
import {TypeScriptPlugin} from "../plugins/TypeScriptPlugin";

export class GTypeScriptBuilder extends GBuilder {
  constructor() { super(); }

  build() {
    this.src().chain(new TypeScriptPlugin());

    // concat stream is handled by gulp-typescript. only non-concat is handled here
    const opts = this.buildOptions;
    if (!opts.minifyOnly) this.dest();      // concat non-minified

    let jsFilter =  require("gulp-filter")(["**/*.js"], {restore: true});
    if (opts.minify || opts.minifyOnly) this
      .pipe(jsFilter).minifyJs()        // minify *.js files only (not dts files)
      .pipe(jsFilter.restore).dest();   // concat minified
  }
}

export default GTypeScriptBuilder;
