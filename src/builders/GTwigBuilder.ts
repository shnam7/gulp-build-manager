/**
 *  Twig Builder
 */

import { GBuilder, BuildConfig, FunctionBuilder } from "../core/builder";

export class GTwigBuilder extends GBuilder {
    constructor(conf: BuildConfig) {
        super(conf);
    }

    protected build() {
        this.src().chain(this.ext.twig()).dest();
    }
}

export default GTwigBuilder;
