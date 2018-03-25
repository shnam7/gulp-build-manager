/**
 *  gbm Plugin - TypeScript
 */
import * as gulp from 'gulp';
import * as upath from 'upath';
import {is, toPromise} from '../core/utils';
import {BuildConfig, GulpStream, Options, Slot} from "../core/types";
import {GBuilder} from "../core/builder";
import {GPlugin} from "../core/plugin";

export class TypeScriptPlugin extends GPlugin {
  constructor(options:Options={}, slots: Slot|Slot[]='build') { super(options, slots); }

  OnStream(stream:GulpStream, mopts:Options, conf:BuildConfig, slot:Slot, builder:GBuilder) {
    const opts = conf.buildOptions || {};
    const lint = this.options.lint || opts.lint;
    const tsConfig = this.options.tsConfig || opts.tsConfig;
    let tsOpts = this.options.typescript || mopts.typescript || {};

    // conf setting will override module settings(mopts)
    if (conf.outFile) Object.assign(tsOpts, {outFile:upath.resolve(conf.outFile)});
    if (conf.outFile && is.String(conf.dest)) Object.assign(tsOpts, {outDir:upath.resolve(conf.dest as string)});

    // check lint option
    if (lint) {
      const tsLint = require('gulp-tslint');
      const tsLintOpts = this.options.tslint || mopts.tslint;
      const tsLintProps = this.options.tslintProps || this.options.tslintExtra || mopts.tslintExtra || {};
      stream = stream.pipe(tsLint(tsLintOpts)).pipe(tsLint.report(tsLintProps.report));
    }

    const typescript = require('gulp-typescript');
    let tsProject = undefined;
    if (tsConfig) {
      try {
        tsProject = typescript.createProject(tsConfig, tsOpts);
        if (opts.printConfig) {
          console.log(`[TypeScriptPlugin]tsconfig evaluated(buildName:${conf.buildName}):\n`,
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
      if (opts.printConfig)
        console.log(`[TypeScriptPlugin]tsconfig evaluated(buildName:${conf.buildName}):\n`, {"compilerOptions":tsOpts});
    }

    // transpile .ts files
    let tsStream = stream.pipe(tsProject());

    // process dts stream/ output directory is from tsconfig.json settings or conf.dest
    let dtsDir = tsStream.project.options.declationDir || conf.dest;
    builder.promises.push(toPromise(tsStream.dts.pipe(gulp.dest(dtsDir))));

    // continue with transpiled javascript files
    return tsStream.js;
  }
}

export default TypeScriptPlugin;