/**
 *  GPlugin - Plugin management systems
 */

import { Options } from './common';
import { RTB } from './rtb';

export type PluginFunction = (rtb: RTB, ...args: any[]) => Promise<unknown> | void;
export type Plugins = PluginFunction | GPlugin;

export class GPlugin {
    constructor(public options: Options = {}) { }

    process(rtb: RTB, ...args: any[]): Promise<unknown> | void {}
}
