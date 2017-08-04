/**
 *  GPlugin - Plugin management systems
 */

'use strict';
import is from '../utils/is';

export default class GPlugin {
  /**
   *
   * @param options:Object={}, is plugin options
   * @param slots, string || [], is callback locations in build process. one or array of :'initStream, build, 'dest'
   */
  constructor(options = {}, slots='build') {
    this.options = options || {};
    this.slots = is.String(slots) ? [slots] : slots;
  }

  get className() { return this.constructor.name; }

  processPlugin(stream, mopts, conf, slot, builder) {
    if (!stream || this.slots.indexOf(slot) === -1) return stream;
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
  process(stream, mopts, conf, slot, builder) { return stream; }


  static addPlugins(pluginList, plugins) {
    // filter invalid plugin entries
    if (is.Array(plugins))
      return pluginList.concat(plugins.filter(el=>el && !(el.constructor.name==='NullPlugin')));
    if (plugins) pluginList.push(plugins);
    return pluginList;
  }

  static processPlugins(plugins, stream, mopts, conf, slot, builder) {
    if (!stream || plugins.length<=0) return stream;

    for (let plugin of plugins) {
      if (plugin instanceof GPlugin)
        stream = plugin.processPlugin(stream, mopts, conf, slot, builder);
      else if (is.Function(plugin) && slot==='build')
        stream = plugin(stream, mopts, conf, slot, builder);
      else if (plugin && plugin[slot])
        stream = plugin[slot](stream, mopts, conf, slot, builder);
    }
    return stream;
  }

  static initSourceMaps(stream, buildOptions={}, mopts={}) {
    if (buildOptions.sourceMap) {
      const smOpts = mopts.sourcemaps || {};
      stream = stream.pipe(require('gulp-sourcemaps').init(smOpts.init));
    }
    return stream;
  }
  static processSourceMaps(stream, pluginOptions={}, buildOptions={}, mopts={}) {
    const sourceMap = pluginOptions.sourceMap || buildOptions.sourceMap;
    const smOpts = pluginOptions.sourcemaps || mopts.sourcemaps || {};
    if (sourceMap) stream = stream.pipe(require('gulp-sourcemaps').write(smOpts.dest || '.', smOpts.write));
    return stream;
  }
}
module.export = GPlugin;
