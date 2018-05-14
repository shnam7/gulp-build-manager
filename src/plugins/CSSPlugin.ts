/**
 *  gbm Plugin - CSS
 */

import {Options} from "../core/types";
import {GBuilder} from "../core/builder";
import {GPlugin} from "../core/plugin";

export class CSSPlugin extends GPlugin {
  constructor(options:Options={}) { super(options); }

  process(builder: GBuilder) {
    const lint = builder.buildOptions.lint;
    const postcss = builder.buildOptions.postcss;
    const sourceType = builder.buildOptions.sourceType || 'scss';
    const autoPrefixer = builder.buildOptions.autoPrefixer !== false;

    if (lint && !postcss)
      console.log('CSSPlugin:Notice: postcss will be enabled to run stylelint.');
    const pcss = (lint || postcss) ? require('gulp-postcss') : undefined;

    // check lint option
    if (lint) {
      const reporter = require('postcss-reporter');
      const stylelint = require('stylelint');
      const syntax = (sourceType && sourceType!=='css') ? require('postcss-'+sourceType) : undefined;
      const lintOpts = Object.assign({}, builder.moduleOptions.stylelint, {rules:{}});
      const reporterOpts = Object.assign({}, lintOpts.reporter,
        {reporter:{clearMessages:true, throwError:true}});
      builder.pipe(pcss([
        stylelint(lintOpts.stylelint || lintOpts),
        reporter(reporterOpts)
      ], {syntax:syntax}));
    }

    // check CSS processor option
    if (sourceType && sourceType !== 'css') {
      const moduleName = sourceType==='scss' ? 'sass' : sourceType;
      const processor = require('gulp-' + moduleName);
      builder.pipe(processor(this.options[moduleName] || builder.moduleOptions[moduleName]));
    }

    // check postcss option
    if (postcss) {
      const pcssOpts = this.options.postcss || builder.moduleOptions.postcss || {};
      builder.pipe(pcss(pcssOpts.plugins || [], pcssOpts.options));
    }
    else if (autoPrefixer) {
      builder.pipe(require('gulp-autoprefixer')(builder.moduleOptions.autoPrefixer));
    }
    builder.sourceMaps();
  }
}

export default CSSPlugin;
