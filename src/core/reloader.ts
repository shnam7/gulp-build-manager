/**
 *  GReloader - Browser reloader
 */
import { Options, Stream } from "./common";
import { msg, arrayify } from "../utils/utils";
import { requireSafe } from "../utils/npm";


export interface ReloaderOptions extends Options {
    reloadOnChange?: boolean;       // default is true
}

export class GReloader {
    protected _module: any;
    protected _options: Options = {};

    constructor(options?: ReloaderOptions) {
        Object.assign(this._options, options);
    }

    activate() {}
    reload(stream?: Stream, mopts: Options = {}) { return stream; }
    onChange() {
        if (this._module && this._options.reloadOnChange !== false)
            this._module.reload();
    }

    reloadOnChange(val: boolean = true) {
        this._options.reloadOnChange = val !== false;
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

    reload(stream?: Stream, opts: Options = {}) {
        if (!this._module) return;  // if not activated, return

        if (stream)
            stream = stream.pipe(this._module(opts));
        else
            this._module.reload(opts);
        return stream;
    }
}

export class GBrowserSync extends GReloader {
    constructor(moduleOptions: Options) {
        super(moduleOptions);
    }

    activate() {
        if (this._module) return;
        this._module = requireSafe('browser-sync');
        // this._module = this._module.has('gbm') ? this._module.get('gbm') : this._module.create('gbm');
        this._module = this._module.create(this._options.instanceName );
        this._module.init(this._options, () => msg('browserSync server started with options:', this._options));
    }

    reload(stream?: Stream, opts: Options = {}) {
        if (!this._module) return;  // if not activated, return

        if (stream)
            stream = stream.pipe(this._module.stream(opts));
        else
            this._module.reload(opts);
        return stream;
    }
}


// Reloader Manager
export class GReloaders {
    protected _reloaders: GReloader[] = [];

    createReloaders(opts: ReloaderOptions={}) {
        if (opts.livereload) this._reloaders.push(new GLiveReload(opts.livereload));
        if (opts.browserSync) this._reloaders.push(new GBrowserSync(opts.browserSync));
        return this;
    }

    addReloaders(reloaders: GReloader | GReloader[] | GReloaders) {
        if (reloaders instanceof GReloaders) reloaders = reloaders._reloaders;
        this._reloaders = this._reloaders.concat(arrayify(reloaders));
        return this;
    }

    activate() {
        this._reloaders.forEach(reloader => reloader.activate());
    }

    reload(stream?: Stream, opts?: Options) {
        this._reloaders.forEach(reloader => reloader.reload(stream, opts) );
    }

    onChange() {
        this._reloaders.forEach(reloader => reloader.onChange());
    }

    reloadOnChange(val: boolean = true) {
        this._reloaders.forEach(reloader => reloader.reloadOnChange(val));
    }
}
