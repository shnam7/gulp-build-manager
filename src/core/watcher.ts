/**
 *  GWatcher - Gulp watch list manager
 */

import { msg, arrayify, is } from "../utils/utils";
import { Options } from '@nodelib/fs.walk';
import { gulp, GulpTaskFunction } from "./common";
import { BuildName } from "./builder";


export interface WatcherOptions {
    watch?: string | string[];    // pure watching: watched files to be reloaded on change w/o build actions
    livereload?: Options;
    browserSync?: Options; // browserSync.Options is not used to remove unnecessary dependency when browserSync is not used
}

export interface WatchItem {
    watch: string | string[];
    task: BuildName | GulpTaskFunction;
}


export class GWatcher {
    protected _watchMap: WatchItem[] = [];
    protected _options: WatcherOptions = {};

    constructor(options: WatcherOptions={}) {
        Object.assign(this._options, options);
    }

    get watchMap() { return this._watchMap; }

    addWatch(watchItem: WatchItem | WatchItem[]) {
        arrayify(watchItem).forEach(wItem => {
            if (wItem.watch) this._watchMap.push(wItem);
        })
        return this;
    }

    watch(opts: WatcherOptions = {}) {
        // opts = Object.assign({}, this._options, opts);
        this._watchMap.forEach(wItem => {
            let name = is.String(wItem.task) ? wItem.task : "";
            msg(`Watching ${name}: [${wItem.watch}]`);
            gulp.watch(wItem.watch, gulp.parallel(wItem.task));
        });
    }

    reset(watchMap?: WatchItem[]) {
        this._watchMap = watchMap || [];
    }
}
