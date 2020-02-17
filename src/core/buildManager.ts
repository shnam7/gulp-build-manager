/**
 * Gulp Build Manager
 *
 * @package gulp-build-manager
 * @author Robin Soo-hyuk Nam
 * @date Mar 19, 2017
 *
 */

import * as upath from 'upath';
import { GWatcher, WatchOptions, WatchItem } from './watcher';
import { GCleaner, CleanTarget } from './cleaner';
import { Options, gulp, GulpTaskFunction } from "./common";
import { is, warn, ExternalCommand } from "../utils/utils";
import { RTB } from './rtb';
import { GBuilder, BuildSet, BuildName, BuildConfig, TaskDoneFunction, BuildSetSeries, BuildSetParallel, ObjectBuilders, CopyBuilder, FunctionBuilder } from './builder';


// GBM Config
export interface GBMConfig {
    customBuilderDir?: string | string[];
    builds?: BuildSet;
    systemBuilds?: {
        build?: BuildSet;
        clean?: CleanTarget;
        default?: BuildSet;
        watch?: WatchOptions;
        moduleOptions?: Options;
    },
    moduleOptions?: Options;    // value for defaultModuleOptions
}

export class GBuildManager {
    customDirs?: string[];
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

        // autoprefixer: {
        // browsers: ['last 2 versions', '> 5%']
        // browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3']
        // },

        cssnano: { discardUnused: false },

        // babel: {presets:["env"]},

        imagemin: {
            progressive: true,
            optimizationLevel: 5
        },
        htmlPrettify: {
            indent_char: ' ',
            indent_size: 4
        },

        eslint: { "extends": "eslint:recommended", "rules": { "strict": 1 } },
    };

    constructor(config?: GBMConfig) {
        if (config) this.loadBuilders(config);
    }

    loadBuilders(config: string | GBMConfig) {
        let basePath = "";
        if (is.String(config)) {
            basePath = upath.dirname(config as string);
            config = require(upath.join(process.cwd(), config as string))
        }
        config = config as GBMConfig;

        if (config.customBuilderDir) {
            let dirs = (is.String(config.customBuilderDir))
                ? [config.customBuilderDir as string] : config.customBuilderDir as string[];
            this.customDirs = [];
            for (let dir of dirs) this.customDirs.push(upath.join(basePath, dir));
        }

        if (config.moduleOptions) Object.assign(this.defaultModuleOptions, config.moduleOptions);

        // add system level clean here, so that build definitions can overload it later.
        if (config.systemBuilds && config.systemBuilds.clean)
            this.cleaner.add(config.systemBuilds.clean);

        if (config.builds) {
            let bs = is.Array(config.builds) ? config.builds : [config.builds];
            for (let bs of config.builds as BuildSet[]) this.resolve(bs)
        }

        if (config.systemBuilds) {
            let mopts = Object.assign({}, this.defaultModuleOptions, config.systemBuilds.moduleOptions);
            let sysBuilds = config.systemBuilds.build;
            if (sysBuilds) {
                let resolved = this.resolve(sysBuilds);
                if (resolved) gulp.task('@build', is.String(resolved) ? gulp.series(resolved) : resolved as GulpTaskFunction);
            }

            this.cleaner.createTask(mopts.del);
            this.watcher.createTask(config.systemBuilds.watch);

            let defaultBuild = config.systemBuilds.default;
            if (defaultBuild) {
                let resolved = this.resolve(defaultBuild);
                if (resolved) gulp.task('default', is.String(resolved) ? gulp.series(resolved) : resolved as GulpTaskFunction);
            }
        }
    }

    resolve(buildSet?: BuildSet): GulpTaskFunction | BuildName | void {
        if (!buildSet) return;

        // if buildSet is BuildName or GulpTaskFunction
        if (is.String(buildSet) || is.Function(buildSet))
            return buildSet as (BuildName | GulpTaskFunction);

        // if buildSet is BuildConfig
        else if (is.Object(buildSet) && buildSet.hasOwnProperty('buildName')) {
            let conf = buildSet as BuildConfig;
            let rtb = this.getBuilder(conf);
            rtb.reloader = this.watcher.reloader;
            let deps = is.Array(conf.dependencies) ? conf.dependencies : [conf.dependencies];
            let task = (done: TaskDoneFunction) => rtb._build(conf);
            let triggers = is.Array(conf.triggers) ? conf.triggers : [conf.triggers];
            gulp.task(conf.buildName, <GulpTaskFunction>this.resolve([...<any>deps, task, ...<any>triggers]));

            // resolve clean targets, even in the case taskList is empty
            if (conf.clean) this.cleaner.add(conf.clean);

            // resolve watch
            let watchItem: WatchItem = {
                name: conf.buildName,
                watched: conf.src ? (is.Array(conf.src) ? (conf.src as string[]).slice() : [conf.src as string]) : [],
                task: conf.buildName,
            };
            Object.assign(watchItem, conf.watch || {});
            if (conf.watch && conf.watch.watched) watchItem.watched = conf.watch.watched;
            if (conf.watch && conf.watch.watchedPlus)
                watchItem.watched = watchItem.watched.concat(conf.watch.watchedPlus);

            // if user provided the task to run, enable it
            if (conf.watch && conf.watch.task) watchItem.task = conf.watch.task;

            this.watcher.addWatch(watchItem);
            return conf.buildName;
        }

        // if buildSet is BuildSetSeries: recursion
        else if (is.Array(buildSet)) {
            let list = [];
            for (let bs of <BuildSetSeries>buildSet) {
                let ret = this.resolve(bs);
                if (ret) list.push(ret);
            }
            if (list.length === 0) return;
            return list.length > 1 ? gulp.series.apply(null, <any>list) : list[0];
        }

        // if buildSet is BuildSetParallel: recursion
        else if (is.Object(buildSet) && buildSet.hasOwnProperty('set')) {
            let list = [];
            for (let bs of (<BuildSetParallel>buildSet).set) {
                let ret = this.resolve(bs);
                if (ret) list.push(ret);
            }
            if (list.length === 0) return;
            return list.length > 1 ? gulp.parallel.apply(null, <any>list) : list[0];
        }

        // dmsg('buildManager:resolve:buildSet='); dmsg(buildSet);
        throw Error('buildManager:resolve:Unknown type of buildSet');
    }

    getBuilder(buildItem: BuildConfig) {
        let builder = buildItem.builder;

        // if builder is GBuilderClassName
        if (is.String(builder)) {
            if (builder === 'GBuilder') return new GBuilder(buildItem);

            // try custom dir first to give a chance to overload default builder
            if (this.customDirs) {
                // dmsg(`Trying custom builders in '${this.customDirs}'`);
                for (const customDir of this.customDirs) {
                    let pathName = upath.join(process.cwd(), customDir, builder as string);
                    try {
                        let builderClass = require(pathName);
                        return new builderClass(buildItem);
                    }
                    catch (e) {
                        if (e.code !== 'MODULE_NOT_FOUND' || e.message.indexOf(pathName) < 0) throw e;
                    }
                }
            }

            // now try builder directory, ../builders
            let pathName = upath.join(__dirname, '../builders', builder as string);
            try {
                let builderClass = require(pathName);
                return new builderClass.default(buildItem);
            }
            catch (e) {
                if (e.code !== 'MODULE_NOT_FOUND' || e.message.indexOf(pathName) < 0) throw e;
                warn(`builder '${builder}' not found:`, e);
            }
            throw Error('Builder not found: ' + builder + ', or check for modules imported from ' + builder);

        }

        // if builder is BuildFunction
        if (is.Function(builder)) return new RTB(buildItem, builder as FunctionBuilder);

        // if builders is RTB or its derivatives such as GBuilder
        if (builder instanceof RTB) return builder.init(buildItem);

        // if builder is ObjectBuilder object
        if (is.Object(builder) && builder!.hasOwnProperty('command')) {
            builder = builder as ObjectBuilders;
            // if builder is CopyBuilder
            if (builder!.command == 'copy') return new RTB(buildItem, (rtb: RTB) => {
                let bs: CopyBuilder = builder as CopyBuilder;
                rtb.copy(bs.target, bs.options);
            });

            // if builder is ExternalBuilder
            return new RTB(buildItem, () => {
                return RTB.exec(<ExternalCommand>builder);
            });

            throw Error(`[buildName:${buildItem.buildName}]Unknown ObjectBuilder.`);
        }

        // if builder is not specified
        if (!builder) return new RTB(buildItem, () => {
            // dmsg(`BuildName:${buildItem.buildName}: No builder specified.`);
        });
    }

    //--- static functions

    static series(...args: BuildSet[]) { return args }
    static parallel(...args: BuildSet[]) { return { set: args } }
}
