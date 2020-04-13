/**
 *  gbm Plugin - CSS
 */

import { Options } from "../core/common";
import { RTB } from "../core/rtb";
import { warn } from "../utils/utils";
import { requireSafe, npmInstall } from "../utils/npm";

const cleanCss = (rtb: RTB) => {
    const opts = Object.assign({}, rtb.moduleOptions.cleanCss, {
        format: 'beautify',
        level: { 2: { mergeSemantically: true } },
    });
    rtb.filter().pipe(requireSafe('gulp-clean-css')(opts));
}


function processPostcss(rtb: RTB, opts: Options, mopts: Options, options: Options) {
    const sourceType = opts.sourceType || 'scss';
    const pcss = requireSafe('gulp-postcss');
    const pcssOpts = Object.assign({}, mopts.postcss, options.postcss);
    const plugins = pcssOpts.plugins || [];
    const autoprefixer = opts.autoprefixer !== false;
    const moduleName = sourceType === 'scss' ? 'sass' : sourceType;

    // first, transpile to standard css.
    // All the scss/less variables should to be evaluated before postcss process starts
    if (sourceType !== 'css') {
        const processor = requireSafe('gulp-' + moduleName);
        rtb.pipe(processor(options[moduleName] || mopts[moduleName]))
    }

    // // now, transpile postcss statements
    if (plugins.length > 0) rtb.filter().pipe(pcss(plugins))

    // now run autoprefixer
    if (autoprefixer) {
        const prefixer = requireSafe('autoprefixer');
        rtb.filter()
            .pipe(pcss([prefixer({ add: false })])) // remove outdated prefixed
            .pipe(pcss([prefixer(mopts.autoprefixer)]))     // now add prefixes
    }

    // do minify here to optimise output (this will also remove lint warnings for intermediate output)
    rtb.chain(cleanCss);

    // lint final css
    // lint does not understands postcss statements. so,it come after postcss processing
    if (opts.lint) {
        npmInstall(['stylelint', 'postcss-reporter']);
        const stylelint = require('stylelint');
        const reporter = require('postcss-reporter');
        let lintOpts = mopts.stylelint || {};
        const reporterOpts = lintOpts.reporter || {};
        rtb.filter()
            .pipe(pcss([stylelint(lintOpts.stylelint || lintOpts), reporter(reporterOpts)]));
    }
}


// available options: options.cleanCss
RTB.registerExtension('css', (options: Options = {}) => (rtb: RTB) => {
    const { buildOptions: opts, moduleOptions: mopts } = rtb.conf;

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
            const processor = requireSafe('gulp-' + moduleName);
            rtb.pipe(processor(options[moduleName] || mopts[moduleName]))
        }

        // now run autoprefixer
        if (autoprefixer) {
            const prefixer = requireSafe('gulp-autoprefixer');
            rtb.filter()
                .pipe(prefixer({ add: false })) // remove outdated prefixed
                .pipe(prefixer(mopts.autoprefixer))
        }

        // do minify here to optimise output (this will also remove lint warnings for intermediate output)
        rtb.chain(cleanCss);

        // lint final css
        // lint does not understands postcss statements. so,it come after postcss processing
        if (opts.lint) {
            const stylelint = requireSafe('gulp-stylelint');
            let lintOpts = mopts.stylelint || {};
            if (!lintOpts.reporters) lintOpts["reporters"] = [{ formatter: 'verbose', console: true }];
            rtb.filter().pipe(stylelint(lintOpts));
        }
    }
});
