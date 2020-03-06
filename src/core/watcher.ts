/**
 *  GWatcher - Gulp watch list manager
 */

import { GReloader } from "./reloader";
import { msg, arrayify } from "../utils/utils";
import { Options } from '@nodelib/fs.walk';
import * as Undertaker from "undertaker";
import { gulp } from "./common";
import { BuildConfig } from "./builder";


export interface WatchItem {
    buildName: string;
    task: Undertaker.Task;
    watched: string[];
}

export interface WatcherOptions {
    buildKey?: string;
    watch?: string | string[];    // pure watching: watched files to be reloaded on change w/o build actions
    livereload?: Options;
    browserSync?: Options; // browserSync.Options is not used to remove unnecessary dependency when browserSync is not used
}

export class GWatcher {
    protected _buildName = '<<GWatcher:reloadr>>';
    protected options: WatcherOptions = { buildKey: 'watch' }
    watchMap: WatchItem[] = [];
    reloader = new GReloader();

    addWatch(watchItem: WatchItem) {
        if (!watchItem.watched || watchItem.watched.length <= 0) return;
        this.watchMap.push(watchItem);
    }

    watch(opts: WatcherOptions = {}) {
        for (let item of this.watchMap) {
            msg(`Watching ${item.buildName}: [${item.watched}]`);
            gulp.watch(item.watched, gulp.parallel(item.task));

            // reload will be called from rtb. So, no monitoring required here.
            // let watcher = gulp.watch(item.watched, gulp.parallel(item.task));
            // if (this.reloader.livereload) watcher.on('change', this.reloader.livereload.reload);
            // if (this.reloader.browserSync) watcher.on('change', this.reloader.browserSync.reload);
        }
        this.reloader.init(opts);
    }

    createTask(buildName = '@watch', opts: WatcherOptions = {}): BuildConfig {
        this.options = opts;
        Object.assign(this.options, opts);
        // create pure watching items
        if (this.options.watch) this.addWatch({
            buildName: buildName,
            task: done => { this.reloader.reload(); done() },
            watched: arrayify(opts.watch)
        })

        return {
            buildName: buildName,
            builder: () => this.watch(this.options)
        }

        // this._buildName = buildName;
        // gulp.task(buildName, (done) => { this.watch(opts); done() });
    }

    get buildName() { return this._buildName; }
    get buildKey() { return this.options.buildKey; }
}
