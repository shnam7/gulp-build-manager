/**
 *  gbm Plugin - Copy
 */

import * as gulp from 'gulp';
import {GPlugin} from "../core/plugin";
import {BuildConfig, GulpStream, Options, Slot} from "../core/types";
import {GBuilder} from "../core/builder";
import {toPromise} from "../utils/utils";

export interface CopyTarget {
  src: string[];
  dest: string
}

export class CopyPlugin extends GPlugin {
  constructor(public targets:CopyTarget[], options:Options={}, slots: Slot|Slot[]='build') { super(options, slots); }

  OnStream(stream:GulpStream, mopts:Options, conf:BuildConfig, slot:Slot, builder:GBuilder) {
    for (let copyItem of this.targets) {
      console.log(`[CopyPlugin] copying: [${copyItem.src}] => ${copyItem.dest}`);
      let copyStream = gulp.src(copyItem.src).pipe(gulp.dest(copyItem.dest))
      if (conf.flushStream) builder.promises.push(toPromise(copyStream));
    }
    return stream;
  }
}

export default CopyPlugin;