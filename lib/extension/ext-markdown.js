"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const rtb_1 = require("../core/rtb");
const npm_1 = require("../utils/npm");
rtb_1.RTB.registerExtension('markdown', (options = {}) => (rtb) => {
    const { buildOptions: opts, moduleOptions: mopts } = rtb.conf;
    const markdownOpts = Object.assign({}, mopts.markdown, options.markdown);
    const htmlminOpts = Object.assign({}, mopts.htmlmin, options.htmlmin);
    const prettierOpts = Object.assign({}, mopts.prettier, options.prettier);
    rtb.pipe(npm_1.requireSafe('gulp-markdown')(markdownOpts));
    if (opts.minify)
        rtb.pipe(npm_1.requireSafe('gulp-htmlclean')(htmlminOpts));
    if (opts.prettify)
        rtb.pipe(npm_1.requireSafe('gulp-prettier')(prettierOpts));
});
