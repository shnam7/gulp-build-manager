/**
 *  gbm Plugin - TypeScript
 */
import * as gulp from 'gulp';
import * as upath from 'upath';
import {is, toPromise} from '../utils/utils';
import {GulpStream, Options} from "../core/types";
import {GBuilder} from "../core/builder";
import {GPlugin} from "../core/plugin";

export class TypeScriptPlugin extends GPlugin {
  constructor(options:Options={}) { super(options); }

  process(builder: GBuilder) {
    const tsOpts = builder.moduleOptions.typescript || {};
    const tsConfig = builder.buildOptions.tsConfig;

    // conf setting will override module settings(mopts)
    if (builder.conf.outFile) Object.assign(tsOpts, {outFile:upath.resolve(builder.conf.outFile)});
    if (builder.conf.outFile && is.String(builder.conf.dest))
      tsOpts.outDir = upath.resolve(builder.conf.dest as string);

    // check lint option
    if (builder.buildOptions.lint) {
      const tslint = require('gulp-tslint');
      const tslintOpts = builder.moduleOptions.tslint || {};
      console.log('tslintOpts =', tslintOpts);
      builder.pipe(tslint(tslintOpts)).pipe(tslint.report(tslintOpts.report));
    }

    const typescript = require('gulp-typescript');
    let tsProject = undefined;
    if (tsConfig) {
      try {
        tsProject = typescript.createProject(tsConfig, tsOpts);
        if (builder.buildOptions.printConfig) {
          console.log(`[TypeScriptPlugin]tsconfig evaluated(buildName:${builder.conf.buildName}):\n`,
            Object.assign({}, tsProject.config, {"compilerOptions":tsOpts}));
        }
      }
      catch (e) {
        if (e.code !== 'ENOENT') throw e;
        console.log('WARN: tsConfig specified but not found:', upath.resolve(tsConfig));
      }
    }
    if (!tsProject) {
      tsProject = typescript.createProject(tsOpts);
      if (builder.buildOptions.printConfig)
        console.log(`[TypeScriptPlugin]tsconfig evaluated(buildName:${builder.conf.buildName}):\n`,
          {"compilerOptions":tsOpts});
    }

    // transpile .ts files
    let tsStream = (builder.stream as GulpStream).pipe(tsProject());

    // continue with transpiled javascript files
    builder.stream = tsStream.js;
    builder.sourceMaps();

    // process dts stream/ output directory is from tsconfig.json settings or conf.dest
    let dtsDir = tsStream.project.options.declationDir || builder.conf.dest;
    return toPromise(tsStream.dts.pipe(gulp.dest(dtsDir)));
  }
}

export default TypeScriptPlugin;
