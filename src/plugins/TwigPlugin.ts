/**
 *  gbm Plugin - Twig
 */

import { Options } from "../core/common";
import { GBuilder } from "../core/builder";
import { GPlugin } from "../core/plugin";
import { is, loadData } from "../utils/utils";

export class TwigPlugin extends GPlugin {
    constructor(options: Options = {}) { super(options); }

    process(builder: GBuilder) {
        let twigOpts = builder.moduleOptions.twig || {};
        let dataOpts = is.String(twigOpts.data) ? [twigOpts.data] : twigOpts.data;

        if (is.Array(dataOpts))
            builder.pipe(require('gulp-data')(() => loadData(dataOpts)));

        builder.pipe(require('gulp-twig')(twigOpts));

        if (builder.buildOptions.minify)
            builder.pipe(require('gulp-htmlmin')(builder.moduleOptions.htmlmin));

        if (builder.buildOptions.prettify)
            builder.pipe(require('gulp-html-prettify')(builder.moduleOptions.htmlPrettify));
    }
}

export default TwigPlugin;
