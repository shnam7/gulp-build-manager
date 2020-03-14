/**
 *  Webpack Builder
 */

import { GBuilder, BuildConfig, FunctionBuilder } from "../core/builder";
import { WebpackPlugin } from "../plugins/WebpackPlugin";
import { warn } from "../utils/utils";

export class GWebpackBuilder extends GBuilder {
    constructor(conf: BuildConfig) {
        super(conf);
    }

    protected build() {
        if (this.conf.src)
            warn(`[GBM:GWebpackBuilder] src:${this.conf.src} will be ignored. Use webpackConfig file to build src.`);
        this.chain(new WebpackPlugin());
    }
}

export default GWebpackBuilder;
