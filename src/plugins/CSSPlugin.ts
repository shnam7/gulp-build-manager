/**
 *  gbm Plugin - CSS
 */
import {Options, Slot, Stream} from "../core/types";
import {GBuilder} from "../core/builder";
import {GPlugin} from "../core/plugin";

export class CSSPlugin extends GPlugin {
  constructor(options:Options={}, slots: Slot|Slot[]='build') { super(options, slots); }

  process(stream:Stream, mopts:Options, conf:Options, slot:Slot, builder:GBuilder) {
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
      if(stream) stream = stream.pipe(pcss([
        stylelint(lintOpts),
        reporter(lintExtra.reporter)
      ], {syntax:syntax}));
    }

    // check CSS processor option
    if (sourceType && sourceType !== 'css') {
      const index = sourceType==='scss' ? 'sass' : sourceType;
      const processor = require('gulp-' + index);
      if(stream) stream = stream.pipe(processor(this.options[index] || mopts[index]));
    }

    // check postcss option
    if (postcss) {
      const pcssOpts = this.options.postcss || mopts.postcss || {};
      if (stream) stream = stream.pipe(pcss(pcssOpts.plugins || [], pcssOpts.options));
    }
    else if (autoPrefixer) {
      if (stream) stream = stream.pipe(require('gulp-autoprefixer')(this.options.autoprefixer || opts.autoPrefixer));
    }
    return stream;
  }
}

export default CSSPlugin;