/**
 *  Twig Builder
 */

import { GBuilder, BuildConfig, FunctionBuilder } from "../core/builder";
import TwigPlugin from "../plugins/TwigPlugin";
import { Options } from "../core/common";

export class GTwigBuilder extends GBuilder {
    constructor(conf: BuildConfig) {
        super(conf);
    }

    build() {
        this.src().chain(new TwigPlugin()).dest();
    }
}

export default GTwigBuilder;
