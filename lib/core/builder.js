"use strict";
/**
 *  Builder Base Class
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GTranspiler = exports.GBuilder = exports.parallel = exports.series = void 0;
const utils_1 = require("../utils/utils");
const rtb_1 = require("./rtb");
function series(...args) { return args; }
exports.series = series;
function parallel(...args) { return { set: args }; }
exports.parallel = parallel;
//--- GBuilder
class GBuilder extends rtb_1.RTB {
    constructor() {
        super();
    }
    build() {
        if (this.conf.src && this.conf.dest)
            this.copy({ src: this.conf.src, dest: this.conf.dest });
    }
    static isBuildItem(item) {
        return item.hasOwnProperty('name') && utils_1.is.String(item.name)
            || item.hasOwnProperty('buildName') && utils_1.is.String(item.buildName);
    }
}
exports.GBuilder = GBuilder;
//--- GTrasnpiler
class GTranspiler extends GBuilder {
    constructor() { super(); }
    onTranspile() { return this; }
    onMinify() { return this; }
    build() {
        const opts = this.buildOptions;
        this.src().onTranspile();
        // sanity check for options
        if (!this.conf.outFile && opts.outFileOnly)
            utils_1.warn('GTranspiler: outFileOnly option requires valid outFile value.');
        // evaluate options
        const concat = !!this.conf.outFile;
        const concatOnly = concat && opts.outFileOnly !== false;
        // concat stream
        if (concat) {
            this.pushStream().concat();
            if (!opts.minifyOnly)
                this.dest(); // concat non-minified
            if (opts.minify || opts.minifyOnly)
                this.onMinify().dest(); // concat minified
            this.popStream();
        }
        // non-concat
        if (!concat || !concatOnly) {
            if (!opts.minifyOnly)
                this.dest(); // concat non-minified
            if (opts.minify || opts.minifyOnly)
                this.onMinify().dest(); // concat minified
        }
    }
}
exports.GTranspiler = GTranspiler;
