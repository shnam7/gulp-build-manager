/**
 *  Zip Builder
 */

import { GBuilder } from "../core/builder";

export class GZipBuilder extends GBuilder {
    constructor() { super(); }

    build() {
        this.src().pipe(require('gulp-zip')(this.conf.outFile)).dest();
    }
}

export default GZipBuilder;
