/**
 *  Markdown Builder
 */

'use strict';
import GBuilder from './GBuilder';
import twig from 'gulp-twig';
import cleanHtml from 'gulp-cleanhtml';
import htmlPrettify from 'gulp-html-prettify';


class GTwigBuilder extends GBuilder {
  constructor() { super(); }

  OnBuilderModuleOptions(mopts, defaultModuleOptions) {
    return this.pick(defaultModuleOptions, ['twig', 'htmlPrettify']);
  }

  OnBuild(stream, mopts, conf) {
    return stream
      .pipe(twig(mopts.twig))
      .pipe(cleanHtml())
      .pipe(htmlPrettify(mopts.htmlPrettify))
  }
}

export default GTwigBuilder;
module.exports = GTwigBuilder;
