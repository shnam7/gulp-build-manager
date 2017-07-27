/**
 * Gulp Build Manager
 *
 * @package gulp-build-manager
 * @author Robin Soo-hyuk Nam
 * @date Mar 19, 2017
 *
 */

import gulp from 'gulp';
import is from '../utils/is';
import upath from 'upath';
import merge from 'lodash.merge';
import GWatcher from './GWatcher';
import GCleaner from './GCleaner';
import GBuildSet from './GBuildSet';

const defaultModuleOptions = {
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

  babel: { presets:["es2015", "es2016", "es2017"]}
  ,

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

export function parallel(...args) { return new GBuildSet(...args); }
export function series(...args) { return [...args]; }

export default class GBuildManager {
  constructor(config) {
    if (config) GBuildManager.loadBuilders(config);
  }

  static get defaultModuleOptions() { return defaultModuleOptions; }
  static get cleaner() { return cleaner; }
  static get watcher() { return watcher; }

  // static get loadBuilderClass() { return loadBuilderClass; }
  // static get parallel() { return parallel; }
  // static get series() { return series; }

  static loadBuilders(config) {
    let basePath = "";
    if (is.String(config)) {
      basePath = upath.dirname(config);
      config = require(upath.join(process.cwd(), config))
    }
    let customBuildDir = upath.join(basePath, config.customBuilderDir || "");

    if (config.moduleOptions) merge(defaultModuleOptions, config.moduleOptions);

    // add system level clean here, so that build definitions can overload it later.
    if (config.systemBuilds && config.systemBuilds.clean)
      cleaner.add(config.systemBuilds.clean);

    if (config.builds) {
      for (let buildItem of config.builds) {
        if (is.String(buildItem)) buildItem = require(upath.join(process.cwd(), basePath, buildItem));
        let bs = new GBuildSet(buildItem);
        bs.resolve(customBuildDir, defaultModuleOptions, watcher, cleaner);
      }
    }

    if (config.systemBuilds) {
      let sysBuilds = config.systemBuilds.build;
      if (sysBuilds) {
        gulp.task('@build', gulp.parallel(new GBuildSet(sysBuilds).resolve(
          customBuildDir, defaultModuleOptions, watcher, cleaner)), (done) => done());
      }
      cleaner.createTask(defaultModuleOptions.del);
      watcher.createTask(config.systemBuilds.watch);
      let defaultBuild = config.systemBuilds.default;
      if (defaultBuild) {
        gulp.task('default', gulp.parallel(new GBuildSet(defaultBuild).resolve(
          customBuildDir, defaultModuleOptions, watcher, cleaner)), (done)=>done());
      }
    }
  }
}
module.exports = GBuildManager;
