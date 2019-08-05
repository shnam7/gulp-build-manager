/**
 *  GWatcher - Gulp watch list manager
 */

import * as gulp from 'gulp';
import { GReloader } from "./reloader";
import { msg } from "../utils/utils";
import { Options } from '@nodelib/fs.walk';
import * as Undertaker from "undertaker";


export interface WatchOptions {
    livereload?: Options;
    browserSync?: Options; // browserSync.Options is not used to remove unnecessary dependency when browserSync is not used
}

export interface WatchItem {
    name: string;
    task: Undertaker.Task;
    watched: string[];
    watchedPlus?: string[];
    livereload?: boolean;
    browserSync?: boolean;
}


export class GWatcher {
    watchMap: WatchItem[] = [];
    reloader: GReloader = new GReloader();

    constructor() {
        this.watchMap = [];
    }

    addWatch(watchItem: WatchItem) {
        if (!watchItem.watched || watchItem.watched.length <= 0) return;
        this.watchMap.push(watchItem);
    }

    watch(watchOptions: WatchOptions = {}) {
        this.reloader.init(watchOptions);
        for (let item of this.watchMap) {
            msg(`Watching ${item.name}: [${item.watched}]`);
            let watcher = gulp.watch(item.watched, gulp.parallel(item.task));
            if (this.reloader.browserSync) watcher.on('change', this.reloader.browserSync.reload);
        }
    }

    createTask(watchOptions: WatchOptions = {}, taskName = '@watch') {
        if (this.watchMap.length <= 0) return;
        gulp.task(taskName, (done) => { this.watch(watchOptions); done() });
    }
}
