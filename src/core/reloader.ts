/**
 *  GReloader - Browser reloader
 */
import { Options, Stream } from "./common";
import { msg } from "../utils/utils";
import { requireSafe } from "../utils/npm";


export interface ReloaderOptions extends Options { }

export class GReloader {
    protected _module: any;
    protected _options: Options = {};

    constructor(options?: ReloaderOptions) { Object.assign(this._options, options); }

    activate() {}
    stream(opts: Options = {}) {}
    reload(path?: string | string[], opts: Options = {}) {
        if (!this._module) return;  // if not activated, return
        this._module.reload(...(path ? [path, opts] : [opts]));
    }
}

export class GLiveReload extends GReloader {
    constructor(options: ReloaderOptions) {
        super(options);
    }

    activate() {
        if (this._module) return;
        this._module = requireSafe('gulp-livereload')(this._options);
    }

    stream(opts: Options) {
        if (this._module) return this._module(opts);
    }
}

export class GBrowserSync extends GReloader {
    constructor(moduleOptions: Options) {
        super(moduleOptions);
    }

    activate() {
        if (this._module) return;
        this._module = requireSafe('browser-sync');
        this._module = this._module.create(this._options.instanceName );
        this._module.init(this._options, () => msg('browserSync server started with options:', this._options));
    }

    stream(opts: Options) {
        if (this._module) return this._module.stream(opts);
    }
}
