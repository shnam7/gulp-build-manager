/**
 *  gbm extension - twig
 *
 *  buildOptions:
 *    minify: Minify html output
 *    prettify: Prettify html output
 *
 *  moduleOptions:
 *    twig: Options to gulp-twig. twig.data can be object or data file names in string or string array.
 *    htmlmin: Options to gulp-htmlmin.
 *    prettier: Options to gulp-prettier.
 */

import { RTB } from "../core/rtb";
import { Options, is, loadData, arrayify } from "../utils/utils";
import { requireSafe } from "../utils/npm";

RTB.registerExtension('twig', (options: Options = {}) => (rtb: RTB) => {
    const { buildOptions: opts, moduleOptions: mopts } = rtb.conf;
    const twigOpts = Object.assign({}, mopts.twig, options.twig);
    const htmlminOpts = Object.assign({}, mopts.htmlmin, options.htmlmin);
    const prettierOpts = Object.assign({}, mopts.prettier, options.prettier);
    const dataFiles = is.String(twigOpts.data) || is.Array(twigOpts.data) ? arrayify(twigOpts.data) : undefined;

    if (dataFiles) rtb.pipe(requireSafe('gulp-data')(() => loadData(dataFiles)));
    rtb.pipe(requireSafe('gulp-twig')(twigOpts));
    if (opts.minify) rtb.pipe(requireSafe('gulp-htmlmin')(htmlminOpts));
    if (opts.prettify) rtb.pipe(requireSafe('gulp-prettier')(prettierOpts));
});
