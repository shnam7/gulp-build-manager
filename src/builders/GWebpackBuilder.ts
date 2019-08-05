/**
 *  Webpack Builder
 */

import { GBuilder } from "../core/builder";
import { WebpackPlugin } from "../plugins/WebpackPlugin";
import { warn } from "../utils/utils";

export class GWebpackBuilder extends GBuilder {
    constructor() { super(); }

    async build(): Promise<void> {
        if (this.conf.src)
            warn(`[GBM:GWebpackBuilder] src:${this.conf.src} will be ignored. User webpackConfig file to build src.`);
        return this.call(new WebpackPlugin());
    }
}

export default GWebpackBuilder;
