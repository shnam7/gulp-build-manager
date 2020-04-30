---
id: build-config
title: Build Config
---

# Build Configuration

## BuildConfig
Understanding BuildConfig object would be a starting point of learning gulp-build-manager. It is an essential element describing build operations, and this is the smallest build target with independent gulp task attached. BuildConfig has common set of pre-defined properties, but users can add custom properties which will be consumed by their own build functions.

BuildConfig object is resolved when it is registered to gbm. In the resolve process, gbm creates gulp task and RTB(Runtime Builder) instance typically called rtb. This rtb actually executes build functions defined in the BuildConf object. It is also passed to every build functions, providing rich API set for build actions and runtime information necessary for that build process. See [RTB][0] section for more details on RTB.


## Data types
```js
interface BuildConfig {
    buildName: string;              // mandatory
    builder?: Builders;             // main build operations in various form: function, object, class, etc
    src?: string | string[];
    dest?: string;
    order?: string[];               // input file(src) ordering
    outFile?: string;
    preBuild?: FunctionBuilder;     // function to be executed before BuildConfig.builder
    postBuild?: FunctionBuilder;    // function to be executed after BuildConfig.builder
    buildOptions?: Options;         // buildConfig instance specific custom options
    moduleOptions?: Options;        // gulp module options
    dependencies?: BuildSet;        // buildSet to be executed before this build task
    triggers?: BuildSet;            // buildSet to be executed after this build task
    watch?: string | string[];      // override default watch, 'src' if defined
    addWatch?: string | string[];   // additional watch in addition to watch or default watch
    clean?: string | string[];      // clean targets
    flushStream?: boolean;          // finish all the output streams before exiting gulp task
    reloadOnChange?: boolean;       // Reload on change when watcher is running. default is true.
    verbose?: boolean,              // print verbose messages
    silent?: boolean,               // depress informative messages
}

//--- BuildSet
type BuildSet = BuildName | GulpTaskFunction | BuildConfig | BuildSetSeries | BuildSetParallel;
type BuildSetSeries = BuildSet[];
type BuildSetParallel = { set: BuildSet[] };

//--- build function type
type FunctionBuilder = (rtb: RTB, ...args: any[]) => void | Promise<unknown>;

// Others
type Options = { [key: string]: any; }
```

## BuildConfig properties

### conf.buildName: string
Name of the build configuration. This is the only mandatory property used as gulp task name which is uniquely idenfied.
All the BuildConfig instances should have unique buildName across the whole project. When creating GProject, this is automatically prefixed with ProjectOptions.prefix if available, to avoid name conflicts between sub-projects.


### conf.builder: Builders
Main build executor. Thius can be a builder class name, build function, external command object, or GBuilder instance. If builder class name is specified, custom directory locations specified by ProjectOptions.customBuildDirs are searched first for the class definition. If no class definition is found, then built-in builders are checked for the mathing. This sequence gives a chance to overload built-in builder classes with the same name. If no builder is specified, default functionis assigned which does nothing.

#### Builders that can be assigned to conf.builder
- Builder class name: string
- Build function: (rtb: RTB) => void | Promise\<unknown\>
- External command object, which will create child process to execute external command:
  {
      command: string,
      args?: string[];
      options?: SpawnOptions;
  }
- GBuilder class instance or its decendent objects.


### conf.src: string | string[]
Glob path or array of glob paths that are referencing source files. Typically, this property is passed to gulp.src() function to create input stream for build operations. If no src specified, then no gulp stream is created. For executing external commands or custom build functions, no gulp stream is required and this property can be omitted. gulp.src() is called by rtb.src() function.


### conf.dest: string
Optional output directory path. Typically, this property is passed to gulp.dest() function to create otput files. If no value is specified, current process directory is used as output directory. gulp.dest() is called by rtb.dest() function.

If not specified, rtb.dest() assumes current directory as destination path.


### conf.order: string[]
Specifies the order of files in input stream. For file ordering, 'gulp-order' module is used.

As an example, `['file2.js','*.js']` specifies 'file2.js' to come first and all other '*.js' files to follow. Refer to the [gulp-order][1] site for the details.


### conf.outFile: string
Optional output file name. This property can be optionally specified if some build process requires single output file name. For example, javascript builder can concatenate all the files in input stream into a single output file in conf.dest directory.

### conf.preBuild: FunctionBuilder
{: #preBuild}
preBuild specifies a build function that will be executed before main build function, conf.builder, is executed. The three major build sequence functions, conf.preBuild, conf.builder, conf.postBuild are executed in sequence regardless of syncMode status. All those three functions can return promise which will be waited before moviing to next steps.

example:
```js
const styles = {
  buildName: 'styles',
  builder: 'GCSSBuilder',
  postBuild: rtb => rtb.copy({src:[otherStyleFiles], dest: destPath});
};
```


### conf.postBuild: FunctionBuilder
postBuild works exactly the same as preBuild except it is invoked after conf.builder is executed.


### conf.buildOptions: Options
This is builder-specific options object. Each builders can specify their own options here. However, there are common properties typically used for the sam purpose. It is recommended to use these names in custom builders too for same purpose.

For actual options available, you should refer to specification or documentation of the builders you are going to use.

**Example properties for conf.buildOptions**:

|---------------|-----------|-------------|
| property      | type      | description |
|:--------------|:---------:|-------------|
| lint          | boolean   | Enable lint
| minify        | boolean   | Generate minified output
| minifyOnly    | boolean   | Generate minified output and does not generate non-minified output
| sourceMap     | boolean   | Generate sourcemap files
| postcss       | boolean   | Enable PostCSS
| babel         | boolean   | Enable ES6/Babel transpiler
| outFileOnly   | boolean   | Generate single output file specified in conf.outFile only
| prettify      | boolean   | Prettify output (formatting)
| printConfig   | boolean   | Print any relevant config files
| tsConfig      | string    | path to typescript config file
| webpackConfig | string    | path to webpack config file
|:--------------|:---------:|-------------|


### conf.moduleOptions: Options
{: #moduleOptions}
Build operations typically use one or more gulp plugin modules. This property is used to set options for those modules. The property name of moduleOptions should be the same as the module name without 'gulp-' prefix. If module name has hyphens, then Camel Case should be used instead of the hyphen. For example, options for 'gulp-clean-css' will be conf.moduleOptions.cleanCss'. Options to 'gulp' itself is set to 'conf.moduleOptions.gulp'.


### conf.dependencies: BuildSet
Specifies other build configurations that will be executed before this build configuration, in gulp task sequence wise. The dependencies can be any combination of build items in series or parallel. There is no limitation in the depth of dependency hierarchy.

Examples: assume there are 5 independent build items (configurations): b1, b2, b3, b4, b5
- conf.dependencies: gbm.seres(b1, b2, gbm.parallel(b3, b4, b5))
- conf.dependencies: [b1, b[2, gbm.parallel([b3, b4], b5))]

Note that gbm.series() can be replace with [].


### conf.triggers: BuildSet
Specifies other build items that will be executed after this build configuration, in gulp task sequence wise. All the others are the same as conf.dependencies.


### conf.watch: string | string[]
Specifies watch target files that will be monitored by gbm watch task if it is created by gbm.addWatcher() function. If not specified, conf.src is set to conf.watch by default. To disable this automatic watching, set conf.watch = []. Glob is supported.


### conf.addWatch: string | string[]
Addional watch targets that will be added to conf.watch in addition to default watch target, conf.src. Glob is supported.


### conf.clean
Specifies clean targets that will be removed by gbm cleaner task if it is created by gbm.addCleaner() function. Glob is supported.


### conf.flushStream
{:#flushStream}
Generally, gulp task can be finished while the streams created in the build functions are not finished yet. If conf.flushStream is set to true, gulp task running this build configuration will not finish until all the streams created are finished. For example, task1 and task2 are configured to run in series, and task1 may write a file and task2 may try to access it. If task1 finishes and task2 is started when file writing of task1 is not finished, task2 could fail during the execution. conf.flushStream option gurantees that gulp task never finish until all these file operations are finished.


### conf.reloadOnChange
Enable reloading when watch target change detected. Default value is ture. So, to disable automatic reloading on change, this property should be set to **false** clearly, not undefined.


### conf.verbose
Enable extra message display. Default is false.


### conf.silent
Suppress non critical messages. Default is false.



[0]:05-rtb.md
[1]:https://github.com/sirlantis/gulp-order
