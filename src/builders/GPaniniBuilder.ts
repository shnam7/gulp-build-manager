/**
 *  Panini Builder
 */
import {GBuilder} from "../core/builder";
import {Options} from "../core/types";
import {pick} from "../utils/utils";

export class GPaniniBuilder extends GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts:Options, defaultModuleOptions:Options) {
    return pick(defaultModuleOptions, 'panini');
  }

  OnPreparePlugins(mopts:Options, conf:Options) {
    const panini = require('panini');
    panini.refresh();
    this.addPlugins(stream=>stream && stream.pipe(panini(mopts.panini)));
  }
}

export default GPaniniBuilder;