/**
 *  Webpack Builder
 */

import {GBuilder} from "../core/builder";
import {WebpackPlugin} from "../plugins/WebpackPlugin";

export class GWebpackBuilder extends GBuilder {
  constructor() { super(); }

  build() {
    this.src().chain(new WebpackPlugin()).dest();
  }
}

export default GWebpackBuilder;
