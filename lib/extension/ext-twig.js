"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rtb_1 = require("../core/rtb");
const utils_1 = require("../utils/utils");
const npm_1 = require("../utils/npm");
rtb_1.RTB.registerExtension('twig', (options = {}) => (rtb) => {
    let twigOpts = Object.assign({}, rtb.moduleOptions.twig, options.twig);
    let dataOpts = utils_1.is.String(twigOpts.data) ? [twigOpts.data] : twigOpts.data;
    if (utils_1.is.Array(dataOpts))
        rtb.pipe(npm_1.requireSafe('gulp-data')(() => utils_1.loadData(dataOpts)));
    rtb.pipe(npm_1.requireSafe('gulp-twig')(twigOpts));
    if (rtb.buildOptions.minify)
        rtb.pipe(npm_1.requireSafe('gulp-htmlmin')(rtb.moduleOptions.htmlmin));
    if (rtb.buildOptions.prettify)
        rtb.pipe(npm_1.requireSafe('gulp-prettier')(rtb.moduleOptions.prettier));
});
