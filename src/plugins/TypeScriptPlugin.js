/**
 *  gbm Plugin - TypeScript
 */

import GPlugin from '../core/GPlugin';
import upath from 'upath';
import merge from 'lodash.merge';
import gulp from 'gulp';
import is from '../utils/is';

export default class TypeScriptPlugin extends GPlugin {
  constructor(options={}, slots='build') { super(options, slots); }

  process(stream, mopts, conf, slot) {
    const opts = conf.buildOptions;
    const lint = this.options.lint || opts.lint;
    const tsConfig = this.options.tsConfig || opts.tsConfig;
    const tsOpts = this.options.typescript || mopts.typescript || {};

    // conf setting will override module settings(mopts)
    if (conf.outFile) merge(tsOpts, {outFile:upath.resolve(conf.outFile)});
    if (conf.outFile && is.String(conf.dest)) merge(tsOpts, {outDir:upath.resolve(conf.dest)});

    // check lint option
    if (lint) {
      const tslint = require('gulp-tslint');
      const tslintOpts = this.options.tslint || mopts.tslint;
      const tslintExtra = this.options.tslintExtra || mopts.tslintExtra || {};
      stream = stream.pipe(tslint(tslintOpts)).pipe(tsLint.report(tslintExtra.report));
    }

    const typescript = require('gulp-typescript');
    let tsProject = undefined;
    if (tsConfig) {
      try {
        tsProject = typescript.createProject(tsConfig, tsOpts);
      }
      catch (e) {
        if (e.code !== 'ENOENT') throw e;
        console.log('WARN: tsConfig specified but not found:', upath.resolve(tsConfig));
      }
    }
    if (!tsProject) tsProject = typescript.createProject(tsOpts);

    // transpile .ts files
    let tsStream = stream.pipe(tsProject());

    // process dts stream/ output directory is from tsconfig.json settings or conf.dest
    let dtsDir = tsStream.project.options.declationDir || conf.dest;

    // process js stream
    return require('merge-stream')([
      tsStream.dts.pipe(gulp.dest(dtsDir)),
      tsStream.js
    ]);
  }
}
module.exports = TypeScriptPlugin;
