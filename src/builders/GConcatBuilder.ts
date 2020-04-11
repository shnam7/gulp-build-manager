/**
 *  Concatenation Builder
 */

import { GBuilder, BuildConfig } from "../core/builder";

export class GConcatBuilder extends GBuilder {
    constructor() { super(); }

    protected build() { this.src().concat().dest(); }
}

export default GConcatBuilder;
