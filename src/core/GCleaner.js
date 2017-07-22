/**
 *  GCleaner - Gulp task clean list manager
 */

'use strict';
import gulp from 'gulp';
import del from 'del';
import is from '../utils/is';

export default class GCleaner {
  constructor() {
    this._cleanList = [];
  }

  add(cleanTarget) {
    if (is.String(cleanTarget)) cleanTarget = [cleanTarget];
    if (cleanTarget.length > 0) this._cleanList = this._cleanList.concat(cleanTarget);
  }

  clean(opts, callback) {
    console.log('GCleaner::cleanList:', this._cleanList);
    del(this._cleanList, opts).then(callback);
  }

  createTask(opts, taskName='@clean') {
    if (this._cleanList.length <= 0) return;
    gulp.task(taskName, (done)=>{
      this.clean(opts, ()=>done());
    });
  }
}

module.exports = GCleaner;
