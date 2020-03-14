/**
 *  Panini Builder
 */

import { GBuilder, BuildConfig, FunctionBuilder } from "../core/builder";
import { Options } from "../core/common";

export class GPaniniBuilder extends GBuilder {
    constructor(conf: BuildConfig) {
        super(conf);
    }

    protected build() {
        this.src()
            .chain(() => {
                const panini = require('panini');
                panini.refresh();
                this.pipe(panini(this.moduleOptions.panini))
            })
            .rename({ extname: '.html' })
            .dest();
    }
}

export default GPaniniBuilder;
