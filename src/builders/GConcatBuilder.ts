/**
 *  Concatenation Builder
 */

import {Options} from "../core/types";
import {GBuilder} from "../core/builder";
import {ConcatPlugin} from "../plugins/ConcatPlugin";
import {pick} from "../core/utils";

export default class GConcatBuilder extends GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts:Options, defaultModuleOptions:Options) {
    return pick(defaultModuleOptions, 'concat');
  }

  OnPreparePlugins(mopts:Options, conf:Options) {
    this.addPlugins(new ConcatPlugin());
  }
}