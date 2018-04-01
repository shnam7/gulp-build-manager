/**
 *  Twig Builder
 */
import {Options} from "../core/types";
import {GBuilder} from "../core/builder";
import TwigPlugin from "../plugins/TwigPlugin";
import {pick} from "../utils/utils";

export class GTwigBuilder extends GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts:Options, defaultModuleOptions:Options) {
    return pick(defaultModuleOptions, 'twig', 'htmlmin', 'htmiPrettify');
  }

  OnPreparePlugins(mopts:Options, conf:Options) {
    this.addPlugins(new TwigPlugin());
  }
}

export default GTwigBuilder;