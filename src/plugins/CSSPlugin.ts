/**
 *  gbm Plugin - CSS
 */

import {Options} from "../core/types";
import {GBuilder} from "../core/builder";
import {GPlugin} from "../core/plugin";
import {warn} from "../utils/utils";

export class CSSPlugin extends GPlugin {
  constructor(options:Options={}) { super(options); }

  processPostcss(builder: GBuilder, opts: Options, mopts: Options) {
    const sourceType = opts.sourceType || 'scss';
    const pcss = require('gulp-postcss');
    const pcssOpts = this.options.postcss || mopts.postcss || {};
    const plugins = pcssOpts.plugins || [];
    const autoprefixer = opts.autoprefixer !== false;
    const moduleName = sourceType==='scss' ? 'sass' : sourceType;
    const parser = sourceType!=='css' ? require('postcss-'+ sourceType) : undefined;

    // first, transpile to standard css.
    // All the scss/less variables should to be evaluated before postcss process starts
    if (sourceType !== 'css') {
      const processor = require('gulp-' + moduleName);
      builder.pipe(processor(this.options[moduleName] || mopts[moduleName]));
    }

    // now, transpile postcss statements
    builder.pipe(pcss(plugins));

    // do some optimization to remove duplicate selectors, and beautify
    builder.pipe(pcss([require('postcss-clean')({
      format: 'beautify',
      level: {2: {mergeSemantically: true}}
    })]));

    // now run autoprefixer
    if (autoprefixer) {
      const prefixer = require('autoprefixer');
      builder
        .pipe(pcss([prefixer({add: false, browsers: []})])) // remove outdated prefixed
        .pipe(pcss([prefixer(mopts.autoprefixer)]));     // now add prefixes
    }

    // lint final css
    // lint does not understands postcss statements. so,it come after postcss processing
    if (opts.lint) {
      const stylelint = require('stylelint');
      const reporter = require('postcss-reporter');
      let lintOpts = mopts.stylelint || {};
      const reporterOpts = lintOpts.reporter || {};
      builder.pipe(pcss([stylelint(lintOpts.stylelint || lintOpts),reporter(reporterOpts)], {syntax: parser}));
    }
  }

  process(builder: GBuilder) {
    const opts = builder.buildOptions;
    const mopts = builder.moduleOptions;

    // backward compatibility on autoprefixer options
    if (opts.autoPrefixer === undefined && opts.autoPrefixer !== undefined) {
      opts.autoprefixer = opts.autoPrefixer;
      warn('[GBM:CSSPlugin] DeprecationWarning: buildOptions.autoPrefixer is deprecated. Use buildOptions.autoprefixer.');
    }
    if (mopts.autoPrefixer === undefined && opts.autoPrefixer !== undefined) {
      mopts.autoprefixer = mopts.autoPrefixer;
      warn('[GBM:CSSPlugin] DeprecationWarning: moduleOptions.autoPrefixer is deprecated. Use moduleOptions.autoprefixer.');
    }

    // basic build options
    const postcss = opts.postcss !== false;   // enable postcss by default
    if (postcss) {
      this.processPostcss(builder, opts, mopts);
    }
    else {
      const sourceType = opts.sourceType || 'scss';
      const autoprefixer = opts.autoprefixer !== false;
      const moduleName = sourceType==='scss' ? 'sass' : sourceType;

      // first, transpile to standard css.
      if (sourceType !== 'css') {
        const processor = require('gulp-' + moduleName);
        builder.pipe(processor(this.options[moduleName] || mopts[moduleName]));
      }

      // do some optimization to remove duplicate selectors, and beautify
      builder.pipe(require('gulp-clean-css')({
        format: 'beautify',
        level: {2: {mergeSemantically: true}}
      }));

      // now run autoprefixer
      if (autoprefixer) {
        const prefixer = require('gulp-autoprefixer');
        builder
          .pipe(prefixer({add: false, browsers: []})) // remove outdated prefixed
          .pipe(prefixer(mopts.autoprefixer));     // now add prefixes
      }

      // lint final css
      // lint does not understands postcss statements. so,it come after postcss processing
      if (opts.lint) {
        const stylelint = require('gulp-stylelint');
        let lintOpts = mopts.stylelint || {};
        if (!lintOpts.reporters) lintOpts["reporters"] = [{formatter: 'verbose', console: true}];
        builder.pipe(stylelint(lintOpts));
      }
    }
    builder.sourceMaps();
  }
}

export default CSSPlugin;
