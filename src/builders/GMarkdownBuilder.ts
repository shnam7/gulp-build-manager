/**
 *  Markdown Builder
 */

import { GBuilder, BuildConfig, FunctionBuilder } from "../core/builder";

export class GMarkdownBuilder extends GBuilder {
    constructor(conf: BuildConfig) {
        super(conf);
    }

    protected build() {
        this.src().chain(this.ext.markdown()).dest();
    }
}

export default GMarkdownBuilder;
