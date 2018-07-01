/**
 *  GPlugin - Plugin management systems
 */

import * as gulp from 'gulp';
import {Options} from './types';
import {GBuilder} from './builder';
import {toPromise, is, SpawnOptions, info, msg, warn} from '../utils/utils';
import {exec, spawn} from "../utils/process";

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
    // title = `[debugPlugin${title ? ':' + title : ''}]`;
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
      if (options.verbose) info('[concatPlugin] Missing conf.outFile. No output generated.');
      return;
    }

    let opts = Object.assign({}, builder.moduleOptions.concat, options.concat);
    builder.pipe(require('gulp-concat')(outFile, opts.concat));
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
      if (options.verbose) msg(`[copyPlugin] copying: [${target.src}] => ${target.dest}`);
      promiseQ.push(toPromise(gulp.src(target.src).pipe(gulp.dest(target.dest))));
    }
    return Promise.all(promiseQ).then(()=>Promise.resolve());
  }

  static clean(builder:GBuilder, options:Options={}) {
    let clean1 = builder.conf.clean || [];
    let clean2 = options.clean || [];
    if (clean1 && is.String(clean1)) clean1 = [clean1 as string];
    if (clean2 && is.String(clean2)) clean2 = [clean2 as string];
    let cleanList = (<string[]>[]).concat(clean1 as string[], clean2 as string[]);

    // check rename option
    const delOpts = Object.assign({}, builder.moduleOptions.del, options.del);

    if (!options.silent) msg('Deleting:', cleanList);
    return require("del")(cleanList, delOpts);
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
    const rename = Object.assign({}, builder.moduleOptions.rename, options.rename);
    if (!rename.extname) rename.extname = '.min.js';
    builder.pipe(require('gulp-rename')(rename));
  }

  static cssnano(builder: GBuilder, options: Options={}) {
    warn('[GBM:Plugin] DeprecationWarning: cssnano is deprecated. please use cssclean instead.');
    // check for filter option (to remove .map files, etc.)
    const filter = options.filter || ['**', '!**/*.map'];
    builder.pipe(require('gulp-filter')(filter));

    // minify
    const cssnano = Object.assign({}, builder.moduleOptions.cssnano, options.cssnano);
    builder.pipe(require('gulp-cssnano')(cssnano));

    // check rename option
    const rename = Object.assign({}, builder.moduleOptions.cssnano, options.rename);
    if (!rename.extname) rename.extname = '.min.css';
    builder.pipe(require('gulp-rename')(rename));
  }

  static cleancss(builder: GBuilder, options: Options={}) {
    // check for filter option (to remove .map files, etc.)
    const filter = options.filter || ['**', '!**/*.map'];
    builder.pipe(require('gulp-filter')(filter));

    // minify
    const cleancssOpts = Object.assign({}, builder.moduleOptions.cleancss, options.cleancss);
    if (builder.buildOptions.postcss === false) {   // default true
      builder.pipe(require('gulp-clean-css')(cleancssOpts));
    }
    else {
      let postcss = require('gulp-postcss');
      builder.pipe(postcss([require('postcss-clean')(cleancssOpts)]));
    }

    // check rename option
    const rename = Object.assign({}, builder.moduleOptions.cssnano, options.rename);
    if (!rename.extname) rename.extname = '.min.css';
    builder.pipe(require('gulp-rename')(rename));
  }

  static spawn(builder: GBuilder, cmd: string, args: string[]=[], options: SpawnOptions={}) {
    return spawn(cmd, args, options);
  }

  static exec(builder: GBuilder, cmd: string, args: string[]=[], options: SpawnOptions={}) {
    return exec(cmd, args, options);
  }
}
