import {GBuilder} from "./builder";
import {GPlugin} from "./plugin";
import {GBuildSet} from "./buildSet";
import * as Undertaker from "undertaker";
import {ExecOptions} from "child_process";

export type GulpStream = NodeJS.ReadWriteStream;
export type Stream = GulpStream | undefined;
export type Options = { [key: string]: any; }
export type TaskDoneFunction = (error?: any) => void;
export type CleanTarget = string | string[];

export type BuildFunction = (builder: GBuilder, ...args: any[]) => void | Promise<any>
export type BuildFunctionObject = { func: BuildFunction; args: any[] }
export type Plugin = BuildFunction | GPlugin;

/** BuildSet */
export interface ExternalBuilder {
  command: string;
  args?: string[];
  options?: ExecOptions;
}

export interface BuildConfig {
  buildName: string;    // mandatory
  builder?: string | GBuilder | ExternalBuilder | BuildFunction;
  src?: string | string[];
  order?: string[];
  dest?: string;
  outFile?: string;
  outfile?: string;     // for backward compatibility
  copy?: {src:string|string[], dest: string}[],   // copy is to be done after postBuild
  flushStream?: boolean;
  clean?: CleanTarget;
  watch?: WatchItem;
  preBuild?: BuildFunction | BuildFunctionObject;
  postBuild?: BuildFunction | BuildFunctionObject;
  dependencies?: BuildSet;
  triggers?: BuildSet;
  buildOptions?: Options;
  moduleOptions?: Options;
}

type BuildSetType = string | BuildFunction | BuildConfig | GBuildSet;
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