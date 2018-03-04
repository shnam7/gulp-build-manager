/**
 *  GPlugin - Plugin management systems
 */


import {is} from './utils';
import {Options, Plugin, PluginFunction, PluginObject, Slot, Stream} from "./types";
import {GBuilder} from "./builder";

export class GPlugin {
  options: Options;
  slots: Slot[];

  /**
   *
   * @param options:Object={}, is plugin options
   * @param slots, string || [], is callback locations in build process. one or array of :'initStream, build, 'dest'
   */
  constructor(options:Options = {}, slots:Slot | Slot[]='build') {
    this.options = options;
    this.slots = is.String(slots) ? [slots as Slot] : slots as Slot[];
  }

  get className() { return this.constructor.name; }

  processPlugin(stream:Stream, mopts:Options, conf:Options, slot:Slot, builder:GBuilder) {
    // if (!stream || this.slots.indexOf(slot) === -1) return stream;
    if (this.slots.indexOf(slot) === -1) return stream;
    stream = this.process(stream, mopts, conf, slot, builder);
    return GPlugin.processSourceMaps(stream, this.options, conf.buildOptions, mopts);
  }

  /**
   *
   * @param stream is input stream to be processed, which has been created by gulp.src()
   * @param mopts is moduleOptions property of build definition object
   * @param conf is build definition object
   * @param slot is the callback location name currently activated
   * @returns {*} stream
   */
  process(stream:Stream, mopts:Options, conf:Options, slot:Slot, builder:GBuilder) { return stream; }


  static addPlugins(pluginList: Plugin[], plugins:Plugin | Plugin[]) {
    // filter invalid plugin entries
    if (is.Array(plugins))
      return pluginList.concat((plugins as Plugin[]).filter(el=>el && !(el.constructor.name==='NullPlugin')));
    if (plugins) pluginList.push(plugins as Plugin);
    return pluginList;
  }

  static processPlugins(plugins:Plugin[], stream:Stream, mopts:Options, conf:Options, slot:Slot, builder:GBuilder) {
    // if (!stream || plugins.length<=0) return stream;
    if (plugins.length<=0) return stream;

    for (let plugin of plugins) {
      if (plugin instanceof GPlugin)
        stream = plugin.processPlugin(stream, mopts, conf, slot, builder);
      else if (is.Function(plugin) && slot==='build')
        stream = (plugin as PluginFunction)(stream, mopts, conf, slot, builder);
      else {
        let func = (plugin as PluginObject)[slot];
        if (func) stream = func(stream, mopts, conf, slot, builder);
      }
    }
    return stream;
  }

  static initSourceMaps(stream:Stream, buildOptions:Options={}, mopts:Options={}) {
    if (buildOptions.sourceMap && stream) {
      const smOpts = mopts.sourcemaps || {};
      stream = stream.pipe(require('gulp-sourcemaps').init(smOpts.init));
    }
    return stream;
  }
  static processSourceMaps(stream:Stream, pluginOptions:Options={}, buildOptions:Options={}, mopts:Options={}) {
    const sourceMap = pluginOptions.sourceMap || buildOptions.sourceMap;
    const smOpts = pluginOptions.sourcemaps || mopts.sourcemaps || {};
    if (sourceMap && stream) stream = stream.pipe(require('gulp-sourcemaps').write(smOpts.dest || '.', smOpts.write));
    return stream;
  }
}