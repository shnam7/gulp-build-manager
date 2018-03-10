/**
 *  gbm Plugin - Twig
 */

import {BuildConfig, GulpStream, Options, Slot} from "../core/types";
import {GPlugin} from "../core/plugin";
import {GBuilder} from "../core/builder";

export class MarkdownPlugin extends GPlugin {
  constructor(options:Options={}, slots: Slot|Slot[]='build') { super(options, slots); }

  OnStream(stream:GulpStream, mopts:Options, conf:BuildConfig, slot:Slot, builder:GBuilder) {
    const opts = conf.buildOptions || {};
    const minify = this.options.minify || opts.minify;
    const prettify = this.options.prettify || opts.prettify;

    stream = stream.pipe(require('gulp-markdown')(this.options.twig || mopts.markdown));
    if (minify) stream = stream.pipe(require('gulp-htmlclean')(this.options.htmlmin || mopts.htmlmin));
    if (prettify) stream = stream.pipe(require('gulp-html-prettify')(this.options.htmlPrettify || mopts.htmlPrettify));
    return stream;
  }
}

export default MarkdownPlugin;