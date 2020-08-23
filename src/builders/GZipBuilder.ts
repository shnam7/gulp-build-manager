/**
 *  Zip Builder
 */

import { GBuilder } from "../core/builder";
import { requireSafe } from "../utils/npm";

export class GZipBuilder extends GBuilder {
    constructor() { super(); }

    protected build() {
        this.src().pipe(requireSafe('gulp-zip')(this.conf.outFile)).dest();
    }
}

export default GZipBuilder;
