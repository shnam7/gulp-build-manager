/**
 *  RTLCSS Builder
 *  
 */

import { GBuilder } from "../core/builder";

export class GRTLCSSBuilder extends GBuilder {
  constructor() { super(); }

  build() {
    let rtlOpts = this.moduleOptions.rtlcss || {};
    let renameOpts = this.moduleOptions.rename || {suffix: '-rtl'};

    this.src()
      .pipe(require('gulp-rtlcss')(rtlOpts))
      .rename(renameOpts)
      .dest();
  }
}

export default GRTLCSSBuilder;
