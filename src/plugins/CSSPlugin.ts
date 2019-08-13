/**
 *  gbm Plugin - CSS
 */

import { Options } from "../core/common";
import { GBuilder } from "../core/builder";
import { GPlugin } from "../core/plugin";
import { warn } from "../utils/utils";

export class CSSPlugin extends GPlugin {
    constructor(options: Options = {}) { super(options); }

    processPostcss(builder: GBuilder, opts: Options, mopts: Options) {
        const sourceType = opts.sourceType || 'scss';
        const pcss = require('gulp-postcss');
        const pcssOpts = this.options.postcss || mopts.postcss || {};
        const plugins = pcssOpts.plugins || [];
        const autoprefixer = opts.autoprefixer !== false;
        const moduleName = sourceType === 'scss' ? 'sass' : sourceType;

        // first, transpile to standard css.
        // All the scss/less variables should to be evaluated before postcss process starts
        if (sourceType !== 'css') {
            const processor = require('gulp-' + moduleName);
            builder.pipe(processor(this.options[moduleName] || mopts[moduleName])).sourceMaps();
        }

        // // now, transpile postcss statements
        if (plugins.length > 0) builder.filter().pipe(pcss(plugins)).sourceMaps();

        // do some optimization to remove duplicate selectors, and beautify
        builder.filter().pipe(require('gulp-clean-css')({
            sourceMap: true,
            sourceMapInlineSources: true,
            format: 'beautify',
            level: { 2: { mergeSemantically: true } }
        })).sourceMaps();

        // now run autoprefixer
        if (autoprefixer) {
            const prefixer = require('autoprefixer');
            builder.filter()
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
            builder.filter()
                .pipe(pcss([stylelint(lintOpts.stylelint || lintOpts), reporter(reporterOpts)]));
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
            const moduleName = sourceType === 'scss' ? 'sass' : sourceType;

            // first, transpile to standard css.
            if (sourceType !== 'css') {
                const processor = require('gulp-' + moduleName);
                builder.pipe(processor(this.options[moduleName] || mopts[moduleName])).sourceMaps();
            }

            // do some optimization to remove duplicate selectors, and beautify
            builder.filter().pipe(require('gulp-clean-css')({
                format: 'beautify',
                level: { 2: { mergeSemantically: true } }
            })).sourceMaps();

            // now run autoprefixer
            if (autoprefixer) {
                const prefixer = require('gulp-autoprefixer');
                builder.filter()
                    .pipe(prefixer({ add: false })) // remove outdated prefixed
                    .pipe(prefixer(mopts.autoprefixer)).sourceMaps();     // now add prefixes
            }

            // lint final css
            // lint does not understands postcss statements. so,it come after postcss processing
            if (opts.lint) {
                const stylelint = require('gulp-stylelint');
                let lintOpts = mopts.stylelint || {};
                if (!lintOpts.reporters) lintOpts["reporters"] = [{ formatter: 'verbose', console: true }];
                builder.filter().pipe(stylelint(lintOpts));
            }
        }
        builder.sourceMaps();
    }
}

export default CSSPlugin;
