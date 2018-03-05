/**
 *  GWatcher - Gulp watch list manager
 */

import * as gulp from 'gulp';
import {WatchItem, WatchOptions} from "./types";

export class GWatcher {
  watchMap: WatchItem[] = [];

  constructor() {
    this.watchMap = [];
  }

  addWatch(watchItem: WatchItem) {
    if (!watchItem.watched || watchItem.watched.length<=0) return;
    this.watchMap.push(watchItem);
  }

  watch(watchOptions: WatchOptions) {
    if (watchOptions && watchOptions.livereload)
      require('gulp-livereload')(watchOptions.livereload);

    for (let item of this.watchMap) {
      console.log(`Watching ${item.name}: [${item.watched}]`);
      gulp.watch(item.watched, gulp.parallel(item.task));
    }
  }

  createTask(watchOptions: WatchOptions, taskName='@watch') {
    if (this.watchMap.length <=0) return;
    gulp.task(taskName, (done)=>{this.watch(watchOptions); done()});
  }
}