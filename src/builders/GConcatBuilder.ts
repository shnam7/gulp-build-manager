/**
 *  Concatenation Builder
 */

import { GBuilder, BuildConfig, FunctionBuilder } from "../core/builder";

export class GConcatBuilder extends GBuilder {
    constructor(conf: BuildConfig) {
        super(conf);
    }

    build() {
        this.src().concat().dest();
    }
}

export default GConcatBuilder;
