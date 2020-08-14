"use strict";
/**
 *  Jekyll Builder
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GJekyllBuilder = void 0;
const builder_1 = require("../core/builder");
class GJekyllBuilder extends builder_1.GBuilder {
    constructor() {
        super();
        this.command = process.platform.startsWith('win') ? 'jekyll.bat' : 'jekyll';
    }
    build() {
        const opts = this.moduleOptions.jekyll;
        let args = [opts.subcommand || 'build'];
        if (this.conf.src)
            args.push('-s ' + this.conf.src);
        if (this.conf.dest)
            args.push('-d ' + this.conf.dest);
        args = args.concat(opts.args ? opts.args : opts.options);
        this.exec(this.command, args, { shell: true });
    }
}
exports.GJekyllBuilder = GJekyllBuilder;
exports.default = GJekyllBuilder;
