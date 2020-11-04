/**
 *  Twig Builder
 */

import { GBuilder } from "../core/builder";

export class GTwigBuilder extends GBuilder {
    constructor() { super(); }

    protected build() {
        this.src().ext.twig().dest();
    }
}

export default GTwigBuilder;
