/**
 *  Webpack Builder
 */

import { GBuilder } from "../core/builder";
import { warn } from "../utils/utils";

export class GWebpackBuilder extends GBuilder {
    constructor() { super(); }

    protected build() {
        if (this.conf.src)
            warn(`[GBM:GWebpackBuilder] src:${this.conf.src} will be ignored. Use webpackConfig file to build src.`);
        this.ext.webpack();
    }
}

export default GWebpackBuilder;
