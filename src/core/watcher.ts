/**
 *  GWatcher - Gulp watch list manager
 */

import { msg, arrayify, is } from "../utils/utils";
import { gulp, GulpTaskFunction } from "./common";
import { BuildName } from "./builder";
import { GReloaders, ReloaderOptions } from "./reloader";


export interface WatcherOptions {
    watch?: string | string[];      // pure watching: watched files to be reloaded on change w/o build actions
    reloadOnChange?: boolean;
    browserSync?: ReloaderOptions;  // browserSync.Options is not used to remove unnecessary dependency when browserSync is not used
    livereload?: ReloaderOptions;
}

export interface WatchItem {
    watch: string | string[];
    task: BuildName | GulpTaskFunction;
}


export class GWatcher {
    protected _watchMap: WatchItem[] = [];
    protected _options: WatcherOptions = {};
    protected _reloaders: GReloaders = new GReloaders();

    constructor(options: WatcherOptions={}) {
        Object.assign(this._options, options);
    }

    get watchMap() { return this._watchMap; }
    get reloaders () { return this._reloaders; }

    addWatch(watchItem: WatchItem | WatchItem[]) {
        arrayify(watchItem).forEach(wItem => {
            if (wItem.watch) this._watchMap.push(wItem);
        })
        return this;
    }

    watch(activate = true) {
        this._watchMap.forEach(wItem => {
            let name = is.String(wItem.task) ? wItem.task : "";
            msg(`Watching ${name}: [${wItem.watch}]`);
            let gulpWatcher = gulp.watch(wItem.watch, gulp.parallel(wItem.task));
            if (this._options.reloadOnChange !== false)
                gulpWatcher.on('change', () => this._reloaders.onChange());
        });
        if (activate) this.reloaders.activate();
        return this;
    }

    reloadOnChange(val: boolean = true) {
        this._options.reloadOnChange = val !== false;
    }
}
