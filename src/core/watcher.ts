/**
 *  GWatcher - Gulp watch list manager
 */

import { GReloader } from "./reloader";
import { msg } from "../utils/utils";
import { Options } from '@nodelib/fs.walk';
import * as Undertaker from "undertaker";
import { gulp } from "./common";


export interface WatcherOptions {
    livereload?: Options;
    browserSync?: Options; // browserSync.Options is not used to remove unnecessary dependency when browserSync is not used
}

export interface WatchItem {
    name: string;
    task: Undertaker.Task;
    watched: string[];
    watchedPlus?: string[];
}


export class GWatcher {
    watchMap: WatchItem[] = [];
    reloader = new GReloader();

    addWatch(watchItem: WatchItem) {
        if (!watchItem.watched || watchItem.watched.length <= 0) return;
        this.watchMap.push(watchItem);
    }

    watch(opts: WatcherOptions = {}) {
        for (let item of this.watchMap) {
            msg(`Watching ${item.name}: [${item.watched}]`);
            gulp.watch(item.watched, gulp.parallel(item.task));

            // reload will be called from rtb. So, no monitoring required here.
            // let watcher = gulp.watch(item.watched, gulp.parallel(item.task));
            // if (this.reloader.livereload) watcher.on('change', this.reloader.livereload.reload);
            // if (this.reloader.browserSync) watcher.on('change', this.reloader.browserSync.reload);
        }
        this.reloader.init(opts);
    }

    createTask(opts: WatcherOptions = {}, taskName = '@watch') {
        if (this.watchMap.length <= 0) return;
        gulp.task(taskName, (done) => { this.watch(opts); done() });
    }
}
