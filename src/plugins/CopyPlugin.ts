/**
 *  gbm Plugin - Copy
 */

import * as gulp from 'gulp';
import {GPlugin} from "../core/plugin";
import {Options, Slot, Stream} from "../core/types";
import {GBuilder} from "../core/builder";
import ChangedPlugin from "./ChangedPlugin";

export interface CopyTarget {
  src: string[];
  dest: string
}

export class CopyPlugin extends GPlugin {
  constructor(public targets:CopyTarget[], options:Options={}, slots: Slot|Slot[]='build') { super(options, slots); }

  process(stream:Stream, mopts:Options, conf:Options, slot:Slot, builder:GBuilder) {
    for (let copyItem of this.targets) {
      console.log(`[CopyPlugin] copying: [${copyItem.src}] => ${copyItem.dest}`);
      let copyStream = gulp.src(copyItem.src);
      if (conf.flushStream) {
        builder.promises.push(new Promise((resolve, reject)=>{
          copyStream.pipe(gulp.dest(copyItem.dest))
            .on('finish', resolve)
            .on('error', reject);
        }));
      }
      else
        copyStream.pipe(gulp.dest(copyItem.dest))
    }
    return stream;
  }
}

export default CopyPlugin;