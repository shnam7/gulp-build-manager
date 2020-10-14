"use strict";
/**
 *  gbm extension - typescript
 *
 *  buildOptions:
 *    lint: Enable lint
 *    printConfig: Print tsConfig settiings actually used.
 *
 *  moduleOptions:
 *    typescript: Options to gulp-typescript.
 *    tslint: Options to gulp-tslint.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const upath = require("upath");
const rtb_1 = require("../core/rtb");
const utils_1 = require("../utils/utils");
rtb_1.RTB.registerExtension('typeScript', (options = {}) => (rtb) => {
    var _a, _b;
    const { buildOptions: opts, moduleOptions: mopts } = rtb.conf;
    const tsConfig = opts.tsConfig; // tsconfig file path
    const tsOpts = Object.assign({}, mopts.typescript, options.typescript);
    // normalize outDir and outFile
    let outFile = ((_a = tsOpts.output) === null || _a === void 0 ? void 0 : _a.filename) || rtb.conf.outFile;
    let outDir = ((_b = tsOpts.output) === null || _b === void 0 ? void 0 : _b.path) || rtb.conf.dest;
    if (outDir && outFile && !upath.isAbsolute(outFile))
        outFile = upath.join(outDir, outFile);
    if (outFile) {
        outDir = upath.dirname(outFile);
        outFile = upath.basename(outFile);
    }
    // conf setting will override module settings(mopts)
    if (outFile)
        tsOpts.outFile = outFile;
    if (outDir)
        tsOpts.outDir = outDir;
    // check lint option
    if (opts.lint) {
        const tslint = utils_1.requireSafe('gulp-tslint');
        const tslintOpts = Object.assign({}, { formatter: 'stylish' }, mopts.tslint);
        const reportOpts = tslintOpts.report || {};
        rtb.pipe(tslint(tslintOpts)).pipe(tslint.report(reportOpts));
    }
    // workaround for gulp-typescript declarationMap to be true always
    // Addd buildOptions.declarationMap option to override tsconfig files and moduleOptions.tsConfig
    tsOpts.declarationMap = !!rtb.buildOptions.declarationMap;
    utils_1.npm.install(['typescript', 'gulp-typescript']);
    const typescript = require('gulp-typescript');
    let tsProject = undefined;
    if (tsConfig) {
        try {
            tsProject = typescript.createProject(tsConfig, tsOpts);
        }
        catch (e) {
            if (e.code !== 'ENOENT')
                throw e;
            utils_1.warn('WARN: tsConfig specified but not found:', upath.resolve(tsConfig));
        }
    }
    if (!tsProject)
        tsProject = typescript.createProject(tsOpts);
    if (opts.printConfig) {
        utils_1.msg(`[ext-typeScript] tsconfig evaluated(name:${rtb.name}):\n`, tsProject.options);
    }
    // workaround for gulp-typescript sourceMap failure which requires sourceRoot value
    // let smOpts = Object.assign({ write: { sourceRoot: '.' } }, rtb.moduleOptions.sourcemaps);
    rtb.pipe(tsProject());
    // .sourceMaps(smOpts);
    if (!tsOpts.declarationMap)
        rtb.filter(["**", "!**/*.d.ts.map"]);
});
