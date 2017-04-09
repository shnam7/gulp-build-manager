'use strict';
import gulp from 'gulp';
import merge from 'lodash.merge';
import livereload from 'gulp-livereload';

class GWatcher {
  constructor(watchOptions) {
    this._watchOptions = merge({enabled: false, livereload: false}, watchOptions);
    this._watchMap = [];
  }

  setOptions(watchOptions) { merge(this._watchOptions, watchOptions); }

  addWatch(watch) {
    if (!watch.watched || watch.watched.length<=0) return;
    this._watchMap.push(watch);
  }

  watch() {
    for (let item of this._watchMap) {
      console.log(`Watching ${item.name}: ${item.watched}...`);
      gulp.watch(item.watched, gulp.parallel(item.task));
      if (item.livereload) livereload();
    }
  }
}

export default GWatcher;
module.exports = GWatcher;
