/**
 *  Markdown Builder
 */

import { GBuilder, BuildConfig } from "../core/builder";

export class GMarkdownBuilder extends GBuilder {
    constructor() { super(); }

    protected build() {
        this.src().chain(this.ext.markdown()).dest();
    }
}

export default GMarkdownBuilder;
