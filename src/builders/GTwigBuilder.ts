/**
 *  Twig Builder
 */

import {GBuilder} from "../core/builder";
import TwigPlugin from "../plugins/TwigPlugin";

export class GTwigBuilder extends GBuilder {
  constructor() { super(); }

  build() {
    this.src().chain(new TwigPlugin()).dest();
  }
}

export default GTwigBuilder;
