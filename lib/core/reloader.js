"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GBrowserSync = exports.GLiveReload = exports.GReloader = void 0;
/**
 *  GReloader - Browser reloader
 */
const utils_1 = require("../utils/utils");
const npm_1 = require("../utils/npm");
class GReloader {
    constructor(options) {
        this._options = {};
        Object.assign(this._options, options);
    }
    activate() { }
    stream(opts = {}) { }
    reload(path, opts = {}) {
        if (!this._module)
            return; // if not activated, return
        this._module.reload(...(path ? [path, opts] : [opts]));
    }
}
exports.GReloader = GReloader;
class GLiveReload extends GReloader {
    constructor(options) {
        super(options);
    }
    activate() {
        if (this._module)
            return;
        this._module = npm_1.requireSafe('gulp-livereload')(this._options);
    }
    stream(opts) {
        if (this._module)
            return this._module(opts);
    }
}
exports.GLiveReload = GLiveReload;
class GBrowserSync extends GReloader {
    constructor(moduleOptions) {
        super(moduleOptions);
    }
    activate() {
        if (this._module)
            return;
        this._module = npm_1.requireSafe('browser-sync');
        this._module = this._module.create(this._options.instanceName);
        this._module.init(this._options, () => utils_1.msg('browserSync server started with options:', this._options));
    }
    stream(opts) {
        if (this._module)
            return this._module.stream(opts);
    }
}
exports.GBrowserSync = GBrowserSync;
