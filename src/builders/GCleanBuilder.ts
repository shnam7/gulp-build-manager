/**
 *  Concatenation Builder
 */

import {GBuilder} from "../core/builder";
import {GPlugin} from "../core/plugin";

export class GCleanBuilder extends GBuilder {
  constructor() { super(); }

  build() {
    let promise = GPlugin.clean(this);
    if (this.conf.flushStream) return promise;
  }
}

export default GCleanBuilder;
