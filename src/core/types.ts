import {GBuilder} from "./builder";
import {GPlugin} from "./plugin";

export type GulpStream = NodeJS.ReadWriteStream;
export type Stream = GulpStream | undefined;
export type Options = { [key: string]: any; }
export type Slot = 'initStream' | 'build' | 'dest' | 'postBuild';
export type TaskDoneFunction = (error?: any) => void;

// Plugin types
export type PluginFunction = (stream:Stream, mopts:Options, conf:Options, slot:Slot, builder:GBuilder) => Stream;
export interface PluginObject {
  initStream?: PluginFunction;
  build?: PluginFunction;
  dest?: PluginFunction;
  postBuild?: PluginFunction;
}
export type Plugin = PluginFunction | PluginObject | GPlugin | undefined;
