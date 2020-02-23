/**
 *  Builder Base Class
 */

import { Options, GulpTaskFunction } from "./common";
import { WatchItem } from "./watcher";
import { CleanTarget } from "./cleaner";
import { GPlugin } from './plugin';
import { ExternalCommand } from "../utils/utils";
import { RTB } from "./rtb";

export type TaskDoneFunction = (error?: any) => void;
export type Plugin = FunctionBuilder | GPlugin;


//--- Named Builders
export type GBuilderClassName = string;
export type BuildName = string;
export type NamedBuilders = GBuilderClassName | BuildName;

//--- Function Builders
export type FunctionBuilder = (rtb: RTB, ...args: any[]) => void | Promise<unknown>
export type FunctionObjectBuilder = { func: FunctionBuilder; args: any[] }
export type FunctionBuilders = FunctionBuilder | FunctionObjectBuilder;

//--- Object Builders
export interface ExternalBuilder extends ExternalCommand { }

export interface CopyBuilder {
    command: 'copy',
    target?: CopyParam | CopyParam[],
    options?: Options
}
export type CopyParam = { src: string | string[], dest: string };

export type ObjectBuilders = CopyBuilder | ExternalBuilder;

//--- GBuilder
export class GBuilder extends RTB {
    constructor(conf?: BuildConfig, func?: FunctionBuilder) {
        super(conf, func);
    }
}

//--- Combined Builders Type
export type Builders = NamedBuilders | FunctionBuilders | ObjectBuilders | GBuilder;


//--- Build Config
export interface BuildConfig {
    buildName: string;    // mandatory
    builder?: Builders;
    src?: string | string[];
    order?: string[];
    dest?: string;
    outFile?: string;
    sync?: boolean,
    verbose?: boolean,
    flushStream?: boolean;
    clean?: CleanTarget;
    watch?: WatchItem;
    preBuild?: FunctionBuilders;
    postBuild?: FunctionBuilders;
    dependencies?: BuildSet;
    triggers?: BuildSet;
    buildOptions?: Options;
    moduleOptions?: Options;
}

//--- BuildSet
export type BuildSet = BuildName | GulpTaskFunction | BuildConfig | BuildSetSeries | BuildSetParallel;
export type BuildSetSeries = BuildSet[];
export type BuildSetParallel = { set: BuildSet[] };
