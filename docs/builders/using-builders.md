---
layout: docs
title: Using builders
---
# {{page.title}}

## What is Builder?
Builder is a set of gulp tasks to achieve project mission. Typically, it reads input from source directories, processes them, and writes output to destination directory.
Builder can be a single function or a class object derived from GBuilder class. Builders share a common set of <em>build configurations</em> and sometimes have their own set of additional configuratipns.

## Common Build Configuration Properties
Typical build configurations look like this:
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

#### conf.buildName
<i>type: string</i><br>
Name of the configuration. All the build configurations must have this property. This eventually becomes the gulp task name of the build configuration.

#### conf.src
<i>type: string | string[], default: undefined</i><br>
Glob path or array of glob paths that are referencing source file locations. In implementation perspective, this parameter is delivered to gulp.src() function as it is.

#### conf.order
<i>type: string[], default: undefined</i><br>
Specifies the order of 'src' files. This property is using 'gulp-order' module and the value specified here is passed to it. As an example, `['file2.js','*.js']` specifies 'file2.js' to come first and then all other '*.js' files to follow it. Please refer to the [gulp-order](https://github.com/sirlantis/gulp-order) site for the details. 

#### conf.dest
<i>type: string, default: '.'</i><br>
Output path string. In implementation perspective, this property value is passed to gulp.dest() function as it is.

#### conf.outFile
<i>type: string, default: undefined</i><br>
Output file name. This property can be specified if the output of the build process is a single file. For example, javascript builder can concatenate all the 'src' files into a single output file located in 'dest' directory. In implementation perspective, this property value is passed to gulp.dest() function as it is.

#### conf.buildOptions
<i>type: Object, default: undefined</i><br>
An Object with builder-specific options. System builders are defining their own options and custom builders can

#### moduleOptions
<i>type: Object, default: undefined</i><br>
Builders are typically using one or more gulp plugin modules. This property is an object with properties of options to those modules. Option property names should be the same as the module names without 'gulp-' prefix. If module names are including hyphens, then Camel Case should be used in place of the hyphen. For example, 'gulp-html-prettify' becomes 'htmlPrettify'. Options to 'gulp' itself is set to 'gulp'. 

#### conf.plugins
<i>type: array of plugin objects[], default: undefined</i><br>
List of plugins. Refer to the [Using Plugins](./plugins.html) section.

#### conf.dependencies
<i>type: BuildSet</i><br>
BuildSet which will be executed before this build configuration. 

#### conf.triggers
<i>type: BuildSet</i><br>
BuildSet which will be executed after this build configuration.

#### conf.clean
<i>type: string[], default: undefined</i><br>
Clean list that will be cleaned/erased by '@clean' task, which can be created according to the gbmConfig settings.

#### conf.watch
<i>type: Object, default: undefined</i><br>
Override default Watch configuration.
- watch.watched(string[]): List of glob string referencing watch targets. Default value is set to 'src' property of build configuration. Watch service is enabled by default. Yo disable it, set this value to empty array([]).

- watch.livereload(boolean): enable or disable livereload. Default value is false(disabled).
