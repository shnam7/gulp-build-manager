---
id: build-manager
title: GBuildManager
---

# GBuildManager

This is the main class of Gulp Build Manager. It is immediately available as a unique global instance, when 'gulp-build-manager' is loaded.


## Quick Example
```js
const gbm = require('gulp-build-manager');

const scss = { buildName: 'scss' };
const scripts = { buildName: 'scripts' };
const build = { buildName='@build', dependencies: gbm.parallel(scss, scripts) };

gbm.createProject(build)
    .addCleaner()
    .addWatcher()
```


---
## Member functions
---

## createProject()
```js
createProject(buildGroup: BuildConfig | BuildGroup = {}, opts?: ProjectOptions) => GProject;
```
Create GProject instance and returns it. Note that the instance is not added to project iist of this GBuildManager.


## addProject()
```js
addProject(project: BuildGroup | GProject | string) => this;
```
Add 'project' to internal project list. If 'project' is path name in string type, then it is loaded from the file using require(). The file loaded should export GProject instance.

### example
```js
module.exports = gbm.createProject({sass, script});
```


## addProjects()
```js
addProjects(items: GProject | GProject[]) => this;
```
Add single or multiple projects to internal project list.



## getBuildNames()
```js
type BuildNameSelector = string | string[] | RegExp | RegExp[];
getBuildNames(selector: BuildNameSelector): string[]
```
Returns an array of buildNames that matches the pattern in selector. All the projects inside are are searched.



## findProject()
```js
findProject(projectName: string) => GProject | undefined;
```
Returns first project that matches parojectName. projectName can be optionally assigned when it's created by createProject() function. If not found, returns undefined.



## series()
```js
series(...args: BuildSet[]) => BuildSetSeries;
```
Convert argument list into series type build set.



## parallel()
```js
parallel(...args: BuildSet[]) => BuildSetParallel;
```
Convert argument list into parallel type build set




## Properties

### rtbs
Global RTB list which contains all the RTB instances attached to BuildConfig

### builders
Object containing all the built-in builder classes, which can be used in custom builder creation.

Usage:
```js
const gbm = require('gulp-builder-manager');

class MyBuilder extends gbm.builders.GBuilder {
    // ...
}
```

### plugins
Returns the object containing all the built-in plugin classes, which can be used in custom plugin creation.

Usage:
```js
const gbm = require('gulp-builder-manager');

class MyPlugin extends gbm.builders.GPlugin {
    // ...
}
```

### utils
Object containing built-in utilities.

```js
gbm.utils.is.Array() => boolean;
gbm.utils.is.Object() => boolean;
gbm.utils.is.Arguments() => boolean;
gbm.utils.is.Function() => boolean;
gbm.utils.is.String() => boolean;
gbm.utils.is.Number() => boolean;
gbm.utils.is.Date() => boolean;
gbm.utils.is.RegExp() => boolean;
gbm.utils.is.Error() => boolean;
gbm.utils.is.Symbol() => boolean;
gbm.utils.is.Map() => boolean;
gbm.utils.is.WeakMap() => boolean;
gbm.utils.is.Set() => boolean;
gbm.utils.is.WeakSet() => boolean;

gbm.utils.arrayify<T>(arg?: T | T[]) => T;

//** copy multi-glob files to single destination */
gbm.utils.copy(patterns: string | string[], destPath: string) => Promise<unknown>;

//** load yml and json files
gbm.utils.loadData(globPatterns: string | string[]) => Object;

gbm.utils.wait = (msec: number) => Promise;

//** execute external program asynchronously and returns promise */
gbm.utils.exec(cmd: string | ExternalCommand, args: string[] = [], options: SpawnOptions = {}): Promise<ProcessOutput>;

//** set npm auto install options */
gbm.utils.setNpmOptions(opts: NpmOptions) => NpmOptions;

//** call require() after ensuring the required module is installed */
gbm.utils.requireSafe(id: string) => any;

//** install npm module */
gbm.utils.npmInstall(ids: string | string[], options: NpmOptions = {});

```


### defaultModuleOptions
Object containinig default Node modules options.
```js
const defaultModuleOptions: Options = {
        sass: {
            outputStyle: 'compact',
            includePaths: []
        },
        compass: {
            config_file: './config.rb',
            css: 'css',
            sass: 'assets/scss'
        },
        cssnano: { discardUnused: false },
        imagemin: {
            progressive: true,
            optimizationLevel: 5
        },
        htmlBeautify: {
            indent_char: ' ',
            indent_size: 4
        },
        eslint: { "extends": "eslint:recommended", "rules": { "strict": 1 } },
    }
```
