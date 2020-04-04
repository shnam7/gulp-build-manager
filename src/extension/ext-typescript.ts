import * as upath from 'upath';
import { RTB } from "../core/rtb";
import { Options } from "../core/common";
import { warn, msg } from '../utils/utils';
import { requireSafe, npmInstall } from '../utils/npm';

RTB.registerExtension('typeScript', (options: Options = {}) => (rtb: RTB) => {
    const tsOpts = Object.assign({}, rtb.conf.moduleOptions.typescript);
    const tsConfig = rtb.conf.buildOptions.tsConfig;

    // normalize outDir and outFile
    let outFile = (tsOpts.output && tsOpts.output.filename) || rtb.conf.outFile;
    let outDir = (tsOpts.output && tsOpts.output.path) || rtb.conf.dest;
    if (outDir && outFile && !upath.isAbsolute(outFile)) outFile = upath.join(outDir, outFile);
    if (outFile) {
        outDir = upath.dirname(outFile);
        outFile = upath.basename(outFile)
    }

    // conf setting will override module settings(mopts)
    if (outFile) tsOpts.outFile = outFile;
    if (outDir) tsOpts.outDir = outDir;

    // check lint option
    if (rtb.conf.buildOptions.lint) {
        const tslint = requireSafe('gulp-tslint');
        // const tslintOpts = rtb.conf.moduleOptions.tslint || {formatter: 'stylish'};
        const tslintOpts = Object.assign({}, { formatter: 'stylish' }, rtb.conf.moduleOptions.tslint);
        const reportOpts = tslintOpts.report || {};
        // dmsg('[GBM:ext.typeScript]tslint Options =', tslintOpts, reportOpts);
        rtb.pipe(tslint(tslintOpts)).pipe(tslint.report(reportOpts));
    }

    // workaround for gulp-typescript declarationMap to be true always
    // Addd buildOptions.declarationMap option to override tsconfig files and moduleOptions.tsConfig
    tsOpts.declarationMap = !!rtb.conf.buildOptions.declarationMap;

    npmInstall(['gulp-typescript', 'typescript']);
    const typescript = require('gulp-typescript');
    let tsProject = undefined;
    if (tsConfig) {
        try {
            tsProject = typescript.createProject(tsConfig, tsOpts);
        }
        catch (e) {
            if (e.code !== 'ENOENT') throw e;
            warn('WARN: tsConfig specified but not found:', upath.resolve(tsConfig));
        }
    }
    if (!tsProject) tsProject = typescript.createProject(tsOpts);

    if (rtb.conf.buildOptions.printConfig) {
        msg(`[GBM:ext.typeScript]tsconfig evaluated(buildName:${rtb.conf.buildName}):\n`, tsProject.options);
    }

    // workaround for gulp-typescript sourceMap failure which requires sourceRoot value
    let smOpts = Object.assign({ write: { sourceRoot: '.' } }, rtb.conf.moduleOptions.sourcemaps);
    rtb.pipe(tsProject()).sourceMaps(smOpts);

    if (!tsOpts.declarationMap) rtb.filter(["**", "!**/*.d.ts.map"]);
});
