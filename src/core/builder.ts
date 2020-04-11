/**
 *  Builder Base Class
 */

import { Options, GulpTaskFunction } from "./common";
import { ExternalCommand, warn } from "../utils/utils";
import { RTB } from "./rtb";

export type TaskDoneFunction = (error?: any) => void;
export type BuildName = string;


//--- Named Builders
export type GBuilderClassName = string;

//--- Function Builders
export type FunctionBuilder = (rtb: RTB, ...args: any[]) => void | Promise<unknown>;

//--- Object Builders
export interface ExternalBuilder extends ExternalCommand { }

//--- GBuilder
export class GBuilder extends RTB {
    constructor(conf?: BuildConfig) {
        super(conf || { buildName: '' });
    }

    protected build(): void | Promise<unknown> {}
}

//--- Combined Builders Type
export type Builders = GBuilderClassName | FunctionBuilder | ExternalBuilder | GBuilder;


//--- Build Config
export interface BuildConfig {
    buildName: string;              // mandatory
    builder?: Builders;             // main build operations in various form: function, object, class, etc
    src?: string | string[];
    dest?: string;
    outFile?: string;
    order?: string[];               // input file(src) ordering
    flushStream?: boolean;          // finish all the output streams before exiting gulp task
    sync?: boolean,                 // serialize each build execution steps
    verbose?: boolean,              // print verbose messages
    silent?: boolean,               // depress informative messages
    preBuild?: FunctionBuilder;    // function to be executed before BuildConfig.builder
    postBuild?: FunctionBuilder;   // function to be executed after BuildConfig.builder
    buildOptions?: Options;         // buildConfig instance specific custom options
    moduleOptions?: Options;        // gulp module options
    dependencies?: BuildSet;        // buildSet to be executed before this build task
    triggers?: BuildSet;            // buildSet to be executed after this build task
    watch?: string | string[];      // override default watch, 'src' if defined
    addWatch?: string | string[];   // additional watch in addition to watch or default watch
    reloadOnChange?: boolean;       // Reload on change when watcher is running. default is true.
    reloadOnFinish?: boolean;       // reload on finishing all the build operations. default is false.
    clean?: string | string[];      // clean targets
}

//--- BuildSet
export type BuildSet = BuildName | GulpTaskFunction | BuildConfig | BuildSetSeries | BuildSetParallel;
export type BuildSetSeries = BuildSet[];
export type BuildSetParallel = { set: BuildSet[] };



//--- GTrasnpiler
export class GTranspiler extends GBuilder {
    constructor(conf?: BuildConfig) { super(conf); }

    protected onTranspile() { return this; }
    protected onMinify() { return this; }

    protected build() {
        const opts = this.buildOptions;

        this.src().onTranspile();

        // sanity check for options
        if (!this.conf.outFile && opts.outFileOnly)
            warn('GBM: outFileOnly option requires valid outFile value.');

        // evaluate options
        const concat = !!this.conf.outFile;
        const concatOnly = concat && opts.outFileOnly !== false;

        // concat stream
        if (concat) {
            this.pushStream().concat();
            if (!opts.minifyOnly) this.dest();      // concat non-minified
            if (opts.minify || opts.minifyOnly) this.onMinify().dest();  // concat minified
            this.popStream();
        }

        // non-concat
        if (!concat || !concatOnly) {
            if (!opts.minifyOnly) this.dest();      // concat non-minified
            if (opts.minify || opts.minifyOnly) this.onMinify().dest();  // concat minified
        }
    }
}
