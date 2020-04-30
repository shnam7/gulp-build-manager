---
id: rtb
title: RTB - Runtime Builder
---

# RTB - Runtime Builder
RTB, Runtime Builder, is a class with build function that is actually executed by gulp task. RTB builder can execute three types of builders: Function Builder, Object Builder, and BuildConfig.

See **[builder](06-builders)** for available builder types.

RTB has one-to-one mapping with gulp tasks, and provides all the information required in build operations. RTB API All the build functions managed by gbm receive rtb as its first argument.


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


---
## Member functions: RTB API

### src()
```js
src(src?: string | string[]) => this;
```
Creates internal gulp stream with files specified in BuildConf.src. sourceMap is automatically handled if it is enabled in BuildConfig.


### dest()
```js
dest(path?: string) => this;
```
Calls gulp.dest() on internal gulp stream with BuildConf.dest. sourceMap is automatically handled if is enabled in BuildConfig.


### pipe()
```js
pipe(destination: any, options?: { end?: boolean; }) => this;
```
Calls gulp pipe() on internal gulp stream.


### chain()
```js
chain(action: FunctionBuilder, ...args: any[]) => this;
```
Calls plugin action with this RTB innstance and args as arguments. If promise is returned from the plugin, then it is handled in sync or async depending on current sync mode.


### promise()
```js
type PromiseExecutor = () => void | Promise<unknown>;

promise(promise?: Promise<unknown> | void | PromiseExecutor, sync: boolean = false) => this;
```
If 'promise' argument is an instance of Promise, then it is added to sync or async promise queue depending on current sync mode (default is async).

If promise is a function, then it is added to sync promise queue in sync mode, or it is executed immediately in async mode. if it returns promise, then it is added to sync or async queue depending on current sync mode.

The last argument, 'sync' will override current sync mode.

Current sync mode is determined by conf.sync property initially, but it can be changed by RTB functions, sync() or async().

Note that all the promise objects, sync or async, are waited before finishing the build process. If no sync mode specified, all the build operations are executed in async mode by default for better performance.


### sync()
```js
sync() => this;
```
Turns on sync mode. Once enabled, all the build operations are executed in sequence.


### async()
```js
async() => this;
```
Turns off sync mode. In async mode, all the build operations are executed in parallel.


### wait()
```js
wait(msec: number = 0, sync: boolean = false) => this;
```
Add a promise waiting for msec. In sync mode, this will suspend build operations in sync promise queue for msec. In async mode, this wait will be independent of other build operations, and it will only delays the finishig of whole build process up to msec.

The last argument, 'sync' will override current sync state for this operation.


### pushStream()
```js
pushStream() => this;
```
Save current gulp stream into internal stream queue. Multiple pushes are allowed.


### popStream()
```js
popStream() => this;
```
If internal promise queue is not empty, then current stream is added to promise execution sequence to be flushed, and the latest stream pushed to the internal stream queue is restored as current stream. Multiple pops are allowed.


### sourceMaps()
```js
sourceMaps(options: Options = {}) => this;
```
if opts.init is valid, sourcemaps operation is initialized with opts.init as argument. Otherwise, sourcemaps is written to opts.dest with opts.write option as argument. if opts.dest is not defined, then '.' will be used writing output in current directory.
For this operation, 'gulp-sourcemaps' module is used.


### debug()
```js
debug(options: Options = {}) => this;
```
Loads 'gulp-debug' module and pipe it to internal gulp stream with opts as argument.


### filter()
```js
filter(pattern: string | string[] | filter.FileFunction = ["**", "!**/*.map"],
    options: filter.Options = {}) => this;
```
Loads 'gulp-filter' module and pipe it to internal gulp stream with pattern and options as argument.


### rename()
```js
rename(options: Options = {}) => this;
```
Loads 'gulp-rename' module and pipe it to internal gulp stream with options as argument.
Refer to [gulp-rename][0] documents for option details.


### copy()
```js
copy(param?: CopyParam | CopyParam[], options: Options = {}) => this;
```
In sync mode, all the copy operations specified in 'param' are added to sync promise queue, and will be executed in sequence.
In async mode, all the copy operations executed immediately, and the returned promise is added to sync or async queue depending on current sync state.

The last argument, 'sync' will override current sync state for this operation.


### del()
```js
del(patterns: string | string[], options: Options = {}) => this;
```
In sync mode, delete operation is added to sync promise queue, and will be executed in sequence.
In async mode, delete operation executed immediately, and the returned promise is added to sync or async queue depending on current sync state.

For this operation, 'del' module is loaded and called with pattern and options as arguments.

#### options
options argument accepts all the properties available from node 'del' module.

In addition, options.sync can be specified to override current sync state for this operation.


### exec()
```js
exec(cmd: string | ExternalCommand, args: string[] = [], options: SpawnOptions = {}) => this;
```
Executes external commands with cmd, args, and options. In sync mode, the command execution is added to sync promise queue, and will be executed in sequence. In async mode, the command is executed immediately, and the returned promise is added to sync or async queue depending on current sync state.

The last argument, 'sync' will override current sync state for this operation.


### clean()
```js
clean(options: CleanOptions = {}): this
```
Triggers delete operations for the patterns specified in BuildConfig.clean and options.clean.
For this operation, 'del' module is loaded and called with options as arguments.

In sync mode, the clean operation is added to sync promise queue, and will be executed in sequence. In async mode, it is executed immediately, and the returned promise is added to sync or async queue depending on current sync state.

#### options
clean() internally use del(). So, options argument accepts all the properties available for del() including options.sync.


### concat()
```js
concat(options: Options = {}) => this;
```
Loads 'gulp-concat' module and pipe it to internal gulp stream with BuildConfig.outFile and options.concat as arguments.
if BuildConfig.outFile is not specified, the operation will be skipped with a warning message. In this operation, *.map files in current gulp stream will be filtered out. If BuildConfig.sourceMaps is set to true, map files will be generated.


### minifyCss()
```js
minifyCss(options: Options = {}) => this;
```
Minify css files in the current stream. This operation will filter out *.map files. Output files will have '*.min.css'  extension names. If BuildConfig.sourceMaps is set to true, map files will be grnerated.


### minifyJs()
```js
minifyJs(options: Options = {}) => this;
```
Minify javascript files in the current stream. This operation will filter out *.map files. Output files will have '*.min.js' extion names. If BuildConfig.sourceMaps is set to true, map files will be grnerated.



---
## Properties

### conf
BuildConf object this RTB is attached to.

### buildName
Sams as conf.buildName

### buildOptions
Same as conf.buildOptions

### moduleOptions
Sams as conf.moduleOptions

### stream
Internal file stream, typically opened by gulp.src()

### ext
Object containing all the RTB extension modules



---
## Static functions

### static registerExtension()
```js
static registerExtension(name: string, ext: RTBExtension) => void;
```
Register RTB extension under the given name.


### static loadExtensions()
```js
tatic loadExtensions(globModules: string | string[]) => void;
```
Load extension modules from the globModules files specified



[0]: https://github.com/hparra/gulp-rename
