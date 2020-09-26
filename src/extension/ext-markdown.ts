/**
 *  gbm extension - markdown
 */

import { Options } from "../utils/utils";
import { RTB } from "../core/rtb";
import { requireSafe } from "../utils/npm";

RTB.registerExtension('markdown', (options: Options = {}) => (rtb: RTB) => {
    rtb.pipe(requireSafe('gulp-markdown')(rtb.moduleOptions.markdown));
    if (rtb.buildOptions.minify) rtb.pipe(requireSafe('gulp-htmlclean')(rtb.moduleOptions.htmlmin));
    if (rtb.buildOptions.prettify) rtb.pipe(requireSafe('gulp-prettier')(rtb.moduleOptions.prettier));
});
