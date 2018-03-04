/**
 *  gbm Plugin - JavaScript
 */

import {Options, Slot, Stream} from "../core/types";
import {GBuilder} from "../core/builder";
import {GPlugin} from "../core/plugin";
import {deepmerge, pick} from "../core/utils";
import ChangedPlugin from "./ChangedPlugin";

export class JavaScriptPlugin extends GPlugin {
  constructor(options:Options={}, slots: Slot|Slot[]='build') { super(options, slots); }

  process(stream:Stream, mopts:Options, conf:Options, slot:Slot, builder:GBuilder) {
    let opts = deepmerge(pick(conf.buildOptions, 'lint', 'rename'), this.options);

    // check lint option
    if (opts.lint) {
      const esLint = require('gulp-eslint');
      let lintExtra = mopts.eslintExtra || {};
      stream = stream && stream.pipe(esLint(mopts.eslint))
        .pipe(esLint.format(lintExtra.format))
        .pipe(esLint.failAfterError());
    }
    return stream && stream.pipe(require('gulp-babel')(mopts.babel));
  }
}

export default JavaScriptPlugin;