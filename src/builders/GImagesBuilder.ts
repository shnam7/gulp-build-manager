/**
 *  Image Optimization Builder
 */

import { GBuilder } from "../core/builder";

export class GImagesBuilder extends GBuilder {
    constructor() { super(); }

    build() {
        this.src().pipe(require('gulp-imagemin')(this.moduleOptions.imagemin)).dest();
    }
}

export default GImagesBuilder;
