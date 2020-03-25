/**
 *  GPlugin - Plugin management systems
 */

import { Options } from './common';
import { RTB } from './rtb';
import { FunctionBuilder } from './builder';

export type Plugin = FunctionBuilder | GPlugin;

export class GPlugin {
    constructor(public options: Options = {}) { }

    process(rtb: RTB, ...args: any[]): Promise<unknown> | void {}
}
