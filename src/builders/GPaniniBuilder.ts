/**
 *  Panini Builder
 */

import { GBuilder } from "../core/builder";
import { requireSafe } from "../utils/npm";

export class GPaniniBuilder extends GBuilder {
    constructor() { super(); }

    protected build() {
        this.src()
            .chain(() => {
                const panini = requireSafe('panini');
                panini.refresh();
                this.pipe(panini(this.moduleOptions.panini))
            })
            .rename({ extname: '.html' })
            .dest();
    }
}

export default GPaniniBuilder;
