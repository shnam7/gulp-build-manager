/**
 *  Concatenation Builder
 */

import { GBuilder } from "../core/builder";

export class GConcatBuilder extends GBuilder {
    constructor() { super(); }

    build() {
        this.src().concat().dest();
    }
}

export default GConcatBuilder;
