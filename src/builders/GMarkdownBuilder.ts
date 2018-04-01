/**
 *  Markdown Builder
 */
import {pick} from "../utils/utils";
import {Options} from "../core/types";
import {GBuilder} from "../core/builder";
import {MarkdownPlugin} from "../plugins/MarkdownPlugin";

export class GMarkdownBuilder extends GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts:Options, defaultModuleOptions:Options) {
    return pick(defaultModuleOptions, 'markdown');
  }

  OnPreparePlugins(mopts:Options, conf:Options) {
    this.addPlugins(new MarkdownPlugin());
  }
}

export default GMarkdownBuilder;