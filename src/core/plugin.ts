/**
 *  GPlugin - Plugin management systems
 */


import {is} from "./utils";
import {BuildConfig, GulpStream, Options, Slot, Stream} from "./types";
import {GBuilder} from "./builder";

export class GPlugin {
  options: Options;
  slots: Slot[];

  /**
   * @param options:Object={}, is plugin options
   * @param slots, string || [], is callback locations in build process. one or array of :'initStream, build, 'dest'
   */
  constructor(options:Options = {}, slots:Slot | Slot[]='build') {
    this.options = options;
    this.slots = is.String(slots) ? [slots as Slot] : slots as Slot[];
  }

  // get className() { return this.constructor.name; }

  processPlugin(stream:Stream, mopts:Options, conf:BuildConfig, slot:Slot, builder:GBuilder) {
    // if (!stream || this.slots.indexOf(slot) === -1) return stream;
    if (this.slots.indexOf(slot) === -1) return stream;
    stream = this.process(stream, mopts, conf, slot, builder);
    return builder.processSourceMaps(stream, this.options, conf.buildOptions, mopts);
  }

  /**
   * @param stream is input stream to be processed, which has been created by gulp.src()
   * @param mopts is moduleOptions property of build definition object
   * @param conf is build definition object
   * @param slot is the callback location name currently activated
   * @returns {*} stream
   */
  process(stream:Stream, mopts:Options, conf:BuildConfig, slot:Slot, builder:GBuilder) {
    return stream ? this.OnStream(stream, mopts, conf, slot, builder) : stream;
  }

  OnStream(stream:GulpStream, mopts:Options, conf:BuildConfig, slot:Slot, builder:GBuilder) { return stream; }
}