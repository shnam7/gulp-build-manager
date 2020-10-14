/**
 *  gbm extension - css
 *
 *  buildOptions:
 *    sourceType: Specifies input source type. Possible values are 'css', 'scss', 'sass', 'less'.
 *    lint: Enable lint.
 *    postcss: Enable PostCSS.
 *    autoprefixer: Enable autoprefixer.
 *
 *  moduleOptions:
 *    sass: Options to gulp-sass.
 *    autoprefixer: Options to gulp-autoprefixer or autoprefixer(if postcss enabled).
 *    postcss: Options to gulp-postcss.
 *    postcss.plugins: postcss plugins array (default: [])
 *    stylelint: Options to gulp-style or stylelint(if postcss enabled).
 *    postcssReporter: Options to postcss-reporter. Valid only when rtb.buildOptions.postcss is true.
 */

import { RTB } from "../core/rtb";
import { Options, warn } from "../utils/utils";
import { requireSafe, npm } from "../utils/npm";

const cleanCss = (rtb: RTB) => {
    const opts = Object.assign({}, rtb.moduleOptions.cleanCss, {
        format: 'beautify',
        level: { 2: { mergeSemantically: true } },
    });
    rtb.filter().pipe(requireSafe('gulp-clean-css')(opts));
}


function processPostcss(rtb: RTB, opts: Options, mopts: Options, options: Options) {
    npm.install('postcss');     // required peer dependency for gulp-postcss

    const sourceType = opts.sourceType || 'scss';
    const pcss = requireSafe('gulp-postcss');
    const pcssOpts = Object.assign({}, mopts.postcss, options.postcss);
    const plugins = pcssOpts.plugins || [];
    const autoprefixer = opts.autoprefixer !== false;
    const moduleName = sourceType === 'scss' ? 'sass' : sourceType;
    delete pcssOpts.plugins;    // delete gbm specific option

    // first, transpile to standard css.
    // All the scss/less variables should to be evaluated before postcss process starts
    if (sourceType !== 'css') {
        const processor = requireSafe('gulp-' + moduleName);
        rtb.pipe(processor(Object.assign({}, mopts[moduleName], options[moduleName])));
    }

    // // now, transpile postcss statements
    if (plugins.length > 0) rtb.filter().pipe(pcss(plugins, pcssOpts))

    // now run autoprefixer
    if (autoprefixer) {
        const prefixer = requireSafe('autoprefixer');
        const prefixerOpts = Object.assign({}, mopts.autoprefixer, options.autoprefixer);
        rtb.filter()
            .pipe(pcss([prefixer(prefixerOpts)])) // now add prefixes
    }

    // do minify here to optimise output (this will also remove lint warnings for intermediate output)
    rtb.chain(cleanCss);

    // lint final css
    // lint does not understands postcss statements. so,it come after postcss processing
    if (opts.lint) {
        npm.install(['stylelint', 'postcss-reporter']);
        const stylelint = require('stylelint');
        const reporter = require('postcss-reporter');
        const lintOpts = Object.assign({}, mopts.stylelint, options.stylelint);
        const reporterOpts = Object.assign({}, mopts.postcssReporter, options.postcssReporter);
        rtb.filter().pipe(pcss([stylelint(lintOpts), reporter(reporterOpts)]));
    }
}


// available options: options.cleanCss
RTB.registerExtension('css', (options: Options = {}) => (rtb: RTB) => {
    const { buildOptions: opts, moduleOptions: mopts } = rtb.conf;

    // backward compatibility on autoprefixer options
    if (opts.autoPrefixer === undefined && opts.autoPrefixer !== undefined) {
        opts.autoprefixer = opts.autoPrefixer;
        warn('[ext-css] buildOptions.autoPrefixer is deprecated. Use buildOptions.autoprefixer instead.');
    }
    if (mopts.autoPrefixer === undefined && opts.autoPrefixer !== undefined) {
        mopts.autoprefixer = mopts.autoPrefixer;
        warn('[ext-css] moduleOptions.autoPrefixer is deprecated. Use moduleOptions.autoprefixer instead.');
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
            rtb.pipe(processor(Object.assign({}, mopts[moduleName], options[moduleName])));
        }

        // now run autoprefixer
        if (autoprefixer) {
            const prefixerOpts = Object.assign({}, mopts.autoprefixer, options.autoprefixer);
            rtb.filter().pipe(requireSafe('gulp-autoprefixer')(prefixerOpts));
        }

        // do minify here to optimise output (this will also remove lint warnings for intermediate output)
        rtb.chain(cleanCss);

        // lint final css
        // lint does not understands postcss statements. so, it comes after postcss processing
        if (opts.lint) {
            const lintOpts = Object.assign({}, mopts.stylelint,
                { reporters: [{ formatter: 'verbose', console: true }]}, options.stylelint);
            rtb.filter().pipe(requireSafe('gulp-stylelint')(lintOpts));
        }
    }
});
