---
layout: docs
---

# Using Builders

## What is Builder?
Builder is essentially a gulp tasks to achieve project mission. Typically, it reads input from source directories, processes them, and writes the output to destination directory.
Builder can be a single function or a class object derived from GBuilder class.
To use builders, *Build Configuration* need to be created first. 

## Build Configuration
Typical build configuration looks like this:
```javascript
const conf = {
  buildName: 'javaScript',
  builder: 'GJavaScriptBuilder',
  src: ['assets/scripts/js/**/*.js'],
  order:['main.js'],
  dest: '_build/js',
  outFile: 'sample.js',
  buildOptions: {
    sourceMap: true,
    minify: true,
    //  ...
  },
  moduleOptions: {
    // ...
  },
  plugins:[
    stream=>stream.pipe(require('gulp-debug')())
  ],
  dependencies: ['task1', 'task2'], // [...] is equivalent to gbm.series(...)
  triggers: gbm.parallel('task3', 'task4'),
  clean:['_build/js'],
  watch:{
    watched:[
      // ...
    ],
    livereload: true
  }
};
```
Build Configuration has a common set of pre-defined properties, but users can add custom properties which are to be consumed by custom builders.
Builder is specified in conf.builder property. See below for mre details.


### Build Configuration Options
{:#buildConfigurationOptions}

#### conf.buildName
<i>type: string</i><br>
<i>default: undefined</i><br>
Name of the build configuration. This is used to set gulp task name of the build configuration, and can be used to set task dependencies.

##### conf.builder
<i>type: string | GBuilder or its derivatives | function(done)</i><br>
<i>default: function(done) { done(); }</i><br>
Name of builder class in string or in class name. Or it can be a function that can be passed to a gulp.task().
If class name is specified as a string, directory locations specified by gbmConfig.customBuildDir in build manager options will be searched first for the class definition, and then built-in builders will be checked. This sequence will give you a chance to overload built-in builder classes with the same name.

#### conf.src
<i>type: string | string[]</i><br>
<i>default: undefined</i><br>
Glob path or array of glob paths that are referencing source files or directories. In implementation perspective, this parameter is delivered to gulp.src() function as it is to create input stream.

#### conf.order
<i>type: string[]</i><br>
<i>default: undefined</i><br>
Specifies the order of the files in input stream. This property is using 'gulp-order' module and the value specified here is passed to it. As an example, `['file2.js','*.js']` specifies 'file2.js' to come first and then all other '*.js' files to be follow. Please refer to the [gulp-order](https://github.com/sirlantis/gulp-order) site for the details. 

#### conf.dest
<i>type: string</i><br>
<i>default: '.'</i><br>
Output path string. In implementation perspective, this property value is passed to gulp.dest() function as it is.

#### conf.outFile
<i>type: string</i><br>
<i>default: undefined</i><br>
Output file name. This property can be optionally specified if the output of the build process is to be a single file. For example, javascript builder can concatenate all the files in input stream into a single output file in conf.dest directory.

#### conf.flushStream
{:#flushStream}
<i>type: boolean</i><br>
<i>default: false</i><br>
Gulp tasks run in parallel. Sometimes, they are finishes even though file writing is still in progress. If this option is set to true, the gulp task running this build configuration will not finish until it finishes all the file writings are finishes. If one task depends on output files of another task, this is where it plays in.

#### conf.buildOptions
<i>type: Object</i><br>
<i>default: {}</i><br>
An Object with builder-specific options.

#### moduleOptions
<i>type: Object</i><br>
<i>default: {}</i><br>
Builders are typically using one or more gulp plugin modules. This property is used to set options for those modules. The property name of the module options should be the same as the module name without 'gulp-' prefix. If module name is including hyphens, then Camel Case should be used in place of the hyphen. For example, options for 'gulp-html-prettify' will be conf.moduleOptions.htmlPrettify'. Options to 'gulp' itself is set to 'conf.moduleOptions.gulp'. 

#### conf.plugins
<i>type: array of plugin objects</i><br>
<i>default: []</i><br>
List of plugins. Refer to [Using Plugins]({{site.baseurl}}/plugins/using-plugins) section to learn about plugins.

#### conf.dependencies
<i>type: BuildSet</i><br>
<i>default: undefined</i><br>
Specifies BuildSet, the build configurations to be executed before this build configuration. See [BuildSet](#BuildSet) for the details.
 
#### conf.triggers
<i>type: BuildSet</i><br>
<i>default: undefined</i><br>
Specifies BuildSet, the build configurations to be executed after this build configuration. See [BuildSet](#BuildSet) for the details.

#### conf.clean
<i>type: string[]</i><br>
<i>default: undefined</i><br>
Clean list that will be cleaned/erased by '@clean' task, which is to be created by build manager.

#### conf.watch
<i>type: Object</i><br>
<i>default: undefined</i><br>
Override default Watch configuration.

#### conf.watch.watched
<i>type: string[]</i><br>
<i>default: conf.src</i><br>
List of glob string referencing watch targets. Default value is set to conf.src. Watch service is enabled by default. You can disable it by setting this value to empty array([]).

#### conf.watch.watchedPlus
<i>type: string[]</i><br>
<i>default: undefined</i><br>
List of glob string referencing additional watch targets. This option can be useful when additional watch target need to be added to default conf.watched value.

#### conf.watch.livereload
<i>type: boolean | Object</i><br>
<i>default: false</i><br>
Enable or disable livereload. The value can be options object to gulp-livereload module.


### BuildSet
{: #BuildSet}
BuildSet is a collection of build configurations with series or parallel dependency relationships. BuildSet can be any of the following:
  1. conf.buildName: string
  2. conf: Build configuration object itself
  3. function: builder function
  4. gulp task name (string)
  5. Another BuildSet object
  6. array of the above.
  7. gbm.series(any list of the above): this returns 5(Another BuildSet)
  8. gbm.parallel(any list of the above): this returns 5(Another BuildSet)

#### Examples
```javascript
const gbm = require('gulp-build-manager');
const gulp = require('gulp');

const task1 = {
  buildName: 'task1'
};

const task2 = {
  buildName: 'task2'
};

function task3(done) {
  //...
  done();
}

gulp.task('task4', (done)=>done());

// BuildSet examples
const set01 = [task1];
const set02 = [task1, task2, task3, 'task4']; // series
const set03 = gbm.series('task1', 'task2'); // same as set02
const set04 = gbm.parallel('task1', 'task2');
const set05 = 'task1';
const set06 = ['task1', 'task2'];
const set07 = gbm.series(task1, task2, task3); // same as set02
const set08 = gbm.parallel(task1, task2);
const set09 = gbm.parallel(
  [set01, set02, gbm.parallel(set03,set04)],  // series
  set05,
  task3,
  'task4',
  (done)=>done()
);

const build = gbm.parallel(set01,set02,set03,set04,set05,set06,set07,set08,set09);

// create build tasks
gbm({
  systemBuilds: {
    build: build
  }
});
```
 
 
 