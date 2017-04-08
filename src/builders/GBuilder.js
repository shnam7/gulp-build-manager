/**
 *  Default Builder
 */

'use strict';
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import changed from 'gulp-changed';
import merge from 'lodash.merge';
import pick from 'lodash.pick';


class GBuilder {
  constructor() {}

  // defaultModuleOptions: this is from GulpBuilderManager config with updates from each buildItem config
  // In this callback, custom builder class can add bui
  build(conf, defaultModuleOptions) {
    let mopts = {};

    this.OnInitModuleOptions(mopts, conf, defaultModuleOptions);
    // console.log(`'mopts for:${conf.buildName}:`, mopts);
    let stream = this.OnInitStream(mopts, conf, defaultModuleOptions);
    return this.OnDest(this.OnBuild(stream, mopts, conf), conf, defaultModuleOptions);
  }

  OnInitModuleOptions(mopts, conf, defaultModuleOptions) {
    merge(mopts, pick(defaultModuleOptions, ['gulp','changed']));
    merge(mopts, this.OnBuilderModuleOptions(mopts, defaultModuleOptions));
    merge(mopts, pick(conf.moduleOptions, Object.keys(mopts)));
  }

  OnBuilderModuleOptions(mopts, defaultModuleOptions) {}

  OnInitStream(mopts, conf, defaultModuleOptions) {
    return gulp.src(conf.src, mopts.gulp)
      .pipe(plumber())
      .pipe(changed(conf.dest, mopts.changed));
  }

  OnBuild(stream, mopts, conf) {
    return stream.pipe(gulp.dest(conf.dest));
  }

  OnDest(stream, conf, defaultModuleOptions) {
    return stream.pipe(gulp.dest(conf.dest));
  }

  pick(...arg) { return pick(...arg); }
  merge(...arg) { return merge(...arg); }
}

export default GBuilder;      // interface for import statement
module.exports = GBuilder;    // interface for require() call
