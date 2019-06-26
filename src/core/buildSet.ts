/**
 *  GBuildSet - Gulp task tree builder and analyzer
 */

import * as gulp from 'gulp';
import * as upath from 'upath';
import {is, warn} from '../utils/utils';
import {BuildConfig, BuildFunction, BuildSet, ExternalBuilder, Options, TaskDoneFunction, WatchItem} from "./types";
import {GWatcher} from "./watcher";
import {GCleaner} from "./cleaner";
import {GBuilder} from "./builder";
import {TaskFunction} from "gulp";
import GExternalBuilder from "../builders/GExternalBuilder";

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

  normalizeBuildConfig(conf: BuildConfig) {
    if (is.Array(conf.dependencies) && (<any[]>conf.dependencies).length === 0)
      conf.dependencies = undefined;
    if (is.Array(conf.triggers) && (<any[]>conf.triggers).length === 0)
      conf.triggers = undefined;
    return conf;
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
    let resolved:(string | TaskFunction)[] = [];
    for (let item of this.set) {
      if (is.String(item) || is.Function(item))
        resolved.push(item as (string | TaskFunction));
      else if (item instanceof GBuildSet)
        resolved.push(item.resolve(customDirs, defaultModuleOptions, watcher, cleaner));
      else if (is.Object(item) && item.hasOwnProperty('buildName')) {
        item = this.normalizeBuildConfig(item as BuildConfig);
        // convert prop name: outfile-->outFile
        if (!item.outFile && item.outfile) {
          warn(`[GBM][buildName=${item.buildName}] DeprecationWarning: BuildConfig.outfile is deprecated. Please use outFile instead.`);
          item.outFile = item.outfile;
        }

        let builder = this.getBuilder(item, customDirs);
        builder.reloader = watcher.reloader;
        let task = (done:TaskDoneFunction)=>builder._build(item);
        let deps = undefined;
        let triggers = undefined;

        if (item.dependencies)
          deps = new GBuildSet(item.dependencies as BuildSet).resolve(customDirs, defaultModuleOptions, watcher, cleaner);

        if (item.triggers)
          triggers = new GBuildSet(item.triggers as BuildSet).resolve(customDirs, defaultModuleOptions, watcher, cleaner);

        let taskList:(string | TaskFunction)[] = item.builder ? [task] : [];
        if (deps || triggers) {
          if (deps) taskList.unshift(deps);
          if (triggers) taskList.push(triggers);
        }

        // if builder is not specified, create task only when there's no deps and triggers to prevent empty taskList
        if (taskList.length === 0) taskList = [task];

        // resolve clean targets, even in the case taskList is empty
        if (item.clean) cleaner.add(item.clean);

        // create task
        gulp.task(item.buildName, taskList.length === 1 ? taskList[0] as TaskFunction : gulp.series(taskList));

        // resolve watch
        let watchItem: WatchItem = {
          name: item.buildName,
          watched: item.src ? (is.Array(item.src) ? (item.src as string[]).slice(): [item.src as string]) : [],
          task: item.buildName,
        };
        Object.assign(watchItem, item.watch || {});
        if (item.watch && item.watch.watched) watchItem.watched = item.watch.watched;
        if (item.watch && item.watch.watchedPlus)
          watchItem.watched = watchItem.watched.concat(item.watch.watchedPlus);

        // if user provided the task to run, enable it
        if (item.watch && item.watch.task) watchItem.task = item.watch.task;

        resolved.push(item.buildName);
        watcher.addWatch(watchItem);
      }
      else
        throw Error('Unexpected BuildSet entry type');
    }

    if (resolved.length === 1) return resolved[0] as (string | TaskFunction);
    return (this.isSeries) ? gulp.series.apply(null, resolved as any) : gulp.parallel.apply(null, resolved as any);
  }

  getBuilder(buildItem:BuildConfig, customDirs:string|string[]) {
    let builder = buildItem.builder;

    if (is.Function(builder)) return new GBuilder(builder as BuildFunction);

    if (builder instanceof GBuilder) return builder;
    if (!builder) return new GBuilder(()=>{
      // dmsg(`BuildName:${buildItem.buildName}: No builder specified.`);
    });

    if (is.Object(builder)) {
      if (!builder.hasOwnProperty('command'))
        throw Error(`[buildName:${buildItem.buildName}]builder.command is not specified.`);
      return new GExternalBuilder(
        (builder as ExternalBuilder).command,
        (builder as ExternalBuilder).args,
        (builder as ExternalBuilder).options
      );
    }

    // try custom dir first to give a chance to overload default builder
    if (is.String(customDirs)) customDirs = [customDirs as string];
    if (customDirs) {
      // dmsg(`Trying custom builders in '${customDirs}'`);
      for (const customDir of customDirs) {
        let pathName = upath.join(process.cwd(), customDir, builder as string);
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
    if (builder === 'GBuilder') return new GBuilder();
    let pathName = upath.join(__dirname, '../builders', builder as string);
    try {
      let builderClass = require(pathName);
      return new builderClass.default();
    }
    catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND' || e.message.indexOf(pathName) < 0) throw e;
      warn(`builder '${builder}' not found:`, e);
    }
    throw Error('Builder not found: ' + builder + ', or check for modules imported from ' + builder);
  }
}