---
layout: docs
title: RTB - Runtime Builder
---

# {{page.title}}
RTB, Runtime Builder, is a class with build function that is actually executed by gulp task.
RTB builder can execute three types of builders: Function Builder, Object Builder, and BuildConfig.
See **[builder](builders)** for available builder types.

RTB has one-to-one mapping with gulp tasks, and provides all the information required in build operations.
All the build functions managed by gbm received rtb as its first argument.

## Quick Example
Th example will copy *.txt files, showing the file names using 'gulp-debug'.
```js
const copy = {
    buildName: 'my-copy',
    builder: rtb => rtb.src().debug({title: rtb.conf.buildName + '::'}).dest(),
    src: ['src/**/*.txt'],
    dest: '_build'
}
```


## RTB API's

### src()
Creates internal gulp stream with files specified in BuildConf.src.
```js
(src?: string | string[]) => this;
```


---
### dest()
Calls gulp.dest() on internal gulp stream with BuildConf.dest.
```js
(path?: string) => this;
```


---
### pipe()
Calls gulp pipe() on internal gulp stream.
```js
(destination: any, options?: { end?: boolean; }) => this;
```


---
### chain()
Calls plugin action with this RTB innstance and args as arguments.
```js
(action: Plugins, ...args: any[]) => this;
```


---
### on()
Calls gulp on() function on internal gulp stream.
```js
(event: string | symbol, listener: (...args: any[]) => void) => this;
```


---
### promise()
In sync mode, the executor is chained to internal sync promise object. Otherwise, executor is added to async promise list.
All the promise objects, sync or async, are waited before finishing the build process.
Sync mode can be enabled by calling rtb.sync(), or temporarily by setting 'sync' argument to true.
All the build operations are executed in async mode for better performance.
```js
(executor: ()=>Promise<unknown>, sync: boolean = false) => this;
```


---
### sync()
Turns on sync mode. Once enabled, all the build operations are executed in sequence.
```js
() => this;
```


---
### async()
Turns off sync mode. In async mode, all the build operations are executed in parallel.
```js
() => this;
```


---
### wait()
Added a promise waiting for msec.
In sync mode, this wait suspend build operations in sync promise for msec. In async mode, this wait will be independent of other build operations, and it will only delays the finishig of whole build process up to msec.
```js
(msec: number = 0, sync: boolean = false) => this;
```


---
### msg()
Print message in promise execution sequence.
```js
(...args: any[]) => this;
```


---
### log()
Print message in promise execution sequence only when BuildConfig.verbose option is true
```js
(...args: any[]) => this;
```


---
### pushStream()
Save current gulp stream into internal stream queue. Multiple pushes are allowed.
```js
() => this;
```


---
### popStream()
If internal promise queue is not empty, then current stream is added to promise execution sequence to be flushed, and the latest stream pushed to the internal stream queue is restored as current stream. Multiple pops are allowed.
```js
() => this;
```


---
### sourceMaps()
if opts.init is valid, sourcemaps operation is initialized with opts.init as argument.
Otherwise, sourcemaps is written to opts.dest with opts.write option as argument.
if opts.dest is not defined, then '.' will be used writing output in current directory.
For this operation, 'gulp-sourcemaps' module is used.
```js
(options: Options = {}) => this;
```


---
### reload()
Triggers realod operation on all the registered browser reloaders.
```js
() => this;
```


---
### debug()
Loads 'gulp-debug' module and pipe it to internal gulp stream with opts as argument.
```js
(options: Options = {}) => this;
```


---
### filter()
Loads 'gulp-filter' module and pipe it to internal gulp stream with pattern and options as argument.
```js
(pattern: string | string[] | filter.FileFunction = ["**", "!**/*.map"], options: filter.Options = {}) => this;
```


---
### rename()
Loads 'gulp-rename' module and pipe it to internal gulp stream with options as argument.
```js
(options: Options = {}) => this;
```


---
### copy()
Triggers copy operations for all the entries in param. Returned promise of the copy operations are added to internal promise execution sequence for flushing.
```js
(param?: CopyParam | CopyParam[], options: Options = {}) => this;
```


---
### del()
Triggers delete operations for the patterns.
For this operation, 'del' module is loaded and called with pattern and options as arguments.
```js
(patterns: string | string[], options: Options = {}) => this;
```


---
### spawn()
Spawns external commands with cmd, args, and options.
```js
(cmd: string | ExternalCommand, args: string[] = [], options: SpawnOptions = {}) => this;
```


---
### exec()
Executes external commands with cmd, args, and options.
```js
(cmd: string | ExternalCommand, args: string[] = [], options: SpawnOptions = {}) => this;
```


---
### uglify()
Loads 'gulp-uglify-es' module and pipe it to internal gulp stream with options as argument.
```js
(options: Options = {}) => this;
```


---
### cleanCss()
Loads 'gulp-clean-css' module and pipe it to internal gulp stream with options as argument.
```js
(options: Options = {}) => this;
```


---
### clean()
Triggers delete operations for the patterns specified in BuildConfig.clean and options.clean.
For this operation, 'del' module is loaded and called with options as arguments.
```js
(options: Options = {}) => this;
```


---
### concat()
Loads 'gulp-concat' module and pipe it to internal gulp stream with BuildConfig.outFile and options.concat as arguments.
if BuildConfig.outFile is not specified, the operation will be skipped with a warning message.
In this operation, *.map files in current gulp stream will be filtered out.
If BuildConfig.sourceMaps is set to true, map files will be grnerated.
```js
(options: Options = {}) => this;
```


---
### minifyCss()
Minify css files in the current stream. This operation will filter out *.map files. Output files will have '*.min.css'  extension names. If BuildConfig.sourceMaps is set to true, map files will be grnerated.
```js
() => this;
```


---
### minifyJs()
Minify javascript files in the current stream. This operation will filter out *.map files. Output files will have '*.min.js' extion names. If BuildConfig.sourceMaps is set to true, map files will be grnerated.
```js
() => this;
```
