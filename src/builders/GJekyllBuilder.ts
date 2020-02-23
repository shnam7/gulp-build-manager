/**
 *  Jekyll Builder
 */

import { GBuilder } from "../core/builder";
import { RTB } from "../core/rtb";

export class GJekyllBuilder extends GBuilder {
    command: string;

    constructor() {
        super();
        this.command = process.platform.startsWith('win') ? 'jekyll.bat' : 'jekyll';
    }

    build() {
        const opts = this.moduleOptions.jekyll || {};

        let args = [opts.subcommand || 'build'];
        if (this.conf.src) args.push('-s ' + this.conf.src);
        if (this.conf.dest) args.push('-d ' + this.conf.dest);
        args = args.concat(opts.args ? opts.args : opts.options);

        this.exec(this.command, args, { shell: true });
    }
}

export default GJekyllBuilder;
