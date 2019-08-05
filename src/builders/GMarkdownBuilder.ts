/**
 *  Markdown Builder
 */

import { GBuilder } from "../core/builder";
import { MarkdownPlugin } from "../plugins/MarkdownPlugin";

export class GMarkdownBuilder extends GBuilder {
    constructor() { super(); }

    build() {
        this.src().chain(new MarkdownPlugin()).dest();
    }
}

export default GMarkdownBuilder;
