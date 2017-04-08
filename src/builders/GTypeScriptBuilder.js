/**
 *  TypeScript Builder
 */

'use strict';
import GBuilder from './GBuilder';
import sourcemaps from 'gulp-sourcemaps';
import typescript from 'gulp-typescript';


class GTypeScriptBuilder extends GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts, defaultModuleOptions) {
    this.merge(mopts,
      this.pick(defaultModuleOptions, ['typescript']),
      {changed:{extension: '.js'}}
      );
  }

  OnBuild(stream, mopts, conf) {
    return stream
      .pipe(sourcemaps.init())
      .pipe(typescript(mopts.typescript))
      .pipe(sourcemaps.write('.'))
  }
}

export default GTypeScriptBuilder;
module.exports = GTypeScriptBuilder;
