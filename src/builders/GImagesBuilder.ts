/**
 *  Image Optimization Builder
 */

import { GBuilder, BuildConfig, FunctionBuilder } from "../core/builder";
import { Options } from "../core/common";

export class GImagesBuilder extends GBuilder {
    constructor(conf: BuildConfig) {
        super(conf);
    }

    build() {
        this.src().pipe(require('gulp-imagemin')(this.moduleOptions.imagemin)).dest();
    }
}

export default GImagesBuilder;
