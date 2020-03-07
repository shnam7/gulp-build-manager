/**
 *  Zip Builder
 */

import { GBuilder, BuildConfig, FunctionBuilder } from "../core/builder";

export class GZipBuilder extends GBuilder {
    constructor(conf: BuildConfig) {
        super(conf);
    }

    build() {
        this.src().pipe(require('gulp-zip')(this.conf.outFile)).dest();
    }
}

export default GZipBuilder;
