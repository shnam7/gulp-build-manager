/**
 *  gbm extension - markdown
 *
 *  buildOptions:
 *    minify: Minify html output
 *    prettify: Prettify html output
 *
 *  moduleOptions:
 *    markdown : Options to gulp-markdown.
 *    htmlmin : Options to gulp-htmlmin.
 *    prettier: Options to gulp-prettier.
 */

import { Options } from "../utils/utils";
import { RTB } from "../core/rtb";
import { requireSafe } from "../utils/npm";

RTB.registerExtension('markdown', (options: Options = {}) => (rtb: RTB) => {
    const { buildOptions: opts, moduleOptions: mopts } = rtb.conf;
    const markdownOpts = Object.assign({}, mopts.markdown, options.markdown);
    const htmlminOpts = Object.assign({}, mopts.htmlmin, options.htmlmin);
    const prettierOpts = Object.assign({}, mopts.prettier, options.prettier);

    rtb.pipe(requireSafe('gulp-markdown')(markdownOpts));
    if (opts.minify) rtb.pipe(requireSafe('gulp-htmlclean')(htmlminOpts));
    if (opts.prettify) rtb.pipe(requireSafe('gulp-prettier')(prettierOpts));
});
