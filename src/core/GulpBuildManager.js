/**
 * Gulp Build Manager
 *
 * @package gulp-build-manager
 * @author Robin Soo-hyuk Nam
 * @date Mar 19, 2017
 *
 */

'use strict';
import buildSet from '../buildset';
import GWatcher from './GWatcher';
import gulp from 'gulp';
import is from '../utils/is';
import path from 'path';
import del from 'del';
import merge from 'lodash.merge';


export default class GulpBuildManager {
  constructor() {
    this._defaultModuleOptions = {
      gulp: {sourcemaps:true},

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
        noImplicitAny: true
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

      twig: {},

      htmlPrettify: {
        indent_char: ' ',
        indent_size: 4
      },

      marked: {},

      del: {},

      livereload: {}
    };
    this._watcher = new GWatcher();
  }

  loadBuilders(config) {
    let basePath = "";
    if (is.String(config)) {
      basePath = path.dirname(config);
      config = require(path.join(process.cwd(), config))
    }

    this._watcher.setOptions(config.systemBuilds.watch);

    // console.log(path.join(process.cwd(), config));
    if (config.moduleOptions) merge(this._defaultModuleOptions, config.moduleOptions);
    for (let buildItem of config.builds) {
      let bs = buildSet(require(path.join(process.cwd(), basePath, buildItem)));
      let customBuildDir = path.join(basePath, config.customBuilderDir);
      // console.log(bs, customBuildDir, basePath);
      bs.resolve(customBuildDir, this._defaultModuleOptions, this._watcher);
    }

    let sysBuilds = config.systemBuilds.build;
    if (sysBuilds) gulp.task('@build', buildSet(sysBuilds).resolve(), (done)=>done());

    let clean = config.systemBuilds.clean;
    if (clean) {
      gulp.task('@clean', (done)=>{
        del(clean, this._defaultModuleOptions.del).then(()=>done());
      });
    }

    let defaultBuild = config.systemBuilds.default;
    if (defaultBuild) gulp.task('@default', buildSet(defaultBuild).resolve(), (done)=>done());

    if (config.systemBuilds.watch) gulp.task('@watch', (done)=>{this.watch(); done()});
  }

  watch() { this._watcher.watch(); }
}