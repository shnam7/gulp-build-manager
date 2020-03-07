/**
 *  GReloader - Browser reloader
 */
import { Options, Stream } from "./common";
import { msg } from "../utils/utils";
import { WatcherOptions } from "./watcher";

export interface ReloaderOptions {
    livereload?: Options;
    browserSync?: Options; // browserSync.Options is not used to remove unnecessary dependency when browserSync is not used
}


export class GReloader {
    protected _module: any;
    protected _moduleOption: Options = {};

    constructor(moduleOption?: ReloaderOptions) {
        Object.assign(this._moduleOption, moduleOption);
    }

    init() {}
    reload(stream?: Stream, mopts: Options = {}) { return stream; }
}

export class GLiveReload extends GReloader {
    constructor(options: ReloaderOptions) {
        super(options);
    }

    init() {
        if (this._module) return;

        this._module = require('gulp-livereload')(this._moduleOption);
    }

    reload(stream?: Stream, opts: Options = {}) {
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

    init() {
        if (this._module) return;

        this._module = require('browser-sync');
        this._module = this._module.has('gbm') ? this._module.get('gbm') : this._module.create('gbm');
        this._module.init(this._moduleOption, () => msg('browserSync server started with options:', this._moduleOption));
    }

    reload(stream?: Stream, opts: Options = {}) {
        if (stream)
            stream = stream.pipe(this._module.stream(opts));
        else
            this._module.reload(opts);
        return stream;
    }
}


export class GReloadManager {
    protected _reloaders: GReloader[] = [];

    addReloader(reloader: GReloader) {
        this._reloaders.push(reloader);
        return this;
    }

    init(opts?: ReloaderOptions & WatcherOptions) {
        // create reloaders
        if (opts?.browserSync) this.addReloader(new GBrowserSync(opts.browserSync));
        if (opts?.livereload) this.addReloader(new GBrowserSync(opts.livereload));

        this._reloaders.forEach(reloader => reloader.init());
    }

    reload(stream?: Stream, opts?: Options) {
        this._reloaders.forEach(reloader => reloader.reload(stream, opts));
    }
}
