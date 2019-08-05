/**
 *  Panini Builder
 */

import { GBuilder } from "../core/builder";
import { GPlugin } from "../core/plugin";

export class GPaniniBuilder extends GBuilder {
    constructor() { super(); }

    build() {
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
