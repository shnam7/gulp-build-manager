'use strict';
import gulp from 'gulp';
import merge from 'lodash.merge';
import livereload from 'gulp-livereload';

class GWatcher {
  constructor() {
    this._watchMap = [];
  }

  addWatch(watch) {
    if (!watch.watched || watch.watched.length<=0) return;
    this._watchMap.push(watch);
  }

  watch(watchOptions) {
    if (watchOptions.livereload) livereload(watchOptions.livereload);
    for (let item of this._watchMap) {
      console.log(`Watching ${item.name}: ${item.watched}...`);
      gulp.watch(item.watched, gulp.parallel(item.task));
    }
  }
}

export default GWatcher;
module.exports = GWatcher;
