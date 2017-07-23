/**
 *  gbm Plugin - Twig
 */

import GPlugin from '../core/GPlugin';

export default class TwigPlugin extends GPlugin {
  constructor(options={}, slots='build') { super(options, slots); }

  process(stream, mopts, conf, slot) {
    const opts = conf.buildOptions || {};
    const minify = this.options.minify || opts.minify;
    const prettify = this.options.prettify || opts.prettify;

    stream = stream.pipe(require('gulp-twig')(this.options.twig || mopts.twig));
    if (minify) stream = stream.pipe(require('gulp-htmlclean')(this.htmlmin || mopts.htmlmin));
    if (prettify) stream = stream.pipe(require('gulp-html-prettify')(this.options.htmlPrettify || mopts.htmlPrettify));
    return stream;
  }
}
module.exports = TwigPlugin;
