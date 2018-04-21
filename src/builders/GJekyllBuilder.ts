/**
 *  Jekyll Builder
 */

import GExternalBuilder from "./GExternalBuilder";

export class GJekyllBuilder extends GExternalBuilder {
  constructor() {
    super(process.platform === 'win32' ? 'jekyll.bat' : 'jekyll');
  }

  build() {
    const opts = this.moduleOptions.jekyll || {};
    this.args =[opts.subcommand || 'build'];
    if (this.conf.src) this.args.push('-s ' + this.conf.src);
    if (this.conf.dest) this.args.push('-d ' + this.conf.dest);
    this.args = this.args.concat(opts.args ? opts.args : opts.options);
    return super.build();
  }
}

export default GJekyllBuilder;
