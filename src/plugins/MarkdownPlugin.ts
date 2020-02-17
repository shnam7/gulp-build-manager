/**
 *  gbm Plugin - Markdown
 */

import { Options } from "../core/common";
import { GPlugin } from "../core/plugin";
import { RTB } from "../core/rtb";

export class MarkdownPlugin extends GPlugin {
    constructor(options: Options = {}) { super(options); }

    process(rtb: RTB) {
        rtb.pipe(require('gulp-markdown')(rtb.moduleOptions.markdown));
        if (rtb.buildOptions.minify) rtb.pipe(require('gulp-htmlclean')(rtb.moduleOptions.htmlmin));
        if (rtb.buildOptions.prettify) rtb.pipe(require('gulp-html-prettify')(rtb.moduleOptions.htmlPrettify));
    }
}

export default MarkdownPlugin;
