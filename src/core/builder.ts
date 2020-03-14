/**
 *  Builder Base Class
 */

import { Options, GulpTaskFunction } from "./common";
import { GPlugin } from './plugin';
import { ExternalCommand } from "../utils/utils";
import { RTB } from "./rtb";

export type TaskDoneFunction = (error?: any) => void;
export type Plugin = FunctionBuilder | GPlugin;
export type BuildName = string;


//--- Named Builders
export type GBuilderClassName = string;
export type NamedBuilders = GBuilderClassName;

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
    constructor(conf?: BuildConfig) {
        super(conf || { buildName: '' });
    }

    protected build(): void | Promise<unknown> {}
}

//--- Combined Builders Type
export type Builders = NamedBuilders | FunctionBuilders | ObjectBuilders | GBuilder;


//--- Build Config
export interface BuildConfig {
    buildName: string;          // mandatory
    builder?: Builders;
    src?: string | string[];
    dest?: string;
    outFile?: string;
    order?: string[];           // input file(src) ordering
    flushStream?: boolean;      // finish all the output streams before exiting gulp task
    sync?: boolean,             // serialize each build execution steps
    verbose?: boolean,          // print verbose messages
    silent?: boolean,           // depress informative messages
    preBuild?: FunctionBuilders;
    postBuild?: FunctionBuilders;
    buildOptions?: Options;     // buildConfig instance specific custom options
    moduleOptions?: Options;    // gulp module options
    dependencies?: BuildSet;    // buildSet to be executed before this build task
    triggers?: BuildSet;        // buildSet to be executed after this build task
    watch?: string | string[];  // override default watch, 'src' if defined
    addWatch?: string | string[];   // additional watch in addition to watch or default watch
    reloadOnFinish?: boolean;
    clean?: string | string[];
}

//--- BuildSet
export type BuildSet = BuildName | GulpTaskFunction | BuildConfig | BuildSetSeries | BuildSetParallel;
export type BuildSetSeries = BuildSet[];
export type BuildSetParallel = { set: BuildSet[] };
