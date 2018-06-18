/**
 *  Jekyll Builder
 */

import GExternalBuilder from "./GExternalBuilder";

export class GJekyllBuilder extends GExternalBuilder {
  constructor() {
    if (process.platform.startsWith('win'))
      super('jekyll.bat', [], {shell: true});
    else
      super('jekyll', []);
  }

  async build() {
    const opts = this.moduleOptions.jekyll || {};
    this.args =[opts.subcommand || 'build'];
    if (this.conf.src) this.args.push('-s ' + this.conf.src);
    if (this.conf.dest) this.args.push('-d ' + this.conf.dest);
    this.args = this.args.concat(opts.args ? opts.args : opts.options);
    return super.build();
  }
}

export default GJekyllBuilder;
