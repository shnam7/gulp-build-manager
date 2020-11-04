/**
 *  Builder Base Class
 */

import { ExternalCommand, warn, Options, is } from "../utils/utils";
import { RTB, GulpTaskFunction, CleanOptions } from "./rtb";
import { ReloaderOptions } from "./reloader";

export type TaskDoneFunction = (error?: any) => void;
export type BuildName = string;
export type BuildNameSelector = string | string[] | RegExp | RegExp[];
export type BuildFunction = (rtb: RTB, ...args: any[]) => void | Promise<unknown>;

//--- BuilderType
export type BuilderClassName = string;
export type BuilderType = BuilderClassName | BuildFunction | ExternalCommand | GBuilder | 'cleaner' | 'watcher';

//--- BuildSet
export type BuildSet = BuildName | GulpTaskFunction | BuildItem | BuildSetSeries | BuildSetParallel;
export type BuildSetSeries = BuildSet[];
export type BuildSetParallel = { set: BuildSet[] };
export function series(...args: BuildSet[]): BuildSetSeries { return args }
export function parallel(...args: BuildSet[]): BuildSetParallel { return { set: args } }

//--- BuildItem
export type BuildItem = BuildConfig | WatcherConfig | CleanerConfig;
export type BuildItems = { [key: string]: BuildItem };

//--- BuildConfig
export interface BuildConfig {
    name: string;                   // build name, mandatory field
    builder?: BuilderType;          // main build operations in various form: function, object, class, etc
    src?: string | string[];        // source for build operation
    dest?: string;                  // output(destination) directory of the build operation
    order?: string[];               // input file(src) ordering
    outFile?: string;               // optional output file name
    preBuild?: BuildFunction;       // function to be executed before BuildConfig.builder
    postBuild?: BuildFunction;      // function to be executed after BuildConfig.builder
    buildOptions?: Options;         // buildConfig instance specific custom options
    moduleOptions?: Options;        // gulp module options
    dependencies?: BuildSet;        // buildSet to be executed before this build task
    triggers?: BuildSet;            // buildSet to be executed after this build task
    watch?: string | string[];      // override default watch, 'src' if defined
    addWatch?: string | string[];   // additional watch in addition to watch or default watch
    clean?: string | string[];      // clean targets
    flushStream?: boolean;          // finish all the output streams before exiting gulp task
    reloadOnChange?: boolean;       // Reload on change when watcher is running. default is true.
    verbose?: boolean,              // print verbose messages
    silent?: boolean,               // depress informative messages
    npmInstall?: string | string[]; // node packages to be installed by npm-auto-install option

    //--- obsolete
    buildName?: string;             // alias for name, for backward compatibility
}

//--- WatcherConfig (Watcher task config)
export interface WatcherConfig extends Pick<BuildConfig, "watch"> {
    name?: string;                  // optional buildName. if undefined, defaults to '@watch'
    builder: 'watcher',             // MUST be literal constant 'watcher'
    filter?: BuildNameSelector,     // filter for buildNames (inside the project) to be watched
    browserSync?: ReloaderOptions;  // browserSync initializer options
    livereload?: ReloaderOptions;   // livereload initializer options
}

//--- CleanerConfig (Cleaner task config)
export interface CleanerConfig extends Pick<BuildConfig, "clean">, CleanOptions {
    name?: string;                  // optional buildName. if undefined, defaults to '@clean'
    builder: 'cleaner',             // MUST be literal constant 'cleaner'
    filter?: BuildNameSelector,     // filter for buildNames (inside the project) to be cleaned
    sync?: boolean;                 // syncMode option. refer to class RTB.
}


//--- GBuilder
export class GBuilder extends RTB {
    constructor() { super();
    }

    protected build(): void | Promise<unknown> {
        if (this.conf.src && this.conf.dest) this.copy({src: this.conf.src, dest: this.conf.dest});
    }

    static isBuildItem(item: any) : boolean {
        return item.hasOwnProperty('name') && is.String(item.name)
            || item.hasOwnProperty('buildName') && is.String(item.buildName);
    }
}


//--- GTrasnpiler
export class GTranspiler extends GBuilder {
    constructor() { super(); }

    protected onTranspile() { return this; }
    protected onMinify() { return this; }

    protected build() {
        const opts = this.buildOptions;

        this.src().onTranspile();

        // sanity check for options
        if (!this.conf.outFile && opts.outFileOnly)
            warn('GTranspiler: outFileOnly option requires valid outFile value.');

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
