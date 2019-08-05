/**
 *  Jekyll Builder
 */

import { GBuilder } from "../core/builder";

export class GJekyllBuilder extends GBuilder {
    constructor() {
        if (process.platform.startsWith('win'))
            super({ command: 'jekyll.bat', args: [], options: { shell: true } });
        else
            super({ command: 'jekyll', args: [] });
    }

    async build() {
        const opts = this.moduleOptions.jekyll || {};

        let args = [opts.subcommand || 'build'];
        if (this.conf.src) args.push('-s ' + this.conf.src);
        if (this.conf.dest) args.push('-d ' + this.conf.dest);
        args = args.concat(opts.args ? opts.args : opts.options);

        this.externalBuilder!.args = args;
        return super.build();
    }
}

export default GJekyllBuilder;
