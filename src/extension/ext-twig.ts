import { RTB } from "../core/rtb";
import { Options } from "../core/common";
import { is, loadData } from "../utils/utils";

RTB.registerExtension('twig', (options: Options = {}) => (rtb: RTB) => {
    let twigOpts = rtb.moduleOptions.twig || {};
    let dataOpts = is.String(twigOpts.data) ? [twigOpts.data] : twigOpts.data;

    if (is.Array(dataOpts))
        rtb.pipe(require('gulp-data')(() => loadData(dataOpts)));

    rtb.pipe(require('gulp-twig')(twigOpts));

    if (rtb.buildOptions.minify)
        rtb.pipe(require('gulp-htmlmin')(rtb.moduleOptions.htmlmin));

    if (rtb.buildOptions.prettify)
        rtb.pipe(require('gulp-html-prettify')(rtb.moduleOptions.htmlPrettify));
});
