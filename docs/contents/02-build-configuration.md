---
layout: docs
title: Build Configuration
---

# Build Configuration

## BuildConfig
Understanding Build Configuration would be a starting point of learning gulp-build-manager.
It is an essential element describing build operations and can be defined using BuildConfig object.
BuildConfig has common set of pre-defined properties, but users can add custom properties consumed by custom builders.
When resolving BuildConfig, RTB(Runtime Builder) instance with the config is created and linked to new gulp task for execution.

```js
interface BuildConfig {
    buildName: string;              // mandatory
    builder?: Builders;             // main build operations in various form: function, object, class, etc
    src?: string | string[];
    dest?: string;
    outFile?: string;
    order?: string[];               // input file(src) ordering
    flushStream?: boolean;          // finish all the output streams before exiting gulp task
    sync?: boolean,                 // serialize each build execution steps
    verbose?: boolean,              // print verbose messages
    silent?: boolean,               // depress informative messages
    preBuild?: FunctionBuilders;    // function to be executed before BuildConfig.builder
    postBuild?: FunctionBuilders;   // function to be executed after BuildConfig.builder
    buildOptions?: Options;         // buildConfig instance specific custom options
    moduleOptions?: Options;        // gulp module options
    dependencies?: BuildSet;        // buildSet to be executed before this build task
    triggers?: BuildSet;            // buildSet to be executed after this build task
    watch?: string | string[];      // override default watch, 'src' if defined
    addWatch?: string | string[];   // additional watch in addition to watch or default watch
    reloadOnChange?: boolean;       // Reload on change when watcher is running. default is true.
    reloadOnFinish?: boolean;       // reload on finishing all the build operations. default is false.
    clean?: string | string[];      // clean targets
}

//--- BuildSet
type BuildSet = BuildName | GulpTaskFunction | BuildConfig | BuildSetSeries | BuildSetParallel;
type BuildSetSeries = BuildSet[];
type BuildSetParallel = { set: BuildSet[] };


// Others
type Options = { [key: string]: any; }
```


### conf.buildName
Name of the build configuration. This is the only mandatory property used as gulp task name which is uniquely idenfied.
All the BuildConfig instances should have unique buildName across the whole project. When creating GBuildProject, this is automatically prefixed with ProjectOptions.prefix to avoid name conflicts between sub-projects.


### conf.builder
Main build operation executor. Thius can be a builder class name, function, object, or RTB instance. If builder class name is specified, custom directory locations specified by ProjectOptions.customBuildDirs are searched first for the class definition. If no class definition is found, then built-in builders checked for the mathing. This sequence gives a chance to overload built-in builder classes with the same name. If no builder is specified, default function doing nothing is assigned.


### conf.src
Glob path or array of glob paths that are referencing source files. Typically, this property is passed to gulp.src() function to create input stream for build operations. If no src specified, then no gulp stream is created. For executing external commands or custom functions etc., no gulp stream is required and leave this property as undefined.


### conf.dest
Output directory path. Typically, this property is passed to gulp.dest() function to create otput files. If no value is specified, current process directory is used as output directory.


### conf.outFile
Output file name. This property can be optionally specified if some build process requires single output file name. For example, javascript builder can concatenate all the files in input stream into a single output file in conf.dest directory.


### conf.order
Specifies the order of files in input stream. For file ordering, 'gulp-order' module is used.

As an example, `['file2.js','*.js']` specifies 'file2.js' to come first and all other '*.js' files to follow.
Refer to the [gulp-order](https://github.com/sirlantis/gulp-order) site for the details.


### conf.flushStream
{:#flushStream}
If flushStream property is set to true, gulp task running this BuildConfig will not finish until all the file operations are finished. For example, task1 and task2 are configured to run in series, and task1 may write a file and task2 may try to access it. If task1 finishes and task2 is started when file writing of task1 is not finished, the task could fail execution. flushStream option gurantees that gulp task never finish until all the file operations are finished.


### conf.sync
Synchronization between gulp tasks can be achieved using gulp.series() and conf.flushStream. However, there are cases some internal or custom build operations need to be executed in synchronous way. If sync is set to true, all the operations involving promises are executed in sequence. By default, all the build operations are executed in async mode for better performance. This sync option can be terned on of off using rtb.sync(), rtb.async() functions.


### conf.verbose
Enable extra message display. Default is false.


### conf.silent
Suppress non critical messages. Default is false.


### conf.preBuild
{: #preBuild}
preBuild specifies a function that will be involed before conf.builder is executed. The three major build operations, conf.preBuild, conf.builder, conf.postBuild are executed in sync mode regardless of  conf.sync value. All those three function may return promise. In that case, those promises would be resolved before executing next steps.

**[FunctionBuilders]** type:
```js
type FunctionBuilder = (rtb: RTB, ...args: any[]) => void | Promise<unknown>
type FunctionObjectBuilder = { func: FunctionBuilder; args: any[] }
type FunctionBuilders = FunctionBuilder | FunctionObjectBuilder;
```

example:
```js
const simpleTask = {
  buildName: 'simpleTask',
  builder: 'GCSSBuilder',
  postBuild: rtb => rtb => rtb.copy({src:[otherStyleFiles], dest: destPath});
};
```


### conf.postBuild
postBuild works exactly the same as preBuild except it is invoked after conf.builder() is executed.


### conf.buildOptions
This is Builder-specific options. Each builders can have their own options here. For the details, refer to the documentation of relevant builders.

Some common options includes:
```js
buildOptions {
    lint: boolean,
    minify: boolean,
    minifyOnly: boolean,
    sourceMap: boolean,
    postcss: true,
    babel: boolean,
    outFileOnly: boolean,
    prettify: boolean,
    printConfig: boolean,
    tsConfig: string,       // path to typescript config file
    webPack: string         // path to webpack config file
}
```



### conf.moduleOptions
{: #moduleOptions}
Build operations typically use one or more gulp plugin modules. This property is used to set options for those modules. The property name of moduleOptions should be the same as the module name without 'gulp-' prefix. If module name is including hyphens, then Camel Case should be used instead of the hyphen. For example, options for 'gulp-html-prettify' will be conf.moduleOptions.htmlBeautify'. Options to 'gulp' itself is set to 'conf.moduleOptions.gulp'.


### conf.dependencies
Specifies other build items that will be executed before this build item, in gulp task sequence wise. The dependencies can be any combination of build items in the form of BuildSet.


### conf.triggers
Specifies other build items that will be executed after this build item, in gulp task sequence wise. The dependencies can be any combination of build items in the form of BuildSet.


### conf.watch
Specifies watch target files that will be monitored by GWatcher when watch task is triggered. GWatcher instance is automatically created by GBuildProject, if there's any watch target to monitor. If not specified, conf.src is set to conf.watch by default. To disable this automatic watching, set conf.watch = [].
Glob supported.


### conf.addWatch
Addional watch targets that will be added to conf.watch in addition to default vale, conf.src.


### conf.reloadOnChange
Enable reloading when watch target change detected. Default value us ture. So, to disable automatic reloading on change, this property should be set to **false** clearly, not undefined. See conf.reloadOnFinish option for an examle.

If this is set to false, conf.reloadOnFinish will be turned on outomatically unless it's clearly set to 'false'.

Note: GWatcher has it's own reloadOnChange options. Default value is true. If this is set to false, conf.reloadOnChange will have no effect. If you see reloading is not working, check WatchOptions.reloadOnChange for gbm.addWatcher() call.


### conf.reloadOnFinish
By default, Gwatcher monitors and triggers reloading. So, reloading at the end of build is not required. This is generally fine, but in some cases such as executing external commands without gulp stream, reloading need to be delayed until the build execution is finished. In that case, this option can be turned on, and reloadOnChange option can be turned off.

If conf.reloadOnChange is set to false, the this will be turned on outomatically unless it's clearly set to 'false'.

Here is an example to do that.

```js
const jekyll = {
    buildName: 'jekyll',
    builder: 'GJekyllBuilder',
    src: upath.join(basePath, ''),
    dest: destRoot,
    moduleOptions: {
        jekyll: {
            subcommand: 'build',
            args: [
                '--safe', // github runs in safe mode for security reason. Custom plugins are not supported.
                '--baseurl http://localhost:' + port, // root folder relative to local server,
                '--incremental'
            ]
        }
    },
    watch: [ upath.join(basePath, '**/*.{yml,html,md}') ],
    clean: [destRoot, upath.join(basePath, '.jekyll-metadata'), jekyllTrigger],

    reloadOnChange: false       // turns off automatic reloading on change
    reloadOnFinish: true        // because reloadOnChange is false, the default value of this will b true unless specified to false
}

gbm.createProject(jekyll)
    .addWatcher('watch', {
        browserSync: {server: upath.join(destRoot, '_site')}
    })
    .resolve()
```

Note: If reloadOnChange option is turned off, this will affect all the build items registered ito the project. So, in that case, reloadOnFinish option should to be truned on for all the build items in the project to have proper reloading.


### conf.clean
Specifies clean target files that will be removed by GCleaner when clean task is triggered. GCleaner instance is automatically created by GBuildProject, if there's any clean target to remove. Glob supported.
