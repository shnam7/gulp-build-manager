'use strict';

import is from './utils/is';
import gulp from 'gulp';
import upath from 'upath';
import merge from 'lodash.merge';
import GBuilder from './builders/GBuilder';

// BuildSet items are processed in gulp parallel task by default
/**
 *  BuildSet args can be one of followings:
 *    - {string} Name of gulp task
 *    - {BuildSet} Another BuildSet Object
 *    - {Object} Build definition object with mandatory property 'buildName'
 */
class BuildSet {
  constructor(...args) {
    this._set = [];
    this._isSeries = false;

    if (args.length === 1) {
      if (is.Array(args[0])) { // mark arrays as series task
        args = args[0];
        this._isSeries = true;
      }
      else if (args[0] instanceof BuildSet) { // strip off dummy BuildSet class wrapper
        this._isSeries = args[0]._isSeries;
        args = args[0]._set;
      }
    }

    for (const arg of args) {
      if (is.String(arg) ) {
        if(arg.length<=0) throw Error('Null string is not allowed');
        this._set.push(arg)
      }
      else if (is.Array(arg))
        this._set.push(new BuildSet(arg));
      else if (arg instanceof BuildSet || arg.hasOwnProperty('buildName'))
        this._set.push(arg);
      else
        throw Error('Invalid Object or \'buildName\' property not found:' + typeof arg);
    }
  }

  /**
   *  Converts build items in this._set[] into:
   *    - gulp task name, which is created automatically
   *    - return value of gulp.series() or gulp.parallel()
   *  @param customDirs Path for customer builders
   *  @param defaultModuleOptions Default module options
   *  @param watcher Watcher class
   *  @returns {*} Gulp task name if gulp task is created. Or, gulp.series() or gulp.parallel()
   */
  resolve(customDirs, defaultModuleOptions, watcher, cleaner) {
    let resolved = [];
    for (const item of this._set) {
      if (is.String(item) || is.Function(item))
        resolved.push(item);
      else if (item instanceof BuildSet)
        resolved.push(item.resolve(customDirs, defaultModuleOptions));
      else if (is.Object(item) && item.hasOwnProperty('buildName')) {
        // convert prop name: outfile-->outFile
        if (!item.outFile && item.outfile) item.outFile = item.outfile;

        let builder = this.getBuilder(item, customDirs);
        let task = (done)=>builder.build(defaultModuleOptions, item, done);
        let deps = undefined;
        let triggers = undefined;

        if (item.hasOwnProperty('dependencies'))
          deps = new BuildSet(item.dependencies).resolve(customDirs, defaultModuleOptions, watcher);

        if (item.hasOwnProperty('triggers'))
          triggers = new BuildSet(item.triggers).resolve(customDirs, defaultModuleOptions, watcher);

        if (deps || triggers) {
          let taskList = [task];
          if (deps) taskList.unshift(deps);
          if (triggers) taskList.push(triggers);
          gulp.task(item.buildName, gulp.series.apply(null, taskList));
        }
        else
          gulp.task(item.buildName, task);

        // resolve clean targets
        if (item.hasOwnProperty('clean')) cleaner.add(item.clean);

        // resolve watch
        let watch = {
          name: item.buildName,
          watched: is.Array(item.src) ? item.src.slice() : item.src ? [item.src] : [],
          task: [item.buildName],
          livereload: false
        };
        merge(watch, item.watch);
        if (item.watch && item.watch.watched) watch.watched = item.watch.watched;
        watcher.addWatch(watch);
        resolved.push(item.buildName);
      }
      else
        throw Error('Unexpected BuildSet entry type');
    }

    if (resolved.length===1) return resolved[0];
    return (this._isSeries) ? gulp.series.apply(null, resolved) : gulp.parallel.apply(null, resolved);
  }

  getBuilder(buildItem, customDirs) {
    let builder = buildItem.builder;
    if (is.Function(builder)) return {build: builder};
    if (builder instanceof GBuilder) return builder;
    if (!builder) return {
      build: function (conf, moduleOptions, done) {
        // console.log(`BuildName:${buildItem.buildName}: No builder specified.`);
        done();
      }
    };

    // try custom dir first to give a chance to overload default builder
    if (is.String(customDirs)) customDirs = [customDirs];
    if (customDirs) {
      // console.log(`Trying custom builders in '${customDirs}'`);
      for (const customDir of customDirs) {
        let pathName = upath.join(process.cwd(), customDir, builder);
        try {
          let builderClass = require(pathName);
          return new builderClass;
        }
        catch (e) {
          if (e.code !== 'MODULE_NOT_FOUND' || e.message.indexOf(pathName) < 0) throw e;
        }
      }
    }

    // if custom builder is not available, then try default builder
    let pathName = upath.join(__dirname, './builders', buildItem.builder);
    try {
      let builderClass = require(pathName);
      return new builderClass;
    }
    catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND' || e.message.indexOf(pathName) < 0) throw e;
      console.log(`builder '${builder}' not found:`, e);
    }
    throw Error('Builder not found: ' + builder + ', or check for modules imported from ' + builder);
  }
}


function buildSet(...args) {
  return new BuildSet(...args);
}


module.exports = buildSet;
export default buildSet;
