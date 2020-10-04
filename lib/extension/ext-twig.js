"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const rtb_1 = require("../core/rtb");
const utils_1 = require("../utils/utils");
const npm_1 = require("../utils/npm");
rtb_1.RTB.registerExtension('twig', (options = {}) => (rtb) => {
    const { buildOptions: opts, moduleOptions: mopts } = rtb.conf;
    const twigOpts = Object.assign({}, mopts.twig, options.twig);
    const htmlminOpts = Object.assign({}, mopts.htmlmin, options.htmlmin);
    const prettierOpts = Object.assign({}, mopts.prettier, options.prettier);
    const dataFiles = utils_1.is.String(twigOpts.data) || utils_1.is.Array(twigOpts.data) ? utils_1.arrayify(twigOpts.data) : undefined;
    if (dataFiles)
        rtb.pipe(npm_1.requireSafe('gulp-data')(() => utils_1.loadData(dataFiles)));
    rtb.pipe(npm_1.requireSafe('gulp-twig')(twigOpts));
    if (opts.minify)
        rtb.pipe(npm_1.requireSafe('gulp-htmlmin')(htmlminOpts));
    if (opts.prettify)
        rtb.pipe(npm_1.requireSafe('gulp-prettier')(prettierOpts));
});
