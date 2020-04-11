/**
 *  GWatcher - Gulp watch list manager
 */

import { msg, arrayify, is } from "../utils/utils";
import { gulp, GulpTaskFunction } from "./common";
import { GReloaders, ReloaderOptions } from "./reloader";
import { EventEmitter } from 'events';


export interface WatcherOptions extends ReloaderOptions {
    watch?: string | string[];      // pure watching: watched files to be reloaded on change w/o build actions
    browserSync?: ReloaderOptions;  // browserSync initializer options
    livereload?: ReloaderOptions;   // livereload initializer options
}

export interface WatchItem {
    watch: string | string[];
    task: GulpTaskFunction;
    displayName?: string;
    reloadOnChange?: boolean;
}


export class GWatcher extends EventEmitter {
    protected _watchMap: WatchItem[] = [];
    protected _options: WatcherOptions = {};
    protected _reloaders: GReloaders = new GReloaders();

    constructor(options: WatcherOptions={}) {
        super();
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
            // let name = is.String(wItem.task) ? wItem.task : "";
            msg(`Watching ${wItem.displayName}: [${wItem.watch}]`);
            let gulpWatcher = gulp.watch(wItem.watch, wItem.task);
            // watcher always trigger onChange event.
            // reloader should determin if reload actually because there coul be multiple reloaders in single watcher
            // if (this._options.reloadOnChange !== false)
            gulpWatcher.on('change', () => {
                this.emit('reload');
                if (wItem.reloadOnChange !== false) this._reloaders.onChange()
            });
        });
        if (activate) this.reloaders.activate();
        return this;
    }
}
