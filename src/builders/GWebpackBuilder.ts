/**
 *  Webpack Builder
 */

import { GBuilder } from "../core/builder";
import { WebpackPlugin } from "../plugins/WebpackPlugin";
import { warn } from "../utils/utils";

export class GWebpackBuilder extends GBuilder {
    constructor() { super(); }

    build() {
        if (this.conf.src)
            warn(`[GBM:GWebpackBuilder] src:${this.conf.src} will be ignored. User webpackConfig file to build src.`);
        this.chain(new WebpackPlugin());
    }
}

export default GWebpackBuilder;
