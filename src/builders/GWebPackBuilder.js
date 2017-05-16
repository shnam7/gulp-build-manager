/**
 *  WebPack Builder
 */

'use strict';
import GBuilder from './GBuilder';
import webpack from 'webpack-stream';
import upath from 'upath';
import merge from 'lodash.merge';
import is from '../utils/is';

class GWebPackBuilder extends GBuilder {
  constructor() { super(); }

  OnInitStream(mopts, defaultModuleOptions, conf) {
    let opts = merge({}, mopts.webpack);
    if (conf.buildOptions)
      merge(opts, is.String(conf.buildOptions.webpack)
        ? require(upath.resolve(conf.buildOptions.webpack))
        : conf.buildOptions.webpack
      );
    if (conf.dest) merge(opts, {output:{path:upath.resolve(conf.dest)}});
    if (!conf.src) conf.src = opts.entry;
    if (!conf.dest) conf.dest = opts.output.path;
    mopts.webpack = opts;

    return super.OnInitStream(mopts, defaultModuleOptions, conf);
  }


  OnBuilderModuleOptions(mopts, defaultModuleOptions) {
    return this.pick(defaultModuleOptions, ['webpack']);
  }

  OnBuild(stream, mopts, conf) {
    return stream.pipe(webpack(mopts.webpack));
  }
}

export default GWebPackBuilder;
module.exports = GWebPackBuilder;
