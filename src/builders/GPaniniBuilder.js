/**
 *  Panini Builder
 */

'use strict';
import GBuilder from './GBuilder';
import markdown from 'gulp-markdown';
import panini from 'panini';


class GPaniniBuilder extends GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts, defaultModuleOptions) {
    return this.pick(defaultModuleOptions, ['panini', 'markdown'])
  }

  OnBuild(stream, mopts, conf) {
    panini.refresh();

    return stream
      .pipe(markdown(mopts.markdown))
      .pipe(panini(mopts.panini))
  }
}

export default GPaniniBuilder;
module.exports = GPaniniBuilder;
