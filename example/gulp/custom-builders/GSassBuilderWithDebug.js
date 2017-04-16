'use strict';
import GSassBuilder from '../../../lib/builders/GSassBuilder';
import debug from 'gulp-debug';

class GSassBuilderWithDebug extends GSassBuilder {
  OnInitStream(mopts, defaultModuleOptions, conf) {
    return super.OnInitStream(mopts, defaultModuleOptions, conf)
      .pipe(debug());
  }
}

export default GSassBuilderWithDebug;
module.exports = GSassBuilderWithDebug;
