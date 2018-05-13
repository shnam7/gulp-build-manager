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
import {GWatcher} from './watcher';
import {GCleaner} from './cleaner';
import {GBuildSet} from "./buildSet";
import {BuildSet, GBMConfig, Options, WatchOptions} from "./types";
import {is} from "../utils/utils";

export class GBuildManager {
  watcher = new GWatcher();
  cleaner = new GCleaner();
  defaultModuleOptions: Options = {
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

    // babel: {presets:["env"]},

    imagemin: {
      progressive: true,
      optimizationLevel: 5
    },
    htmlPrettify: {
      indent_char: ' ',
      indent_size: 4
    },

    eslint: {"extends": "eslint:recommended", "rules": {"strict": 1}},
  };

  constructor(config?: GBMConfig) {
    if (config) this.loadBuilders(config);
  }

  loadBuilders(config:string | GBMConfig) {
    let basePath = "";
    if (is.String(config)) {
      basePath = upath.dirname(config as string);
      config = require(upath.join(process.cwd(), config as string))
    }

    config = config as Options;
    let customBuildDir = upath.join(basePath, config.customBuilderDir as string || "");

    if (config.moduleOptions) Object.assign(this.defaultModuleOptions, config.moduleOptions);

    // add system level clean here, so that build definitions can overload it later.
    if (config.systemBuilds && config.systemBuilds.clean)
      this.cleaner.add(config.systemBuilds.clean);

    if (config.builds) {
      const builds = is.Array(config.builds) ? config.builds : [config.builds];
      for (let buildItem of builds) {
        if (is.String(buildItem)) buildItem = require(upath.join(process.cwd(), basePath, buildItem as string));
        let bs = new GBuildSet(buildItem as BuildSet);
        bs.resolve(customBuildDir, this.defaultModuleOptions, this.watcher, this.cleaner);
      }
    }

    if (config.systemBuilds) {
      let mopts = Object.assign({}, this.defaultModuleOptions, config.systemBuilds.moduleOptions);
      let sysBuilds = config.systemBuilds.build;
      if (sysBuilds) {
        gulp.task('@build', gulp.parallel(new GBuildSet(sysBuilds).resolve(
          customBuildDir, mopts, this.watcher, this.cleaner)));
      }

      this.cleaner.createTask(mopts.del);
      this.watcher.createTask(config.systemBuilds.watch as WatchOptions);

      let defaultBuild = config.systemBuilds.default;
      if (defaultBuild) {
        gulp.task('default', gulp.parallel(new GBuildSet(defaultBuild).resolve(
          customBuildDir, mopts, this.watcher, this.cleaner)));
      }
    }
  }
}
