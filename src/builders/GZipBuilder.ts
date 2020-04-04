/**
 *  Zip Builder
 */

import { GBuilder, BuildConfig, FunctionBuilder } from "../core/builder";
import { requireSafe } from "../utils/npm";

export class GZipBuilder extends GBuilder {
    constructor(conf: BuildConfig) {
        super(conf);
    }

    protected build() {
        this.src().pipe(requireSafe('gulp-zip')(this.conf.outFile)).dest();
    }
}

export default GZipBuilder;
