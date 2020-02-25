/**
 *  GReloader - Browser reloader
 */
import { Options, Stream } from "./common";
import { msg } from "../utils/utils";
import { WatcherOptions } from "./watcher";

export interface ReloaderOptions {
    livereload?: Options;
    browserSync?: Options;
}

export class GReloader {
    livereload: any = undefined;
    browserSync: any = undefined;

    constructor(options?: ReloaderOptions & WatcherOptions) {
        if (options) this.init(options);
    }

    init(opts: ReloaderOptions & WatcherOptions) {
        if (!this.livereload && opts.livereload) {
            this.livereload = require('gulp-livereload');
            this.livereload(opts.livereload);
        }
        if (!this.browserSync && opts.browserSync) {
            let browserSync = require('browser-sync');
            this.browserSync = browserSync.has('gbm') ? browserSync.get('gbm') : browserSync.create('gbm');
            this.browserSync.init(opts.browserSync,
                () => msg('browserSync server started with options:', opts.browserSync)
            );
        }
    }

    reload(stream: Stream, mopts: Options = {}) {
        if (stream) {
            if (this.livereload) stream = stream.pipe(this.livereload(mopts.livereload));
            if (this.browserSync && stream) stream = stream.pipe(this.browserSync.stream(mopts.browserSync));
        }
        else {
            if (this.livereload) this.livereload(mopts.livereload);
            if (this.browserSync) this.browserSync.reload(mopts.browserSync);
        }
        return stream;
    }
}
