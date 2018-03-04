/**
 *  GCleaner - Gulp task clean list manager
 */

import * as gulp from 'gulp';
import * as del from 'del';
import { is } from './utils';

type CleanTarget = string | string[];

export class GCleaner {
  cleanList:string[] = [];

  constructor(public options: del.Options={}) {}

  add(cleanTarget:CleanTarget) {
    if (is.String(cleanTarget))
      this.cleanList.push(cleanTarget as string);
    else if (cleanTarget.length > 0)
      this.cleanList = this.cleanList.concat(cleanTarget);
  }

  clean(callback?:(value:string[])=>void) {
    console.log('GCleaner::cleanList:', this.cleanList);
    del(this.cleanList, this.options).then(callback);
  }

  reset() { this.cleanList = []; }

  createTask(opts: del.Options, taskName = '@clean') {
    if (this.cleanList.length <= 0) return;
    this,this.options = opts;
    gulp.task(taskName, (done) => this.clean(()=>done()));
  }
}