/**
 *  gbm Plugin - CSS
 */

import GPlugin from '../core/GPlugin';

export default class CSSPlugin extends GPlugin {
  constructor(options={}, slots='build') { super(options, slots); }

  process(stream, mopts, conf, slot) {
    const opts = conf.buildOptions || {};
    const lint = this.options.lint || opts.lint;
    const postcss = this.options.postcss || opts.postcss;
    const sourceType = this.options.sourceType || opts.sourceType || 'scss';
    const autoPrefixer = this.options.autoPrefixer || opts.autoPrefixer || opts.autoPrefixer===undefined;
    // const rename = this.options.autoPrefixer || opts.autoPrefixer || opts.autoPrefixer===undefined;

    if (lint && !postcss)
      console.log('CSSPlugin:Notice: postcss will be enabled to run stylelint.');
    const pcss = (lint || postcss) ? require('gulp-postcss') : undefined;

    // check lint option
    if (lint) {
      const reporter = require('postcss-reporter');
      const stylelint = require('stylelint');
      const syntax = (sourceType && sourceType!=='css') ? require('postcss-'+sourceType) : undefined;
      const lintOpts = this.options.stylelint || mopts.stylelint || {rules:{}};
      const lintExtra = this.options.stylelintExtra || mopts.stylelintExtra || {reporter:{clearMessages:true, throwError:true}};
      stream = stream.pipe(pcss([
        stylelint(lintOpts),
        reporter(lintExtra.reporter)
      ], {syntax:syntax}));
    }

    // check CSS processor option
    if (sourceType && sourceType !== 'css') {
      const processor = require('gulp-' + (sourceType==='scss' ? 'sass' : sourceType));
      stream = stream.pipe(processor(this.options[sourceType] || mopts[sourceType]));
    }

    // check postcss option
    if (postcss) {
      const pcssOpts = this.options.postcss || mopts.postcss || {};
      stream = stream.pipe(pcss(pcssOpts.plugins || [], pcssOpts.options));
    }
    else if (autoPrefixer) {
      stream = stream.pipe(require('gulp-autoprefixer')(this.options.autoprefixer || opts.autoPrefixer));
    }

    // check rename option
    // if (opts.rename) stream = stream.pipe(require('gulp-rename')(this.options.rename || opts.rename));

    return stream;
  }
}
module.exports = CSSPlugin;
