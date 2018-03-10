import {GBuilder} from "./builder";
import {GPlugin} from "./plugin";
import {GBuildSet} from "./buildSet";
import * as Undertaker from "undertaker";

export type GulpStream = NodeJS.ReadWriteStream;
export type Stream = GulpStream | undefined;
export type Options = { [key: string]: any; }
export type Slot = 'initStream' | 'build' | 'dest' | 'postBuild';
export type TaskDoneFunction = (error?: any) => void;
export type CleanTarget = string | string[];

// Plugin types
export type PluginFunction = (stream:Stream, mopts:Options, conf:Options, slot:Slot, builder:GBuilder) => Stream;

export interface PluginObject {
  initStream?: PluginFunction;
  build?: PluginFunction;
  dest?: PluginFunction;
  postBuild?: PluginFunction;
}

export type Plugin = PluginFunction | PluginObject | GPlugin | undefined;


/** BuildSet */
export type BuilderFuncion = (mopts:Options, conf:Options, done:TaskDoneFunction)=>void;

export interface BuildConfig {
  buildName: string;    // mandatory
  builder?: string | GBuilder;
  src?: string | string[];
  order?: string[];
  dest?: string;
  outFile?: string;
  outfile?: string;     // for backward compatibility
  flushStream?: boolean;
  plugins?: Plugin[];
  clean?: CleanTarget;
  watch?: WatchItem;
  dependencies?: BuildSet;
  triggers?: BuildSet;
  buildOptions?: Options;
  moduleOptions?: Options;
}

type BuildSetType = string | BuilderFuncion | BuildConfig | GBuildSet;
export type BuildSet = BuildSetType | BuildSetType[];


/** Watch */
export interface WatchItem {
  name: string;
  task: Undertaker.Task;
  watched: string[];
  watchedPlus?: string[];
  livereload?: boolean;
  browserSync?: boolean;
}

export interface WatchOptions {
  livereload?: Options;
  browserSync?: Options; // browserSync.Options is not used to remove unnecessary dependency when browserSync is not used
}


/** GBMConfig */
export interface GBMConfig {
  customBuilderDir?: string | string[];
  builds?: BuildSet[];
  systemBuilds?: {
    build?: BuildSet;
    clean?: CleanTarget;
    default?: BuildSet;
    watch?: WatchOptions;
    moduleOptions?: Options;
  },
  moduleOptions?: Options;    // value for defaultModuleOptions
}