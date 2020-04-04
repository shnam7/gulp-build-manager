import { Options } from "../core/common";
import { RTB } from "../core/rtb";
import { requireSafe } from "../utils/npm";

RTB.registerExtension('markdown', (options: Options = {}) => (rtb: RTB) => {
    rtb.pipe(requireSafe('gulp-markdown')(rtb.conf.moduleOptions.markdown));
    if (rtb.conf.buildOptions.minify) rtb.pipe(requireSafe('gulp-htmlclean')(rtb.conf.moduleOptions.htmlmin));
    if (rtb.conf.buildOptions.prettify) rtb.pipe(requireSafe('gulp-html-beautify')(rtb.conf.moduleOptions.htmlBeautify));
});
