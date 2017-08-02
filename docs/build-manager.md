---
layout: docs
title: Using Build Manager
---
# {{page.title}}
gbm, the build manager, creates gulp tasks according to the options given to it.<br>

```javascript
// Build Manager
const gbm = require('gulp-build-manager');

// config for build manager
const gbmConfig = {
  builds: [twig, scss, typescript, images],
  customBuilderDir: [], // optional
  systemBuilds: {
    clean: [destRoot],
    build: gbm.parallel('twig','scss', 'typescript', 'images'),
    default: ['@clean', '@build'],
    watch: {livereload:{start:true}}
  }
};

// create gulp tasks as configured
gbm(gbmConfig); // or gbm.loadBuilders(gbmConfig);

``` 

## Options

#### gbmConfig.builds
<i>type: BuildSet[]</i><br>
<i>default: undefined</i><br>
Single or an aray of top level build configurations. Even though array notation [] is used to form a list, it does not mean those tasks are grouped in series. For example, ['task1', 'task'] will creates two independent gulp tasks, 'task1' and 'task2'.

#### gbmConfig.customBuilderDir
<i>type: string | string[]</i><br>
<i>default: undefined</i><br>
Path or an array of paths to search for custom Builder classes. You can store your custom builders in this directories, and specify its name as a string in conf.builder of build configuration.

#### gbmConfig.moduleOptions
<i>type: Object</i><br>
<i>default: {}</i><br>
Global module options that will override gbm.defaultModuleOptions.
If build configuration does not specify options for modules, the options specified will be used.

#### gbmConfig.systemBuilds
<i>type: Object</i><br>
<i>default: {}</i><br>
Configures four system build tasks, @build, @clean, default, and @watch. '@' is prefixed to distinguish system build task from other tasks except default task.
If no configuration is specified, the task will not be created.

##### gbmConfig.systemBuilds.build
<i>type: BuildSet</i><br>
<i>default: undefined</i><br>
Configures @build task. Typically, this is the main build task that builds everything.

##### gbmConfig.systemBuilds.clean
<i>type: string[]</i><br>
<i>default: []</i><br>
Configures @clean task. Glob is allowed. All the clean targets specified here will be cleaned/removed. The clean targets specified in each build configurations will be cleaned independently of this. If no clean targets are specified both here and in build configurations, then @clean task will not be created.

##### gbmConfig.systemBuilds.default
<i>type: BuildSet</i><br>
<i>default: undefined</i><br>
Configures default task that will be executed by 'gulp' command.


##### gbmConfig.systemBuilds.watch
conf.watch
type: Object
default: undefined
Configures @watch task. All the watch items specified in each build configurations will be monitored in this @watch task.

##### gbmConfig.systemBuilds.watch.livereload
<i>type: Object</i><br>
<i>default: undefined</i><br>
Specifies livereload option. By default, it's disabled. To turn on it, set the value here to {livereload:{start:true}}.
 For more options on livereload, see [livereload](https://github.com/vohof/gulp-livereload#options-optional).
<br><br>


## API
#### gbm.series(...tasks)
Creates and returns a BuildSet that contains tasks to executed in series.
This is equivalent to \[...tasks\].

#### gbm.parallel(...tasks)
Creates and returns a BuildSet that contains tasks to executed in parallel.

#### gbm.\<builderName\>
returns the built-in builder class with the name \<builderName\>. Currently available built-in builders are:
  - gbm.GBuilder - Base Builder, which work as a Copy Builder.
  - gbm.GCoffeeScriptBuilder
  - gbm.GConcatBuilder
  - gbm.GCSSBuilder - sass/scss/less/postcss builder.
  - gbm.GImagesBuilder - Image optimizer
  - gbm.GJavaScriptBuilder
  - gbm.GJekyllBuilder
  - gbm.GMarkdownBuilder
  - gbm.GPaniniBuilder
  - gbm.GTwigBuilder
  - gbm.GTypeScriptBuilder
  - gbm.GWebPackBuilder
  - gbm.GZipBuilder - File packer for distribution

#### gbm.\<pluginName\>
returns the built-in plugin class with the name \<pluginName\>. Currently available built-in plugins are:
  - gbm.ChangedPlugin
  - gbm.CoffeeScriptPlugin
  - gbm.ConcatPlugin
  - gbm.CSSNanoPlugin
  - gbm.CSSPlugin
  - gbm.DebugPlugin
  - gbm.FilterPlugin
  - gbm.JavaScriptPlugin
  - gbm.PlumberPlugin
  - gbm.TwigPlugin
  - gbm.TypeScriptPlugin
  - gbm.UglifyPlugin
  - gbm.WebPackPlugin
  