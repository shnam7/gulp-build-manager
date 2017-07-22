# Basic Concepts

<a name="Builder"></a>
## Builder
Builder can be a function or a class object derived from GBuilder class, or it can be a builder class name(string) itself. Builders are modules thar are actually executing build process according to the build configurations.

<a name="BuildConfiguration"></a>
## Build Configuration
Build configuration is a basic element that defining build task. It has one mandatory property, "buildName" and various optional properties.

#### buildName
<i>type: string</i><br>
Name of the configuration. All the build configurations must have this property. This eventually becomes the gulp task name of the build configuration.

#### src
<i>type: string | string[], default: undefined</i><br>
Glob path or array of glob paths that are referencing source file locations. In implementation perspective, this parameter is delivered to gulp.src() function as it is.

#### order
<i>type: string[], default: undefined</i><br>
Specifies the order of 'src' files. This property is using 'gulp-order' module and the value specified here is passed to it. As an example, `['file2.js','*.js']` specifies 'file2.js' to come first and then all other '*.js' files to follow it. Please refer to the [gulp-order](https://github.com/sirlantis/gulp-order) site for the details. 

#### dest
<i>type: string, default: '.'</i><br>
Output path string. In implementation perspective, this property value is passed to gulp.dest() function as it is.

#### outFile
<i>type: string, default: undefined</i><br>
Output file name. This property can be specified if the output of the build process is a single file. For example, javascript builder can concatenate all the 'src' files into a single output file located in 'dest' directory. In implementation perspective, this property value is passed to gulp.dest() function as it is.

#### buildOptions
<i>type: Object, default: undefined</i><br>
An Object with builder-specific options. System builders are defining their own options and custom builders can

#### moduleOptions
<i>type: Object, default: undefined</i><br>
Builders are typically using one or more gulp plugin modules. This property is an object with properties of options to those modules. Option property names should be the same as the module names without 'gulp-' prefix. If module names are including hyphens, then Camel Case should be used in place of the hyphen. For example, 'gulp-html-prettify' becomes 'htmlPrettify'. Options to 'gulp' itself is set to 'gulp'. 

#### plugins
<i>type: array of plugin objects[], default: undefined</i><br>
List of plugins. Refer to the [Using Plugins](./plugins.html) section.

#### dependencies
<i>type: BuildSet</i><br>
BuildSet which will be executed before this build configuration. 

#### triggers
<i>type: BuildSet</i><br>
BuildSet which will be executed after this build configuration.

#### clean
<i>type: string[], default: undefined</i><br>
Clean list that will be cleaned/erased by '@clean' task, which can be created according to the gbmConfig settings.

#### watch
<i>type: Object, default: undefined</i><br>
Override default Watch configuration.
- watch.watched(string[]): List of glob string referencing watch targets. Default value is set to 'src' property of build configuration. Watch service is enabled by default. Yo disable it, set this value to empty array([]).

- watch.livereload(boolean): enable or disable livereload. Default value is false(disabled).

```javascript
// Build Configuration Example

const scss = {
  buildName: 'scss',
  builder: 'GCSSBuilder',

  src: [upath.join(srcRoot, 'scss/**/*.scss')],
  dest: upath.join(destRoot, 'css'),
  buildOptions: {
    sourceMap: true,
    minify: true,
    postcss: true
  },
  moduleOptions: {
    postcss: {
      plugins:[
        require('postcss-cssnext')({features:{rem: false}}),
        require('postcss-utilities')(),
        require('lost')(),
        require('postcss-assets')({
          loadPaths:[upath.join(srcRoot, 'images')],
        }),
        require('postcss-inline-svg')(),
      ]
    },
  },
  dependencies: ['task1', 'task2']; // those two will be executed in series
  triggers: gbm.parallel('task3', 'task4'); // those two will be executed in parallel
  
  watch: { livereload:true },
  
  plugins:[
    stream=>stream.pipe(require('gulp-debug')())
  ]
};

```

<a name="BuildSet"></a>
## BuildSet
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

<a name="gbmConfig"></a>
## gbmConfig
This is the main configuration passed to GulpBuildManager object through gbm.loadBuilders() method.

#### builds
<i>type: BuildSet[]</i><br>
Array of top level BuildSet's. The seres, parallel or dependency relationship between those top-level BuildSet's are not defined here. It will be defined in systemBuild properties.

#### customBuilderDir
<i>type: string | string[], default: undefined</i><br>
Directory location or array of it to search custom Builder classes for. The directory paths are relative to process.cwd().

#### moduleOptions
<i>type: Object, default: undefined</i><br>
Global module options that will override gbm.defaultModuleOptions.

#### systemBuilds
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