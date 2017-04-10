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
  build(defaultModuleOptions, conf, done) {
    let mopts = {};
    this.OnInitModuleOptions(mopts, defaultModuleOptions, conf);
    // console.log(`'mopts for:${conf.buildName}:`, mopts);
    let stream = this.OnInitStream(mopts, defaultModuleOptions, conf);
    return this.OnDest(this.OnBuild(stream, mopts, conf), mopts, conf) || done();
  }

  OnInitModuleOptions(mopts, defaultModuleOptions, conf) {
    merge(mopts, pick(defaultModuleOptions, ['gulp','changed']));
    merge(mopts, this.OnBuilderModuleOptions(mopts, defaultModuleOptions));
    merge(mopts, pick(conf.moduleOptions, Object.keys(mopts)));
  }

  OnBuilderModuleOptions(mopts, defaultModuleOptions, conf) {}

  OnInitStream(mopts, defaultModuleOptions, conf) {
    return conf.src && gulp.src(conf.src, mopts.gulp)
        .pipe(plumber())
        .pipe(changed(conf.dest, mopts.changed));
  }

  OnBuild(stream, mopts, conf) { return stream; }

  OnDest(stream, mopts, conf) {
    if (conf.watch && conf.watch.livereload) {
      let livereload = require('gulp-livereload');
      return stream.pipe(gulp.dest(conf.dest)).pipe(livereload());
    }
    return stream && stream.pipe(gulp.dest(conf.dest));
  }

  pick(...arg) { return pick(...arg); }
  merge(...arg) { return merge(...arg); }
}

export default GBuilder;      // interface for import statement
module.exports = GBuilder;    // interface for require() call
