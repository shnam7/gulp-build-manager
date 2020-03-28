/**
 *  gbm Plugin - CSS
 */

import { Options } from "../core/common";
import { RTB } from "../core/rtb";
import { warn } from "../utils/utils";

function processPostcss(rtb: RTB, opts: Options, mopts: Options, options: Options) {
    const sourceType = opts.sourceType || 'scss';
    const pcss = require('gulp-postcss');
    const pcssOpts = options.postcss || mopts.postcss || {};
    const plugins = pcssOpts.plugins || [];
    const autoprefixer = opts.autoprefixer !== false;
    const moduleName = sourceType === 'scss' ? 'sass' : sourceType;

    // first, transpile to standard css.
    // All the scss/less variables should to be evaluated before postcss process starts
    if (sourceType !== 'css') {
        const processor = require('gulp-' + moduleName);
        rtb.pipe(processor(options[moduleName] || mopts[moduleName])).sourceMaps();
    }

    // // now, transpile postcss statements
    if (plugins.length > 0) rtb.filter().pipe(pcss(plugins)).sourceMaps();

    // do some optimization to remove duplicate selectors, and beautify
    rtb.filter().pipe(require('gulp-clean-css')({
        sourceMap: true,
        sourceMapInlineSources: true,
        format: 'beautify',
        level: { 2: { mergeSemantically: true } }
    })).sourceMaps();

    // now run autoprefixer
    if (autoprefixer) {
        const prefixer = require('autoprefixer');
        rtb.filter()
            .pipe(pcss([prefixer({ add: false })])) // remove outdated prefixed
            .pipe(pcss([prefixer(mopts.autoprefixer)]))     // now add prefixes
            .sourceMaps();
    }

    // lint final css
    // lint does not understands postcss statements. so,it come after postcss processing
    if (opts.lint) {
        const stylelint = require('stylelint');
        const reporter = require('postcss-reporter');
        let lintOpts = mopts.stylelint || {};
        const reporterOpts = lintOpts.reporter || {};
        rtb.filter()
            .pipe(pcss([stylelint(lintOpts.stylelint || lintOpts), reporter(reporterOpts)]));
    }
}


RTB.registerExtension('css', (options: Options = {}) => (rtb: RTB) => {
    const opts = rtb.buildOptions;
    const mopts = rtb.moduleOptions;

    // backward compatibility on autoprefixer options
    if (opts.autoPrefixer === undefined && opts.autoPrefixer !== undefined) {
        opts.autoprefixer = opts.autoPrefixer;
        warn('[GBM:ext.css] DeprecationWarning: buildOptions.autoPrefixer is deprecated. Use buildOptions.autoprefixer.');
    }
    if (mopts.autoPrefixer === undefined && opts.autoPrefixer !== undefined) {
        mopts.autoprefixer = mopts.autoPrefixer;
        warn('[GBM:ext.css] DeprecationWarning: moduleOptions.autoPrefixer is deprecated. Use moduleOptions.autoprefixer.');
    }

    // basic build options
    const postcss = opts.postcss !== false;   // enable postcss by default
    if (postcss) {
        processPostcss(rtb, opts, mopts, options);
    }
    else {
        const sourceType = opts.sourceType || 'scss';
        const autoprefixer = opts.autoprefixer !== false;
        const moduleName = sourceType === 'scss' ? 'sass' : sourceType;

        // first, transpile to standard css.
        if (sourceType !== 'css') {
            const processor = require('gulp-' + moduleName);
            rtb.pipe(processor(options[moduleName] || mopts[moduleName])).sourceMaps();
        }

        // do some optimization to remove duplicate selectors, and beautify
        rtb.filter().pipe(require('gulp-clean-css')({
            format: 'beautify',
            level: { 2: { mergeSemantically: true } }
        })).sourceMaps();

        // now run autoprefixer
        if (autoprefixer) {
            const prefixer = require('gulp-autoprefixer');
            rtb.filter()
                .pipe(prefixer({ add: false })) // remove outdated prefixed
                .pipe(prefixer(mopts.autoprefixer)).sourceMaps();     // now add prefixes
        }

        // lint final css
        // lint does not understands postcss statements. so,it come after postcss processing
        if (opts.lint) {
            const stylelint = require('gulp-stylelint');
            let lintOpts = mopts.stylelint || {};
            if (!lintOpts.reporters) lintOpts["reporters"] = [{ formatter: 'verbose', console: true }];
            rtb.filter().pipe(stylelint(lintOpts));
        }
    }
    rtb.sourceMaps();
});
