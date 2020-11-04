/**
 *  Markdown Builder
 */

import { GBuilder } from "../core/builder";

export class GMarkdownBuilder extends GBuilder {
    constructor() { super(); }

    protected build() {
        this.src().ext.markdown().dest();
    }
}

export default GMarkdownBuilder;
