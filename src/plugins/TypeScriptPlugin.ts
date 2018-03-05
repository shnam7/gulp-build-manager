/**
 *  gbm Plugin - TypeScript
 */
import * as gulp from 'gulp';
import * as upath from 'upath';
import {is} from '../core/utils';
import {Options, Slot, Stream} from "../core/types";
import {GBuilder} from "../core/builder";
import {GPlugin} from "../core/plugin";

export class TypeScriptPlugin extends GPlugin {
  constructor(options:Options={}, slots: Slot|Slot[]='build') { super(options, slots); }

  process(stream:Stream, mopts:Options, conf:Options, slot:Slot, builder:GBuilder) {
    const opts = conf.buildOptions || {};
    const lint = this.options.lint || opts.lint;
    const tsConfig = this.options.tsConfig || opts.tsConfig;
    let tsOpts = this.options.typescript || mopts.typescript || {};

    // conf setting will override module settings(mopts)
    if (conf.outFile) Object.assign(tsOpts, {outFile:upath.resolve(conf.outFile)});
    if (conf.outFile && is.String(conf.dest)) Object.assign(tsOpts, {outDir:upath.resolve(conf.dest)});

    // check lint option
    if (lint) {
      const tsLint = require('gulp-tslint');
      const tsLintOpts = this.options.tslint || mopts.tslint;
      const tsLintExtra = this.options.tslintExtra || mopts.tslintExtra || {};
      stream = stream && stream.pipe(tsLint(tsLintOpts)).pipe(tsLint.report(tsLintExtra.report));
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
    let tsStream = stream && stream.pipe(tsProject());

    // process dts stream/ output directory is from tsconfig.json settings or conf.dest
    let dtsDir = tsStream.project.options.declationDir || conf.dest;


    builder.promises.push(new Promise((resolve, reject)=>{
      tsStream.dts.pipe(gulp.dest(dtsDir))
        .on('end', resolve)
        .on('error', reject);
    }));
    return tsStream.js;

    //
    // tsStream.dts.pipe(gulp.dest(dtsDir))
    //
    //
    // // process js stream
    // return require('merge-stream')([
    //   conf.flushStream
    //     ? this.promise.push(new Promise((resolve, reject)=>{
    //       tsStream.dts.pipe(gulp.dest(dtsDir))
    //         .on('end', resolve)
    //         .on('error', reject);
    //     }))
    //     : tsStream.dts.pipe(gulp.dest(dtsDir)),
    //   tsStream.js
    // ]);
  }
}

export default TypeScriptPlugin;