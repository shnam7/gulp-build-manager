---
layout: docs
title: Using Build Manager
---
# {{page.title}}
Build Manager is the main component managing all the build sessions.
Typical configuration looks like this:

```javascript

const gbmConf = {
  builds: [],
  customBuilderDir: [],
  systemBuilds: {
    build: javaScript,
    clean: ['_build'],
    default: ['@clean', '@build'],
  }
};

gbm(gbmConf);
``` 
...
This is the main configuration passed to GulpBuildManager object through gbm.loadBuilders() method.

#### gbmConf.builds
<i>type: BuildSet[]</i><br>
Array of top level BuildSet's. The seres, parallel or dependency relationship between those top-level BuildSet's are not defined here. It will be defined in systemBuild properties.

#### gbmConf.customBuilderDir
<i>type: string | string[], default: undefined</i><br>
Directory location or array of it to search custom Builder classes for. The directory paths are relative to process.cwd().

#### gbmConf.moduleOptions
<i>type: Object, default: undefined</i><br>
Global module options that will override gbm.defaultModuleOptions.

#### gbmConf.systemBuilds
<i>type: Object, default: undefined</i><br>
Defines system builder tasks. All the system builder task names are prefixed with '@'. For example, clean task name becomes '@clean', and so on. 

- systemBuilds.build: <i>type: BuildSet, default: undefined</i><br>
  Main build task, '@build'.
- systemBuilds.clean: <i>type: string } string[], default: undefined</i><br>
  Specifies clean target directories or files. Glob is allowed. Clean targets can also specified in build configurations, and those targets are collected by GCleaner object. If clean target list is not empty, then clean task '@clean' is created.
- systemBuilds.default: <i>type: BuildSet, default: undefined</i><br>
  Specifies default task. default task name 'default' is not prefixed with '@'.
- systemBuilds.watch: <i>type: Object, default: undefined</i><br>
  This has only one sub-property, 'livereload', which is an options object to gulp-livereload. 

```javascript
// gbmConfig example

const gbmConfig = {
  builds: [twig, scss, typescript, images],
  systemBuilds: {
    clean: [destRoot],
    build: gbm.parallel('twig','scss', 'typescript', 'images'),
    default: ['@clean', '@build'],
    watch: {livereload:{start:true}}
  }
};
```







<a name="BuildSet"></a>
# BuildSet
BuildSet is a tree style recursive collection of build configurations. The build configuration here can be one of followings:
- Build configuration object itself
- buildName off the build configuration
- Gulp task name
- Function
- Array of the above
- Another BuildSet instance

BuildSet also also defines the series, parallel or dependency relationship among build configurations. Here are some examples.

```javascript
import gbm from 'gulp-build-manager';

const parallel = gbm.parallel;    // get parallel function from the build manager
const conf = {
  buildName: 'sampleTask',
  builder: done=>done()
};
function unnamedTask(done) { return done(); }

const buildSet1 = ['task1', 'task2']; // two tasks in seres relationship
const buildSet2 = parallel('task1', 'task2'); // two tasks in parallel relationship
const buildSet3 = [buildSet1, buildSet2];     // series relationship
const buildSet4 = [conf, unnamedTask];      // series relationship
const buildSet = parallel(buildSet3, buildSet4);  // parallel
...

```