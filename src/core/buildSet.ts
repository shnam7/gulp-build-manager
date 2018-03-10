/**
 *  GBuildSet - Gulp task tree builder and analyzer
 */


import * as gulp from 'gulp';
import * as upath from 'upath';
import {is} from './utils';
import {BuildConfig, BuildSet, Options, TaskDoneFunction, WatchItem} from "./types";
import {GWatcher} from "./watcher";
import {GCleaner} from "./cleaner";
import {GBuilder} from "./builder";
import {TaskFunction} from "gulp";

// BuildSet items are processed in gulp parallel task by default
/**
 *  BuildSet args can be one of followings:
 *    - {string} Name of gulp task
 *    - {BuildSet} Another BuildSet Object
 *    - {Object} Build definition object with mandatory property 'buildName'
 */
export class GBuildSet {
  set:BuildSet[] = [];
  isSeries:boolean = false;

  constructor(...args:BuildSet[]) {
    if (args.length === 1) {
      if (is.Array(args[0])) { // mark arrays as series task
        args = args[0] as BuildSet[];
        this.isSeries = true;
      }
      else if (args[0] instanceof GBuildSet) { // strip off dummy BuildSet class wrapper
        this.isSeries = (args[0] as GBuildSet).isSeries;
        args = (args[0] as GBuildSet).set;
      }
    }

    for (const arg of args as BuildSet[]) {
      if (is.String(arg) ) {
        if((arg as string).length<=0) throw Error('Null string is not allowed');
        this.set.push(arg as string)
      }
      else if (is.Function(arg) ) {
        this.set.push(arg)
      }
      else if (is.Array(arg))
        this.set.push(new GBuildSet(arg));
      else if (arg instanceof GBuildSet || arg.hasOwnProperty('buildName'))
        this.set.push(arg);
      else
        throw Error('Invalid Object or \'buildName\' property not found:' + typeof arg);
    }
  }

  /**
   *  Converts build items in this.set[] into:
   *    - gulp task name, which is created automatically
   *    - return value of gulp.series() or gulp.parallel()
   *  @param customDirs Path for customer builders
   *  @param defaultModuleOptions Default module options
   *  @param watcher Watcher class
   *  @returns {*} Gulp task name if gulp task is created. Or, gulp.series() or gulp.parallel()
   */
  resolve(customDirs: string | string[], defaultModuleOptions: Options, watcher: GWatcher, cleaner: GCleaner): string | TaskFunction {
    let resolved = [];
    for (let item of this.set) {
      if (is.String(item) || is.Function(item))
        resolved.push(item);
      else if (item instanceof GBuildSet)
        resolved.push(item.resolve(customDirs, defaultModuleOptions, watcher, cleaner));
      else if (is.Object(item) && item.hasOwnProperty('buildName')) {
        item = item as BuildConfig;
        // convert prop name: outfile-->outFile
        if (!item.outFile && item.outfile) item.outFile = item.outfile;

        let builder = this.getBuilder(item, customDirs);
        let task = (done:TaskDoneFunction)=>builder.build(defaultModuleOptions, item, done);
        let deps = undefined;
        let triggers = undefined;

        if (item.dependencies)
          deps = new GBuildSet(item.dependencies as BuildSet).resolve(customDirs, defaultModuleOptions, watcher, cleaner);

        if (item.triggers)
          triggers = new GBuildSet(item.triggers as BuildSet).resolve(customDirs, defaultModuleOptions, watcher, cleaner);

        if (deps || triggers) {
          let taskList:(string | TaskFunction)[] = [task];
          if (deps) taskList.unshift(deps);
          if (triggers) taskList.push(triggers);
          gulp.task(item.buildName, gulp.series.apply(null, taskList));
        }
        else
          gulp.task(item.buildName, task);

        // resolve clean targets
        if (item.clean) cleaner.add(item.clean);

        // resolve watch
        let watch: WatchItem = {
          name: item.buildName,
          watched: item.src ? (is.Array(item.src) ? (item.src as string[]).slice(): [item.src as string]) : [],
          task: item.buildName,
        };
        Object.assign(watch, item.watch || {});
        if (item.watch && item.watch.watched) watch.watched = item.watch.watched;
        if (item.watch && item.watch.watchedPlus)
          watch.watched = watch.watched.concat(watch.watched, item.watch.watchedPlus);
        resolved.push(item.buildName);
        watcher.addWatch(watch);
      }
      else
        throw Error('Unexpected BuildSet entry type');
    }

    if (resolved.length===1) return resolved[0] as (string | TaskFunction);
    return (this.isSeries) ? gulp.series.apply(null, resolved) : gulp.parallel.apply(null, resolved);
  }

  getBuilder(buildItem:BuildConfig, customDirs:string|string[]) {
    let builder = buildItem.builder;
    if (is.Function(builder)) return {build: builder};

    if (builder instanceof GBuilder) return builder;
    if (!builder) return {
      build: function (mopts:Options, conf:Options, done:TaskDoneFunction) {
        // console.log(`BuildName:${buildItem.buildName}: No builder specified.`);
        done();
      }
    };

    // try custom dir first to give a chance to overload default builder
    if (is.String(customDirs)) customDirs = [customDirs as string];
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
    if (buildItem.builder === 'GBuilder') return new GBuilder();
    let pathName = upath.join(__dirname, '../builders', buildItem.builder);
    try {
      let builderClass = require(pathName);
      return new builderClass.default();
    }
    catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND' || e.message.indexOf(pathName) < 0) throw e;
      console.log(`builder '${builder}' not found:`, e);
    }
    throw Error('Builder not found: ' + builder + ', or check for modules imported from ' + builder);
  }
}