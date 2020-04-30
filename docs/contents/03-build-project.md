---
id: build-project
title: GProject
---

# GProject class

GProject is a class managing a collection of BuildConfig objects. Typically, BuildConfig item is added to GProject instance, and at this moment, it is resolved getting relevant gulp task and RTB instance attached.

GProject instance can also create watcher and cleaner tasks. Browser reloading is also supported as part of watch taask.

GProject instances can be created by calling gbm.createProject().



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
const proj = gbm.createProject(buildGroup);   // returns GProject instance
```


---
## Member functions
---

### constructor()
```js
constructor(buildGroup: BuildConfig | BuildGroup = {}, options: ProjectOptions = {});
```

Create GProject and initialize it with buildGroup. Initial buildGroup can be a single BuildConfig item or a collection of BuildConfig items in BuildGroup object. buildGrop is empty, then empty project is created.



### addBuildItem()
```js
addBuildItem(conf: BuildConfig) => this;
```

Add single BuildConfig item, conf, to the project after resolving it. When a BuildConfig item is resolved, following actions takse place:
- Create RTB instance initialized with conf.
- ProjectOptions.prefix is specified, it is prepended tp conf.buildName. (buildName mangling to avoid gulp task name collision)
- A new gulp task is created with the prefixed conf.buildName, and task function to execute RTB's build sequences.


### addBuildItems()
```js
addBuildItems(items: BuildGroup | BuildConfig) => this
```

Add single or multiple BuildConfig objects to the project using addBuildItem() function.


### addWatcher()
```js
addWatcher(buildName = '@watch') => this;
addWatcher(options: WatchOptions = {}, buildName = '@watch') => this;
```

Create watch task which monitors all the watch targets of each build items in the project. Watch targets for single BuildConfig item is determined by this rule:
- If conf.watch is specified, add it to watch target.
- If conf.watch is not specified, conf.src is added to watch target.
- If conf.watch is set to empty array([]), then conf.src is not added to watch target.
- If conf.addWatch is specified, add it to watch target.

##### available options
- options.watch: additional watch targets (string | strinig[]). Glob is supported.
- options.browserSync: browser-sync module options.
- options.livereload: livereload module options.


### addCleaner()
```js
addCleaner(buildName = '@clean') => this;
addCleaner(options: string | CleanOptions = {}, buildName = '@clean') => this;
```

Create cleaner task which cleans all the clean targets of each build items in the project. Clean targets of single BuildConfig item is specified in conf.clean property.

##### available options
- options.clean: additional clean targets (string | strinig[]). Glob is supported.


### addVars()
```js
addVars(vars: { [key: string]: any }) => this;
```

Add key/value pairs into project-wide variable list, which is accessible using project.vars property. This is typically used to deliver project specific data to GBuildManager[0] for multi-project management.

**example**
```js
const pro = gbm.createProject().addVar({ port: 1000 });

console.log(proj.vars.port) // this will print 1000
```


### getBuildNames()
```js
type BuildNameSelector = string | string[] | RegExp | RegExp[];

getBuildNames(selector: BuildNameSelector) => string[];
```

Returns list of buildNames that matches the selector pattern from the build items in the project.



---
## Properties
---

### projectName
projectName specified in ProjectOptions when the project instance is created. If not not available, empty string "" is returned.


### rtbs
Array of RTB instances created by build items in the project.


### prefix
prefix specified in ProjectOptions when this instance is created.


### vars
Object with key/value pairs which were added by addVar() function. Typically, used to share data between projects and GBuildManager in multi-file projects.



[0]:04-build-manager.md
