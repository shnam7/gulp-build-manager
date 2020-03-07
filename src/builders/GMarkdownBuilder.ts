/**
 *  Markdown Builder
 */

import { GBuilder, BuildConfig, FunctionBuilder } from "../core/builder";
import { MarkdownPlugin } from "../plugins/MarkdownPlugin";
import { Options } from "../core/common";

export class GMarkdownBuilder extends GBuilder {
    constructor(conf: BuildConfig) {
        super(conf);
    }

    build() {
        this.src().chain(new MarkdownPlugin()).dest();
    }
}

export default GMarkdownBuilder;
