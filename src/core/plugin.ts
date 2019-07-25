/**
 *  GPlugin - Plugin management systems
 */

import * as gulp from 'gulp';
import {Options} from './types';
import {GBuilder} from './builder';
import {toPromise, is, SpawnOptions, msg, warn} from '../utils/utils';
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
  // tslint:disable-next-line: no-empty
  process(builder: GBuilder, ...args: any[]): void | Promise<any> {}


  /***** Ready-made plugin functions *****/

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
    const opts = Object.assign({}, builder.moduleOptions.uglifyES, options.uglifyES);
    builder.pipe(require('gulp-uglify-es').default(opts));
  }

  static cleancss(builder: GBuilder, options: Options={}) {
    warn('[GBM:Plugin] DeprecationWarning: cleancss() is deprecated. Use cleanCss() instead.');
    if (builder.moduleOptions.cleancss) {
      warn('[GBM:Plugin] DeprecationWarning: builder.moduleOptions.cleancss is deprecated.'
      + 'Use builder.moduleOptions.cleanCss instead.');
    }

    const optsOld = Object.assign({}, builder.moduleOptions.cleancss, options.cleancss || options);
    const opts = Object.assign({}, optsOld, builder.moduleOptions.cleanCss, options.cleanCss || options);
    builder.pipe(require('gulp-clean-css')(opts));
  }
  static cleanCss(builder: GBuilder, options: Options={}) {
    const opts = Object.assign({}, builder.moduleOptions.cleanCss, options.cleanCss || options);
    builder.pipe(require('gulp-clean-css')(opts));
  }


  static spawn(builder: GBuilder, cmd: string, args: string[]=[], options: SpawnOptions={}) {
    return spawn(cmd, args, options);
  }

  static exec(builder: GBuilder, cmd: string, args: string[]=[], options: SpawnOptions={}) {
    return exec(cmd, args, options);
  }


  /**----------------------------------------------------------------
   * Obsolete functions
   *----------------------------------------------------------------*/

  static debug(builder: GBuilder, options: Options={}) {
    warn('[GBM:Plugin] DeprecationWarning: debug() is deprecated. Use builder.debug() instead.');
    builder.debug(options);
  }

  static filter(builder: GBuilder, pattern:string[], options: Options={}) {
    warn('[GBM:Plugin] DeprecationWarning: filter() is deprecated. Use builder.filter() instead.');
    builder.filter(pattern, options);
  }

  static concat(builder: GBuilder, options: Options = {}) {
    warn('[GBM:Plugin] DeprecationWarning: concat() is deprecated. Use builder.concat() instead.');
    builder.concat(options);
  }

  static rename(builder: GBuilder, options: Options={}) {
    warn('[GBM:Plugin] DeprecationWarning: rename() is deprecated. Use builder.rename() instead.');
    builder.rename(options);
  }

  static cssnano(builder: GBuilder, options: Options={}) {
    // warn('[GBM:Plugin] DeprecationWarning: cssnano() is deprecated. Use cleanCss() instead.');

    // minify
    const cssnano = Object.assign({}, builder.moduleOptions.cssnano, options.cssnano);
    builder.pipe(require('gulp-cssnano')(cssnano));

    // check rename option
    const rename = Object.assign({}, builder.moduleOptions.cssnano, options.rename);
    if (!rename.extname) rename.extname = '.min.css';
    builder.pipe(require('gulp-rename')(rename));
  }
}
