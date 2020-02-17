/**
 *  gbm Plugin - Changed
 */

import * as upath from 'upath';
import { Options } from "../core/common";
import { GPlugin } from "../core/plugin";
import { info, is, msg } from "../utils/utils";
import { RTB } from '../core/rtb';

/**
 * Configuration priorities:
 * - load webpack.config.js if buildOptions.webpackConfig is set
 * - override the config file with moduleOptions.webpack
 * - override it with rtb.conf.src (src can be an array to specify multiple entries
 * - override it with rtb.conf.outFile and rtb.conf.dest
 */
export class WebpackPlugin extends GPlugin {

    constructor(options: Options = {}) { super(options); }

    process(rtb: RTB) {
        // resolve: workaround function to handle platform dependency of backslashes
        const resolve = (process.platform === 'win32') ? upath.win32.resolve : upath.resolve;
        const merge = require('lodash.merge');

        const opts = rtb.conf.buildOptions || {};
        const configFile = resolve(this.options.configFile || opts.webpackConfig
            || upath.join(process.cwd(), "webpack.config.js"));
        info(`[GBM:WebpackPlugin] webpackConfig=${configFile}`);

        // load configFile first, and then override with moduleOptions.webpack
        let wpOpts = merge(configFile ? require(configFile) : {}, rtb.moduleOptions.webpack);

        // override webpack entry file with conf.src
        if (rtb.conf.src) {
            if (is.Array(rtb.conf.src)) {
                let src: string[] = [];  // get absolute paths in array
                (rtb.conf.src as string[]).forEach((name) => src.push(resolve(name)));
                merge(wpOpts, { entry: src });
            }
            else
                merge(wpOpts, { entry: resolve(rtb.conf.src) });
        }

        // override webpack output settings with conf.dest and conf.outFile
        if (rtb.conf.dest) merge(wpOpts, { output: { path: rtb.conf.dest } });
        if (rtb.conf.outFile) merge(wpOpts, { output: { filename: rtb.conf.outFile } });
        if (!wpOpts.output || !wpOpts.output.filename) merge(wpOpts, { output: { filename: '[name].bundle.js' } });

        // sanitize options
        if (wpOpts.output.path) wpOpts.output.path = resolve(wpOpts.output.path);

        if (opts.printConfig) msg(`Webpack Config =`, wpOpts);
        const compiler = require('webpack')(wpOpts);
        return new Promise<void>((resolve, reject) => {
            compiler.hooks.done.tap("done", resolve);
            compiler.hooks.failed.tap("failed", reject);
            compiler.run((err: Error, stats: any) => {
                {
                    msg(stats.toString({ colors: true }));
                }
            });
        })
    }
}

export default WebpackPlugin;
