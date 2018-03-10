/**
 *  gbm Plugin - JavaScript
 */

import {BuildConfig, GulpStream, Options, Slot} from "../core/types";
import {GBuilder} from "../core/builder";
import {GPlugin} from "../core/plugin";
import {pick} from "../core/utils";

export class JavaScriptPlugin extends GPlugin {
  constructor(options:Options={}, slots: Slot|Slot[]='build') { super(options, slots); }

  OnStream(stream:GulpStream, mopts:Options, conf:BuildConfig, slot:Slot, builder:GBuilder) {
    let opts = Object.assign({}, pick(conf.buildOptions || {}, 'lint', 'rename'), this.options);

    // check lint option
    if (opts.lint) {
      const esLint = require('gulp-eslint');
      let lintExtra = mopts.eslintExtra || {};
      stream = stream.pipe(esLint(mopts.eslint))
        .pipe(esLint.format(lintExtra.format))
        .pipe(esLint.failAfterError());
    }
    return stream.pipe(require('gulp-babel')(mopts.babel));
  }
}

export default JavaScriptPlugin;