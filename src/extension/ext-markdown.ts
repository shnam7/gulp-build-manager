import { Options } from "../core/common";
import { RTB } from "../core/rtb";

RTB.registerExtension('markdown', (options: Options = {}) => (rtb: RTB) => {
    rtb.pipe(require('gulp-markdown')(rtb.moduleOptions.markdown));
    if (rtb.buildOptions.minify) rtb.pipe(require('gulp-htmlclean')(rtb.moduleOptions.htmlmin));
    if (rtb.buildOptions.prettify) rtb.pipe(require('gulp-html-prettify')(rtb.moduleOptions.htmlPrettify));
});
