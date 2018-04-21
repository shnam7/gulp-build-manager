/**
 *  gbm Plugin - Markdown
 */

import {Options} from "../core/types";
import {GPlugin} from "../core/plugin";
import {GBuilder} from "../core/builder";

export class MarkdownPlugin extends GPlugin {
  constructor(options:Options={}) { super(options); }

  process(builder: GBuilder) {
    builder.pipe(require('gulp-markdown')(builder.moduleOptions.markdown));
    if (builder.buildOptions.minify) builder.pipe(require('gulp-htmlclean')(builder.moduleOptions.htmlmin));
    if (builder.buildOptions.prettify) builder.pipe(require('gulp-html-prettify')(builder.moduleOptions.htmlPrettify));
  }
}

export default MarkdownPlugin;
