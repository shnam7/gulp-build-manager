/**
 *  Webpack Builder
 */

import { GBuilder, BuildConfig, FunctionBuilder } from "../core/builder";
import { warn } from "../utils/utils";

export class GWebpackBuilder extends GBuilder {
    constructor() { super(); }

    protected build() {
        if (this.conf.src)
            warn(`[GBM:GWebpackBuilder] src:${this.conf.src} will be ignored. Use webpackConfig file to build src.`);
        this.chain(this.ext.webpack());
    }
}

export default GWebpackBuilder;
