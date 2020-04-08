/**
 *  Image Optimization Builder
 */

import { GBuilder, BuildConfig, FunctionBuilder } from "../core/builder";
import { requireSafe } from "../utils/npm";

export class GImagesBuilder extends GBuilder {
    constructor(conf: BuildConfig) {
        super(conf);
    }

    protected build() {
        this.src().pipe(requireSafe('gulp-imagemin')(this.moduleOptions.imagemin)).dest();
    }
}

export default GImagesBuilder;
