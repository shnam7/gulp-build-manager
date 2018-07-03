/**
 *  gbm Plugin - TypeScript
 */
import * as upath from 'upath';
import {dmsg, msg, warn} from '../utils/utils';
import {Options} from "../core/types";
import {GBuilder} from "../core/builder";
import {GPlugin} from "../core/plugin";

export class TypeScriptPlugin extends GPlugin {
  constructor(options:Options={}) { super(options); }

  process(builder: GBuilder) {
    const tsOpts = builder.moduleOptions.typescript || {};
    const tsConfig = builder.buildOptions.tsConfig;

    // normalize outDir and outFile
    let outFile = (tsOpts.output && tsOpts.output.filename) || builder.conf.outFile;
    let outDir = (tsOpts.output && tsOpts.output.path) || builder.conf.dest;
    if (outDir && outFile && !upath.isAbsolute(outFile)) outFile = upath.join(outDir, outFile);
    if (outFile) {
      outDir = upath.dirname(outFile);
      outFile = upath.basename(outFile)
    }

    // conf setting will override module settings(mopts)
    if (outFile) tsOpts.outFile = outFile;
    if (outDir) tsOpts.outDir = outDir;

    // check lint option
    if (builder.buildOptions.lint) {
      const tslint = require('gulp-tslint');
      // const tslintOpts = builder.moduleOptions.tslint || {formatter: 'stylish'};
      const tslintOpts = builder.moduleOptions.tslint || {formatter: 'stylish'};
      const reportOpts = tslintOpts.report || {};
      // dmsg('[TypeScriptPlugin]tslint Options =', tslintOpts, reportOpts);
      builder.pipe(tslint(tslintOpts)).pipe(tslint.report(reportOpts));
    }

    // workaround for gulp-typescript declarationMap to be true always
    // Addd buildOptions.declarationMap option to override tsconfig files and moduleOptions.tsConfig
    tsOpts.declarationMap = !!builder.buildOptions.declarationMap;

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

    if (builder.buildOptions.printConfig) {
      msg(`[TypeScriptPlugin]tsconfig evaluated(buildName:${builder.conf.buildName}):\n`, tsProject.options);
    }

    // workaround for gulp-typescript sourceMap failure which requires sourceRoot value
    let smOpts = Object.assign({write: {sourceRoot:'.'}}, builder.moduleOptions.sourcemaps);
    builder.pipe(tsProject()).sourceMaps(smOpts);

    if (!tsOpts.declarationMap) builder.filter(["**", "!**/*.d.ts.map"]);
  }
}

export default TypeScriptPlugin;
