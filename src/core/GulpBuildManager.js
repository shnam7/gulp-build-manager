/**
 * Gulp Build Manager
 *
 * @package gulp-build-manager
 * @author Robin Soo-hyuk Nam
 * @date Mar 19, 2017
 *
 */

'use strict';
import buildSet from '../buildSet';
import GWatcher from './GWatcher';
import GCleaner from './GCleaner';
import gulp from 'gulp';
import is from '../utils/is';
import upath from 'upath';
import merge from 'lodash.merge';

export default class GulpBuildManager {
  constructor() {
    this._defaultModuleOptions = {
      gulp: { sourcemaps:true },

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

      cssnano: {
        discardUnused: false
      },

      coffeescript: {
        // {bare:true},
      },

      typescript: {
      },

      babel: {
        presets: ["es2015", "es2016", "es2017"]
      },

      uglify: {       // minified JS Settings
        // mangle           : false
      },

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

      del: {}
    };
    this._watcher = new GWatcher();
    this._cleaner = new GCleaner();
  }

  loadBuilders(config) {
    let basePath = "";
    if (is.String(config)) {
      basePath = upath.dirname(config);
      config = require(upath.join(process.cwd(), config))
    }

    if (config.moduleOptions) merge(this._defaultModuleOptions, config.moduleOptions);

    // add system level clean here, so that build definitions can overload it later.
    if (config.systemBuilds && config.systemBuilds.clean)
      this._cleaner.add(config.systemBuilds.clean);

    if (config.builds) {
      for (let buildItem of config.builds) {
        if (is.String(buildItem)) buildItem = require(upath.join(process.cwd(), basePath, buildItem));
        let bs = buildSet(buildItem);
        let customBuildDir = upath.join(basePath, config.customBuilderDir || "");
        bs.resolve(customBuildDir, this._defaultModuleOptions, this._watcher, this._cleaner);
      }
    }

    if (config.systemBuilds) {
      let sysBuilds = config.systemBuilds.build;
      if (sysBuilds) gulp.task('@build', gulp.parallel(buildSet(sysBuilds).resolve()), (done)=>done());
      this._cleaner.createTask(this._defaultModuleOptions.del);
      this._watcher.createTask(config.systemBuilds.watch);
      let defaultBuild = config.systemBuilds.default;
      if (defaultBuild) gulp.task('default', gulp.parallel(buildSet(defaultBuild).resolve()), (done)=>done());
    }
  }
}
