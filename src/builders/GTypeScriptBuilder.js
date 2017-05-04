/**
 *  TypeScript Builder
 */

'use strict';
import GBuilder from './GBuilder';
import typescript from 'gulp-typescript';
import sourcemaps from 'gulp-sourcemaps';
import upath from 'upath';

class GTypeScriptBuilder extends GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts, defaultModuleOptions) {
    this.merge(mopts, this.pick(defaultModuleOptions, ['typescript']));
    this.merge(mopts, {changed:{extension: '.js'}});
  }

  OnBuild(stream, mopts, conf) {
    let tsProject = undefined;
    try {
      tsProject = typescript.createProject(conf.buildOptions.tsConfig, mopts.typescript);
    }
    catch (e) {
      if (e.code !== 'ENOENT') throw e;
      console.log('WARN: buildOptions.tsConfig specified but not found:', upath.resolve(conf.buildOptions.tsConfig));
      tsProject = typescript.createProject(mopts.typescript);
    }
    return stream
      .pipe(sourcemaps.init())
      .pipe(tsProject()).js
      .pipe(sourcemaps.write('.'))
  }
}

export default GTypeScriptBuilder;
module.exports = GTypeScriptBuilder;
