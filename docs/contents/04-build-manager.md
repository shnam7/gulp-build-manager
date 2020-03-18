---
layout: docs
title: GBuildManager
---

# GBuildManager

This is the main class of Gulp Build Manager. It is immediately available as a unique global instance, when 'gulp-build-manager' is loaded.


## Quick Example
```js
const gbm = require('gulp-build-manager');

const scss = { buildName: 'scss' };
const scripts = { buildName: 'scripts' };

gbm.createProject({scss, scripts})
    .addTrigger('build', /.*/)
    .addCleaner()
    .addWatcher()
    .resolve()
```


---
## createProject()
Create GBuildProject instance and returns it. Note that the instance is not added to project iist of this GBuildManager.
```js
(buildGroup: BuildGroup={}, opts?: ProjectOptions) => GBuildProject
```


---
## addProject()
Add 'project' to project list. If 'project' is path name in string type, then it is loaded from the file using require().
The file loaded should export GBuildProject.
```js
(project: GBuildProject | string) => this;
```

### example
```js
module.exports = gbm.createProject({sass, script})
    .addTrigger('build', /.*/);
```


---
## addBuildItem()
Add BuildConfig item to manager project inside.
```js
(conf: BuildConfig) => this;
```


---
## addTrigger()
Create a new BuildConfig with no build actions, but triggers other build tasks, and add it to manager project inside.
If series is true, then triggered tasks are executed in series. Otherwise, executed in parallel, which is default.
```js
(buildName: string, selector: string | string[] | RegExp | RegExp[], series: boolean = false)
```


---
### addWatcher()
Create a new BuildConfig with build action triggering gulp.watch() and initialize browser reloaders depending on the options, and add it to manager project inside.
```js
(buildName: string, opts:WatcherOptions) => this;
```


---
## addCleaner()
Create a new BuildConfig item with build action cleaning clean targets specified in BuildConfig.clean and opts.clean, and add it to manager project inside.
```js
(buildName: string, opts?: CleanerOptions, selector: string | string[] | RegExp | RegExp[] = /@clean$/) => this;
```


---
## filter()
Returns an array of buildNames that matches the pattern in selector.
All the projects in project list and manager project inside are searched.
```js
(selector: string | string[] | RegExp | RegExp[]) => string[];
```


---
## resolve()
Resolves all the projects in project list and manager project inside.
```js
() => void;
```


---
## series()
Convert args arguments into series type.
```js
(...args: BuildSet[]) => BuildSetSeries;
```


---
## parallel()
Convert args arguments into parallel type.
```js
(...args: BuildSet[]) => BuildSetParallel;
```


---
## Properties

### size
Number of total BuildConfig items in all the projects in project list and manager project.

### buildNames
Array of buildNames from all the projects in project list and manager project inside.

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
gbm.utils.wait(msec: number) => Promise;
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
        htmlPrettify: {
            indent_char: ' ',
            indent_size: 4
        },
        eslint: { "extends": "eslint:recommended", "rules": { "strict": 1 } },
    }
```
