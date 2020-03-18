---
layout: docs
title: RTB - Runtime Builder
---

# RTB - Runtime Builder
RTB, Runtime Builder, is a class with build function that is actually executed by gulp task. RTB builder can execute three types of builders: Function Builder, Object Builder, and BuildConfig.

See **[builder](06-builders)** for available builder types.

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
Calls plugin action with this RTB innstance and args as arguments. If promise is returned from the plugin, then it is handled in sync or async depending on current sync mode.
```js
(action: Plugins, ...args: any[]) => this;
chain(action: Plugins, ...args: any[]): this {
```


---
### on()
Calls gulp on() function on internal gulp stream.
```js
(event: string | symbol, listener: (...args: any[]) => void) => this;
```


---
### promise()
If 'promise' argument is an instance of Promise, then it is added to sync or async promise queue depending on current sync mode.

If promise is a function, then it is added to sync promise queue in sync mode, or it is executed immediately in async mode. if it returns promise, then it is added to sync or async queue depending on current sync mode.

The last argument, 'sync' will override current sync mode.

Current sync mode is determined by conf.sync property initially, but it can be changed by RTB functions, sync() or async().

Note that all the promise objects, sync or async, are waited before finishing the build process. If no sync mode specified, all the build operations are executed in async mode by default for better performance.
```js
type PromiseExecutor = () => void | Promise<unknown>;

(promise?: Promise<unknown> | void | PromiseExecutor, sync: boolean = false) => this;
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
Added a promise waiting for msec. In sync mode, this will suspend build operations in sync promise queue for msec. In async mode, this wait will be independent of other build operations, and it will only delays the finishig of whole build process up to msec.

The last argument, 'sync' will override current sync state for this operation.
```js
(msec: number = 0, sync: boolean = false) => this;
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
if opts.init is valid, sourcemaps operation is initialized with opts.init as argument. Otherwise, sourcemaps is written to opts.dest with opts.write option as argument. if opts.dest is not defined, then '.' will be used writing output in current directory.
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
In sync mode, all the copy operations specified in 'param' are added to sync promise queue, and will be executed in sequence.
In async mode, all the copy operations executed immediately, and the returned promise is added to sync or async queue depending on current sync state.

The last argument, 'sync' will override current sync state for this operation.
```js
(param?: CopyParam | CopyParam[], options: Options = {}, sync: boolean = false) => this;
```


---
### del()
In sync mode, delete operation is added to sync promise queue, and will be executed in sequence.
In async mode, delete operation executed immediately, and the returned promise is added to sync or async queue depending on current sync state.

The last argument, 'sync' will override current sync state for this operation.

For this operation, 'del' module is loaded and called with pattern and options as arguments.
```js
(patterns: string | string[], options: Options = {}, sync: boolean = false) => this;
```


---
### spawn()
Spawns external commands with cmd, args, and options. In sync mode, spawn operation is added to sync promise queue, and will be executed in sequence. In async mode, spawn operation executed immediately, and the returned promise is added to sync or async queue depending on current sync state.

The last argument, 'sync' will override current sync state for this operation.
```js
(cmd: string | ExternalCommand, args: string[] = [], options: SpawnOptions = {}, sync: boolean = false) => this;
```


---
### exec()
Executes external commands with cmd, args, and options. In sync mode, the command execution is added to sync promise queue, and will be executed in sequence. In async mode, the command is executed immediately, and the returned promise is added to sync or async queue depending on current sync state.

The last argument, 'sync' will override current sync state for this operation.
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

In sync mode, the clean operation is added to sync promise queue, and will be executed in sequence. In async mode, it is executed immediately, and the returned promise is added to sync or async queue depending on current sync state.

The last argument, 'sync' will override current sync state for this operation.
```js
(options: Options = {}, sync: boolean = false) => this;
```


---
### concat()
Loads 'gulp-concat' module and pipe it to internal gulp stream with BuildConfig.outFile and options.concat as arguments.
if BuildConfig.outFile is not specified, the operation will be skipped with a warning message. In this operation, *.map files in current gulp stream will be filtered out. If BuildConfig.sourceMaps is set to true, map files will be generated.
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
