/**
 *  Panini Builder
 */

'use strict';
import GBuilder from './GBuilder';

export default class GPaniniBuilder extends GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts, defaultModuleOptions) {
    return this.pick(defaultModuleOptions, ['panini'])
  }

  OnPreparePlugins(mopts, conf) {
    const panini = require('panini');
    panini.refresh();
    this.addPlugins(stream=>stream.pipe(panini(mopts.panini)));
  }
}
module.exports = GPaniniBuilder;
