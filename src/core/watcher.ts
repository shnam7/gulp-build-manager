/**
 *  GWatcher - Gulp watch list manager
 */

import * as gulp from 'gulp';
import {WatchItem, WatchOptions} from './types';
import {GReloader} from "./reloader";
import {msg} from "../utils/utils";

export class GWatcher {
  watchMap: WatchItem[] = [];
  reloader: GReloader = new GReloader();

  constructor() {
    this.watchMap = [];
  }

  addWatch(watchItem: WatchItem) {
    if (!watchItem.watched || watchItem.watched.length<=0) return;
    this.watchMap.push(watchItem);
  }

  watch(watchOptions: WatchOptions={}) {
    this.reloader.init(watchOptions);
    for (let item of this.watchMap) {
      msg(`Watching ${item.name}: [${item.watched}]`);
      let watcher = gulp.watch(item.watched, gulp.parallel(item.task));
      if (this.reloader.browserSync) watcher.on('change', this.reloader.browserSync.reload);
    }
  }

  createTask(watchOptions: WatchOptions={}, taskName='@watch') {
    if (this.watchMap.length <=0) return;
    gulp.task(taskName, (done)=>{this.watch(watchOptions); done()});
  }
}
