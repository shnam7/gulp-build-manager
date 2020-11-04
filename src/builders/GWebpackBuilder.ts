/**
 *  Webpack Builder
 */

import { GBuilder } from "../core/builder";

export class GWebpackBuilder extends GBuilder {
    constructor() { super(); }
    protected build() { this.ext.webpack(); }
}

export default GWebpackBuilder;
