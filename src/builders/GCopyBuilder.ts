/**
 *  Copy Builder
 */

import { GBuilder } from "../core/builder";
import { GPlugin } from "../core/plugin";

export class GCopyBuilder extends GBuilder {
    constructor() { super(); }

    build() {
        let opts = {
            src: this.conf.src,
            dest: this.conf.dest,
            targets: this.buildOptions.targets
        };

        let promise = GPlugin.copy(this, opts);
        if (this.conf.flushStream) return promise;
    }
}

export default GCopyBuilder;
