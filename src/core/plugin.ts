/**
 *  GPlugin - Plugin management systems
 */

import * as gulp from 'gulp';
import * as path from 'path';
import {Options} from './types';
import {GBuilder} from './builder';
import {toPromise, pick} from '../utils/utils';
import {exec, ProcessOutput} from "../utils/process";

export class GPlugin {
  constructor(public options: Options = {}) {}

  /**
   * Main routine of the plugin.
   *
   * @param {GBuilder} builder is a GBuilder object currently calling the plugin function
   * @param {args} args plugin specific arguments.
   * @returns void or Promise<any>. If Promise is returned, it weill be awaited by the builder
   */
  process(builder: GBuilder, ...args: any[]): void | Promise<any> {}


  /***** Ready-made plugin functions *****/

  static debug(builder: GBuilder, options: Options={}) {
    let title = options.title ? options.title : '';
    title = `[debugPlugin${title ? ':' + title : ''}]`;
    let opts = Object.assign({}, builder.moduleOptions.debug, options, {title});
    builder.pipe(require('gulp-debug')(opts));
    return toPromise(builder.stream);
  }

  static filter(builder: GBuilder, pattern:string[], options: Options={}) {
    let opts = Object.assign({}, builder.moduleOptions.filter, options);
    builder.pipe(require('gulp-filter')(pattern, opts))
  }

  static concat(builder: GBuilder, options: Options = {}) {
    // check for filter option (to remove .map files, etc.)
    const filter = options.filter || ['**', '!**/*.map'];
    if (filter) builder.pipe(require('gulp-filter')(filter));

    const outFile = options.outFile || builder.conf.outFile;
    if (!outFile) {
      if (options.verbose) console.log('[concatPlugin] Missing conf.outFile. No output generated.');
      return;
    }

    let opts = Object.assign({}, builder.moduleOptions.concat, options.concat);
    builder.pipe(require('gulp-concat')(outFile, opts.concat)).sourceMaps();
  }

  static rename(builder: GBuilder, options: Options={}) {
    let opts = Object.assign({}, builder.moduleOptions.concat, options.concat || options);
    builder.pipe(require('gulp-rename')(opts))
  }

  /**
   * Copy files supporting multiple src/dest pairs
   *  {
   *    src: ['*.txt'],
   *    dest: './text',
   *    targets: [
   *      {src: ['*.js'], dest: './js'},
   *      {src: ['*.ts'], dest: './ts'}
   *      //...
   *    ]
   *  }
   */
  static copy(builder:GBuilder, options:Options={}) {
    let targets = [];
    if (options.src && options.dest)
      targets.unshift({src: options.src, dest: options.dest});
    if (options.targets) targets = targets.concat(options.targets);

    let promiseQ: Promise<any>[] = [];
    for (const target of targets) {
      console.log(`[copyPlugin] copying: [${target.src}] => ${target.dest}`);
      promiseQ.push(toPromise(gulp.src(target.src).pipe(gulp.dest(target.dest))));
    }
    return Promise.all(promiseQ).then(()=>Promise.resolve());
  }

  // minify javascripts
  static uglify(builder: GBuilder, options: Options={}) {
    // check for filter option (to remove .map files, etc.)
    const filter = options.filter || ['**', '!**/*.{map,d.ts}'];
    builder.pipe(require('gulp-filter')(filter));

    // minify
    const uglifyES = Object.assign({}, builder.moduleOptions.uglifyES, options.uglifyES);
    builder.pipe(require('gulp-uglify-es').default(uglifyES));

    // check rename option
    const rename = Object.assign({}, builder.moduleOptions.cssnano, options.rename);
    if (!rename.extname) rename.extname = '.min.js';
    builder.pipe(require('gulp-rename')(rename)).sourceMaps(builder);
  }

  static cssnano(builder: GBuilder, options: Options={}) {
    // check for filter option (to remove .map files, etc.)
    const filter = options.filter || ['**', '!**/*.map'];
    builder.pipe(require('gulp-filter')(filter));

    // minify
    const cssnano = Object.assign({}, builder.moduleOptions.cssnano, options.cssnano);
    builder.pipe(require('gulp-cssnano')(cssnano));

    // check rename option
    const rename = Object.assign({}, builder.moduleOptions.cssnano, options.rename);
    if (!rename.extname) rename.extname = '.min.css';
    builder.pipe(require('gulp-rename')(rename)).sourceMaps(builder);
  }

  static exec(builder: GBuilder, cmd: string, args: string[]=[], options: Options={}) {
    return exec(cmd, args, options);
  }
}
