/**
 *  gbm Plugin - JavaScript
 */

import GPlugin from '../core/GPlugin';
import merge from 'lodash.merge';
import pick from 'lodash.pick';

export default class JavaScriptPlugin extends GPlugin {
  constructor(options={}, slots='build') { super(options, slots); }

  process(stream, mopts, conf, slot, builder) {
    let opts = merge(pick(conf.buildOptions, ['lint', 'rename']), this.options);

    // check lint option
    if (opts.lint) {
      const esLint = require('gulp-eslint');
      let lintExtra = mopts.eslintExtra || {};
      stream = stream.pipe(esLint(mopts.eslint))
        .pipe(esLint.format(lintExtra.format))
        .pipe(esLint.failAfterError());
    }

    stream = stream.pipe(require('gulp-babel')(mopts.babel));
    return stream;
  }
}
module.exports = JavaScriptPlugin;
