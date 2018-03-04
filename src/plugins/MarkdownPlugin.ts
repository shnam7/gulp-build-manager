/**
 *  gbm Plugin - Twig
 */

import {Options, Slot, Stream} from "../core/types";
import {GPlugin} from "../core/plugin";
import {GBuilder} from "../core/builder";
import ChangedPlugin from "./ChangedPlugin";

export class MarkdownPlugin extends GPlugin {
  constructor(options:Options={}, slots: Slot|Slot[]='build') { super(options, slots); }

  process(stream:Stream, mopts:Options, conf:Options, slot:Slot, builder:GBuilder) {
    const opts = conf.buildOptions || {};
    const minify = this.options.minify || opts.minify;
    const prettify = this.options.prettify || opts.prettify;

    stream = stream && stream.pipe(require('gulp-markdown')(this.options.twig || mopts.markdown));
    if (minify && stream) stream = stream.pipe(require('gulp-htmlclean')(this.options.htmlmin || mopts.htmlmin));
    if (prettify && stream) stream = stream.pipe(require('gulp-html-prettify')(this.options.htmlPrettify || mopts.htmlPrettify));
    return stream;
  }
}

export default MarkdownPlugin;