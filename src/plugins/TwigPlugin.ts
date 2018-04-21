/**
 *  gbm Plugin - Twig
 */

import {Options} from "../core/types";
import {GBuilder} from "../core/builder";
import {GPlugin} from "../core/plugin";

export class TwigPlugin extends GPlugin {
  constructor(options:Options={}) { super(options); }

  process(builder: GBuilder) {
    builder.pipe(require('gulp-twig')(builder.moduleOptions.twig));
    if (builder.buildOptions.minify) builder.pipe(require('gulp-htmlclean')(builder.moduleOptions.htmlmin));
    if (builder.buildOptions.prettify) builder.pipe(require('gulp-html-prettify')(builder.moduleOptions.htmlPrettify));
  }
}

export default TwigPlugin;
