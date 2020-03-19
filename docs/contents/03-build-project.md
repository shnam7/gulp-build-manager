---
layout: docs
title: GBuildProject
---

# GBuildProject

GBuildProject is a class managing a collection of BuildConfig objects. Typically, BuildConfig items are added to GBuildProject instance and resolved generating relevant gulp tasks.

Every GBuildProject instance has its own GWtacher and GCleaner. Browser reloading is supported by the GWatcher instance.


## Types
```js
BuildGroup = {
    [key: string]: BuildConfig;
}

ProjectOptions = {
    projectName?: string;
    prefix?: string;
    customBuilderDirs?: string | string[];
};

CleanerOptions extends del.Options {    // extends options from 'del' node module
    clean?: string | string[];
};
```

## Quick Example
```js
const gbm = require('gulp-build-manager');

const sass = { buildName: 'sass' }
const scripts = { buildName: 'scripts' }

const buildGroup = {sass, styles};
gbm.createProject(buildGroup).resolve();

```


---
## constructor()
Create GBuildProject and initialize it with buildGroup.
```js
(buildGroup: BuildGroup = {}, options: ProjectOptions = {}) => void;
```


---
## addBuildItem()
Add BuildConfig item. Returns itself.
```js
(conf: BuildConfig) => this;
```

---
## addBuildGroup()
Register BuildConfig objects specified in buildGroup argument into the project. Single BuildConfig argument is also accepted.
```js
(buildGroup: BuildGroup | BuildConfig) => this;
```


---
## addTrigger
Create a new BuildConfig with no build actions, but triggers other build tasks. Returns itself.
```js
(buildName: string, buildNames: string | string[], opts: TriggerOptions={}) => this;
```


---
## addVars()
Add key/value pairs into project-wide variable list, which is accessible using 'vars' property.
```js
(vars: { [key: string]: any }) => this;
```


---
## addWatcher()
Create a new BuildConfig with build action initiating gulp.watch() and browser reloaders depending on the options. Returns itself.
```js
(buildName = '@watch', opts?: WatcherOptions) => this;

export interface ReloaderOptions extends Options {
    reloadOnChange?: boolean;       // default is true
}

export interface WatcherOptions extends ReloaderOptions {
    watch?: string | string[];      // pure watching: watched files to be reloaded on change w/o build actions
    browserSync?: ReloaderOptions;  // browserSync initializer options
    livereload?: ReloaderOptions;   // livereload initializer options
}
```


---
## addCleaner()
Create GCleaner object for this project. Additional clean targets can be specified in opts.clean.
```js
(buildName = '@clean', opts?: CleanerOptions) => this;
```


---
## filter()
Returns list of buildNames, from registered BuildConfig objects, that matches to the pattern specified in selector parameter.
RegExp is supported.
```js
(selector: string | string[] | RegExp | RegExp[]): string[];
```


---
## resolve()
Analyze all the BuildConfig object registered and actually creates gulp tasks according to it. Until resolve() is called, no gulp task is created.
```js
() => this;
```


---
## size
Number of total BuildConfig objects in this project.


---
## projectName
projectName specified in ProjectOptions when this instance is created. If not specified, empty string "" is returned.


---
## prefix
prefix specified in ProjectOptions when this instance is created.
() { return this._options.prefix; }


---
## vars
Object with key/value pairs which were added using addVar() function. Typically, used to share data between projects and GBuildManager in multi-file projects.


---
## buildNames
List of buildNames of all the registered BuildConfig objects in the project.


---
## watcher
GWatcher object specific to this project.


---
## GBuildProject.series()
Static function. Convert BuildSet arguments into a series type BuildSet.
```js
(...args: BuildSet[]) => BuildSetSeries;
```


---
## GBuildProject.parallel()
Static function. Convert BuildSet arguments into a parallel type BuildSet.
```js
(...args: BuildSet[]) => BuildSetParallel;
```
