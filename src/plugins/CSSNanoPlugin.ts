/**
 *  gbm Plugin - CSSNano
 */
import {Options, Slot, Stream} from "../core/types";
import {GBuilder} from "../core/builder";
import {GPlugin} from "../core/plugin";
import ChangedPlugin from "./ChangedPlugin";

export class CSSNanoPlugin extends GPlugin {
  constructor(options:Options={}, slots: Slot|Slot[]='build') { super(options, slots); }

  process(stream:Stream, mopts:Options, conf:Options, slot:Slot, builder:GBuilder) {
    const opts = conf.buildOptions || {};
    const minitfy = this.options.minify || opts.minify;
    const minifyOnly = this.options.minifyOnly || opts.minifyOnly;
    if (!minitfy && !minifyOnly) return stream;

    // flush previous build results before minify
    if (!minifyOnly) stream = builder.dest(stream, mopts, conf);

    // check for filter option (to remove .map files, etc.)
    const filter = this.options.filter || ['**', '!**/*.map'];
    if (filter && stream) stream = stream.pipe(require('gulp-filter')(filter));

    // minify
    if (stream) stream = stream.pipe(require('gulp-cssnano')(this.options.cssnano || mopts.cssnano));

    // check rename option
    if (stream) stream.pipe(require('gulp-rename')(this.options.rename || {extname:'.min.css'}));
    return stream;
  }
}

export default CSSNanoPlugin;
