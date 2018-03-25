/**
 *  Jekyll Builder
 */
import {Options, Stream} from "../core/types";
import {pick} from "../core/utils";
import GExternalBuilder from "./GExternalBuilder";

export class GJekyllBuilder extends GExternalBuilder {
  constructor() {
    super(process.platform === 'win32' ? 'jekyll.bat' : 'jekyll');
  }

  OnBuilderModuleOptions(mopts:Options, defaultModuleOptions:Options) {
    return pick(defaultModuleOptions, 'jekyll');
  }

  // overload not to create a stream
  OnInitStream(mopts:Options, defaultModuleOptions:Options, conf:Options) { return undefined; }

  OnBuild(stream:Stream, mopts:Options, conf:Options) {
    const opts = mopts.jekyll || {};
    this.args =[opts.subcommand || 'build'];
    if (conf.src) this.args.push('-s ' + conf.src);
    if (conf.dest) this.args.push('-d ' + conf.dest);
    this.args = this.args.concat(opts.args ? opts.args : opts.options);
    this.options = {shell: true};
    return super.OnBuild(stream, mopts, conf);
  }
}

export default GJekyllBuilder;