/**
 * Gulp Build Manager
 *
 * @package gulp-build-manager
 * @author Robin Soo-hyuk Nam
 * @date Mar 19, 2017
 *
 */

import * as gulp from 'gulp';
import * as upath from 'upath';
import {deepmerge, is} from './utils';
import {GWatcher} from './watcher';
import {GCleaner} from './cleaner';
import {GBuildSet} from "./buildSet";
import {Options} from "./types";

let defaultModuleOptions = {
  gulp: {},

  changed: {
    // hasChanged: require('gulp-changed').compareSha1Digest
  },

  sass: {
    outputStyle: 'compact',
    // outputStyle: 'compressed',
    includePaths: []
  },

  compass: {
    config_file: './config.rb',
    css: 'css',
    sass: 'assets/scss'
  },

  autoprefixer: {
    browsers: ['last 2 versions', '> 5%']
    // browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3']
  },

  cssnano: {discardUnused: false},

  coffeescript: {
    // {bare:true},
  },

  typescript: {},

  // babel: {presets:["env"]},

  imagemin: {
    progressive: true,
    optimizationLevel: 5
  },

  panini: {
    root: 'docs/pages/',
    layouts: 'docs/layouts/',
    partials: 'docs/partials/',
    data: 'docs/data/',
    helpers: 'docs/helpers/'
  },

  htmlPrettify: {
    indent_char: ' ',
    indent_size: 4
  },

  eslint: {"extends": "eslint:recommended", "rules": {"strict": 1}},

  del: {}
};

const watcher = new GWatcher();
const cleaner = new GCleaner();

export function parallel(...args:any[]) { return new GBuildSet(...args); }
export function series(...args:any[]) { return [...args]; }

export class GBuildManager {
  constructor(config: Options) {
    if (config) GBuildManager.loadBuilders(config);
  }

  static get defaultModuleOptions() { return defaultModuleOptions; }
  static get cleaner() { return cleaner; }
  static get watcher() { return watcher; }

  // static get loadBuilderClass() { return loadBuilderClass; }
  // static get parallel() { return parallel; }
  // static get series() { return series; }

  static loadBuilders(config:string | Options) {
    let basePath = "";
    if (is.String(config)) {
      basePath = upath.dirname(config as string);
      config = require(upath.join(process.cwd(), config))
    }

    config = config as Options;
    let customBuildDir = upath.join(basePath, config.customBuilderDir || "");

    if (config.moduleOptions) defaultModuleOptions = deepmerge(defaultModuleOptions, config.moduleOptions);

    // add system level clean here, so that build definitions can overload it later.
    if (config.systemBuilds && config.systemBuilds.clean)
      cleaner.add(config.systemBuilds.clean);

    if (config.builds) {
      const builds = is.Array(config.builds) ? config.builds : [config.builds];
      for (let buildItem of builds) {
        if (is.String(buildItem)) buildItem = require(upath.join(process.cwd(), basePath, buildItem));
        let bs = new GBuildSet(buildItem);
        bs.resolve(customBuildDir, defaultModuleOptions, watcher, cleaner);
      }
    }

    if (config.systemBuilds) {
      let mopts = Object.assign({}, defaultModuleOptions, config.systemBuilds.moduleOptions);
      let sysBuilds = config.systemBuilds.build;
      if (sysBuilds) {
        gulp.task('@build', gulp.parallel(new GBuildSet(sysBuilds).resolve(
          customBuildDir, mopts, watcher, cleaner)));
      }
      cleaner.createTask(mopts.del);
      watcher.createTask(Object.assign({}, {livereload: mopts.livereload}, config.systemBuilds.watch));
      let defaultBuild = config.systemBuilds.default;
      if (defaultBuild) {
        gulp.task('default', gulp.parallel(new GBuildSet(defaultBuild).resolve(
          customBuildDir, mopts, watcher, cleaner)));
      }
    }
  }
}