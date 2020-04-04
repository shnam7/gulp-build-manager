import { RTB } from "../core/rtb";
import { Options } from "../core/common";
import { is, loadData } from "../utils/utils";
import { requireSafe } from "../utils/npm";

RTB.registerExtension('twig', (options: Options = {}) => (rtb: RTB) => {
    let twigOpts = rtb.moduleOptions.twig || {};
    let dataOpts = is.String(twigOpts.data) ? [twigOpts.data] : twigOpts.data;

    if (is.Array(dataOpts))
        rtb.pipe(requireSafe('gulp-data')(() => loadData(dataOpts)));

    rtb.pipe(requireSafe('gulp-twig')(twigOpts));

    if (rtb.buildOptions.minify)
        rtb.pipe(requireSafe('gulp-htmlmin')(rtb.moduleOptions.htmlmin));

    if (rtb.buildOptions.prettify)
        rtb.pipe(requireSafe('gulp-html-beautify')(rtb.moduleOptions.htmlBeautify));
});
