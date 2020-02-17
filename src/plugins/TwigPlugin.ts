/**
 *  gbm Plugin - Twig
 */

import { Options } from "../core/common";
import { GPlugin } from "../core/plugin";
import { is, loadData } from "../utils/utils";
import { RTB } from "../core/rtb";

export class TwigPlugin extends GPlugin {
    constructor(options: Options = {}) { super(options); }

    process(rtb: RTB) {
        let twigOpts = rtb.moduleOptions.twig || {};
        let dataOpts = is.String(twigOpts.data) ? [twigOpts.data] : twigOpts.data;

        if (is.Array(dataOpts))
            rtb.pipe(require('gulp-data')(() => loadData(dataOpts)));

        rtb.pipe(require('gulp-twig')(twigOpts));

        if (rtb.buildOptions.minify)
            rtb.pipe(require('gulp-htmlmin')(rtb.moduleOptions.htmlmin));

        if (rtb.buildOptions.prettify)
            rtb.pipe(require('gulp-html-prettify')(rtb.moduleOptions.htmlPrettify));
    }
}

export default TwigPlugin;
