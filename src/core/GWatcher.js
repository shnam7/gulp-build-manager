/**
 *  GWatcher - Gulp watch list manager
 */

'use strict';
import gulp from 'gulp';

export default class GWatcher {
  constructor() {
    this._watchMap = [];
  }

  addWatch(watch) {
    if (!watch.watched || watch.watched.length<=0) return;
    this._watchMap.push(watch);
  }

  watch(watchOptions) {
    if (watchOptions && watchOptions.livereload)
      require('gulp-livereload')(watchOptions.livereload);

    for (let item of this._watchMap) {
      console.log(`Watching ${item.name}: [${item.watched}]`);
      gulp.watch(item.watched, gulp.parallel(item.task));
    }
  }

  createTask(watchOptions, taskName='@watch') {
    if (this._watchMap.length <=0) return;
    gulp.task(taskName, (done)=>{this.watch(watchOptions); done()});
  }
}

module.exports = GWatcher;