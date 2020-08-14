"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rtb_1 = require("../core/rtb");
const npm_1 = require("../utils/npm");
rtb_1.RTB.registerExtension('markdown', (options = {}) => (rtb) => {
    rtb.pipe(npm_1.requireSafe('gulp-markdown')(rtb.moduleOptions.markdown));
    if (rtb.buildOptions.minify)
        rtb.pipe(npm_1.requireSafe('gulp-htmlclean')(rtb.moduleOptions.htmlmin));
    if (rtb.buildOptions.prettify)
        rtb.pipe(npm_1.requireSafe('gulp-prettier')(rtb.moduleOptions.prettier));
});
