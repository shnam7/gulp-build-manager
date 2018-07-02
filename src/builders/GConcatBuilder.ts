/**
 *  Concatenation Builder
 */

import {GBuilder} from "../core/builder";
import {GPlugin} from "../core/plugin";

export class GConcatBuilder extends GBuilder {
  constructor() { super(); }

  build() {
    this.src().concat().dest();
  }
}

export default GConcatBuilder;
