/**
 *  Twig Builder
 */

import { GBuilder } from "../core/builder";

export class GTwigBuilder extends GBuilder {
    constructor() { super(); }

    protected build() {
        this.src().chain(this.ext.twig()).dest();
    }
}

export default GTwigBuilder;
