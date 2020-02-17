/**
 *  GReloader - Browser reloader
 */
import { Options, Stream } from "./common";
import { msg } from "../utils/utils";

export class GReloader {
    livereload: any = undefined;
    browserSync: any = undefined;

    constructor(options?: Options) {
        if (options) this.init(options);
    }

    init(opts: Options) {
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

    reload(stream: Stream, mopts: Options = {}, watch?: Options) {
        let livereload = !(watch && watch.livereload === false);
        let browserSync = !(watch && watch.browserSync === false);
        if (stream) {
            if (livereload && this.livereload) stream = stream.pipe(this.livereload(mopts.livereload));
            if (browserSync && this.browserSync) {
                if (stream) stream = stream.pipe(this.browserSync.stream(mopts.browserSync));
            }
        }
        else {
            if (livereload && this.livereload) this.livereload(mopts.livereload);
            if (browserSync && this.browserSync) this.browserSync.reload(mopts.browserSync);
        }
        return stream;
    }
}
