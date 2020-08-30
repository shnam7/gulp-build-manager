/**
 *  Image Optimization Builder
 */

import { GBuilder } from "../core/builder";
import { requireSafe } from "../utils/npm";

export class GImagesBuilder extends GBuilder {
    constructor() { super(); }

    protected build() {
        this.src().pipe(requireSafe('gulp-imagemin')(this.moduleOptions.imagemin)).dest();
    }
}

export default GImagesBuilder;
