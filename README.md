# gulp-build-manager
Gulp Build Manager enables gulp task to be created or customized easily and quickly by using simple configurations.
It provides the convenience lisk grunt with flexibility of gulp.


### Installation
gulp-build-manager is developed using gulp 4.x with babel support.
So, it's recommended to use the sames tools, even though it's not mandatory.
To have the development environment set, follow the commands below:
```bash
npm install gulp -g
npm install gulpjs/gulp.git#4.0 --save-dev

npm i gulp-build-manager --save-dev
```
To enable es6, be sure to have .babelrc file with contents below:
```javascript
{
  "presets": ["es2015"]
}
```

### Using command line tool 'gbm' to setup initial project frame with example config
```javascript
npm install gulp-build-manager -g
gbm init
```
This will create an initial project framework with example build configurations in current directory.
If you want to set it up in a different directory, unpm versose 'gbm init <dir-name>'.

### Preparing gulpfile with babel support
Gulp 4.x supports babel, so to use it just create 'gulpfile.babel.js', instead of 'gulpfile.js' with contents below.
```javascript
'use strict';
process.chdir(__dirname);

import gbm from 'gulp-build-manager';
gbm.loadBuilders('./gulp/gbmConfig.js');
```

### Creating main configuration file: 'gbmConfig.js'
```javascript
'use strict';
import buildSet from 'gulp-build-manager/lib/buildSet';

const gbmConfig = {
  srcRoot: 'assets',
  destRoot: '_build',
  customBuilderDir: './custom-builders',

  builds: [
    './builds/sass',
    './builds/javascript',
  ],

  // create system tasks: '@clean', '@build', '@watch', 'default'
  systemBuilds: {
    clean: ['_build' ],
    build: buildSet('sass','javascript'),
    watch: true,
    default: ['@clean', '@build'],
  },
};

module.exports = gbmConfig;
export default gbmConfig;
```
According to this configuration, GulpBuildManager will load two build definitions,
'./builds/sass', './builds/javascript', and create 4 system tasks: '@clean', '@build', '@watch', 'default'


### Creating build definition files
Build definition is an object {} with mandatory property 'buildName', or an array of such build definition objects.
Single build definition object creates a single task. The 'buildName' of each build definition can be used in
Each build definition can have 'dependencies' property which is playing the same role of gulp.series()
or gulp.parallel() for the gulp.task(name [, deps] [, fn]) 'deps' parameter.
If necessary, Build definition can be 
Basuically, Array of build definitions creates series task. To have parallel tasks, embrace the buildname's
or build definitions with buildSet().
For more details on buildSet(), please refer to the buildSet section.

#### Example: build definition with single object
```javascript
export default module.exports = {
    buildName: 'javascript',
    builder: 'GJavaScriptBuilder',
    src: ['scripts/{coffee,ts}/{*,js/*}.js'],
    dest: 'js',
    outfile: 'sample.js',
  }
```

#### Example: build definition with multiple objects and dependencies
```javascript
import buildSet from 'gulp-build-manager/lib/buildSet';

export default module.exports = [
  {
    buildName: 'javascript:utils',
    builder: 'GJavaScriptBuilder',
    src: ['scripts/{coffee,ts}/{*,js/*}.js'],
    dest: 'js',
    outfile: 'sample.js',
  },
  {
    buildName: 'javascript:main',
    builder: 'GJavaScriptBuilder',
    src: ['docs/scripts/{coffee,ts}/{*,js/*}.js'],
    dest: 'docs/js',
    outfile: 'docs.js',
   },
   {
     buildName:'javascript',
     dependencies:['javascript:utils', 'javascript:main']   // create series task
   },
   {
     buildName:'all',
     dependencies: buildSet(  // create parallel task
       'sass',
       ['javascript:utils', 'javascript:main'],
       'images', 'copy', 'other-tasks'
       )
   }
  ]
```
```javascript
/**
 * config for sass/scss builds
 *
 */

import gbmCofig from '../gbmConfig';
import upath from 'upath';

const srcRoot = gbmCofig.srcRoot;
const destRoot = gbmCofig.destRoot;

export default module.exports = [
  {
    buildName: 'sass',
    builder: 'GSassBuilder',
    src: [
      upath.join(srcRoot, 'scss/**/*.scss'),
      upath.join(srcRoot, 'sass/**/*.sass')
    ],
    dest: upath.join(destRoot, 'css'),
    buildOptions: {
      enableLint: false,
      enablePostCSS: true,
      postcss: {
        plugins:[
          require('postcss-cssnext'),
          require('postcss-utilities'),
        ]
      }
    },
    moduleOptions: {
      sass: {
        includePaths: [
          'bower_components',
          'assets/scss'
        ]
      },
      postcss: {
      }
    },
    watch: {
      livereload: true
    }
  },
];

```

### Build definition object properties

##### buildName: string
This is the only mandatory property to define a build task. The string specified here will be the name of gulp task that is created by the specified builder.  

##### builder: string | function(defaultModuleOptions, conf, done) {}
Name of builder class or custom function to be executed.
The customBuildDir, which is specified in the gbmConfig.js will be searched first, and if not found, built-in default builders of the same name will be searched. With this search sequence, users can have chance to overload default builders.
Currently available builders are:
```
 - GBuilder: General (Copy) Builder, which just executes user defined custom function.
   This is the base class of all builders. 
 - GSassBuilder: Sass/Scss builder, using gulp-sass.
   PostCSS is optionally available by setting buildOptions.enablePostCSS to true in the build definition file.
 - GCoffeeScriptBuilder: CoffeeScript builder, using gulp-coffee
 - GTypeScriptBuilder: TypeScript builder, using gulp-typescript
 - GJavaScriptBuilder: JavaScript builder, which combines javascript files into a single output file.
 - GMarkdownBuilder: Markdown builder, which converts markdown files into html
 - GPaniniBuilder: Panini builder
 - GTwigBuilder: Twig builder
 - GPostCSSBuilder: PostCSS builder
 - GImagesBuilder: Image Optimizer, using gulp-images
 - GCopyBuillder: Copies source files to destination
```
To look into the details on actual build operations executed by each builders, please refer to the src folder in the github [src/builders](https://github.com/shnam7/gulp-build-manager/tree/master/src/builders)

##### src
glob set for source file which is to be delivered to gulp.src()

##### dest
Destination path which is to be delivered to gulp.dest()

##### buildOptions: Object {}
Builder specific options. Each builders could have their own options sets.

##### moduleOptions: Object {}
Options for modules loaded by builders.

##### watch: Object {}
- name:watcher name. builderName will be used by default if this is not specified
- watched:[]: glob of watched targets. src values will be used if this is not specified
- task: gulp task to be executed when changes are detected
- livereload: if set to true, livereload will be called at the end of gulp pipe() chains.


### Custom class
Create custom builder classes by placing custom builder class file in the locations specified by customBuilderDir property in gbmConfig.js.
customBuildDir property can be a string of single path, or array of multiple paths.
GBuilder is the base class of all other builders, and it provides following overloadable methods.
```javascript
import GBuilder from 'gulp-build-manager/lib/builders/GBuilder';

class GCustomTestBuilder extends GBuilder {
  constructor() { super(); }

  build(defaultModuleOptions, conf, done) {
    console.log('GCustomBuilder::build() called. continuing the build process...');
    return super.build(defaultModuleOptions, conf, done);
  }

  OnInitModuleOptions(mopts, defaultModuleOptions, conf) {
    console.log('GCustomBuilder::OnInitModuleOptions() called. continuing the build process...');
    return super.OnInitModuleOptions(mopts, defaultModuleOptions, conf);
  }

  OnBuilderModuleOptions(mopts, defaultModuleOptions, conf) {
    console.log('GCustomBuilder::OnBuilderModuleOptions() called. continuing the build process...');
    return super.OnBuilderModuleOptions(mopts, defaultModuleOptions, conf);
  }

  OnInitStream(mopts, defaultModuleOptions, conf) {
    console.log('GCustomBuilder::OnInitStream() called. continuing the build process...');
    return super.OnInitStream(mopts, defaultModuleOptions, conf);
  }

  OnBuild(stream, mopts, conf) {
    console.log('GCustomBuilder::OnBuild() called. continuing the build process...');
    return super.OnBuild(stream, mopts, conf);
  }

  OnDest(stream, mopts, conf) {
    console.log('GCustomBuilder::OnDest() called. continuing the build process...');
    return super.OnDest(stream, mopts, conf);
  }
}

export default GCustomTestBuilder;
module.exports = GCustomTestBuilder;
```
Custom builders can extend GBuilder or any other Existing builders. Above example shows available overloading functions.

#### GBuilder methods for overloading
##### build(defaultModuleOptions, conf, done):
Entire build process.
done() is called to signal end of process if build finishes without error but no stream(ex:empty src).
Returns a stream of Vinyl files stream.

##### OnInitModuleOptions(mopts, defaultModuleOptions, conf)
* mopts: is a collection of option for npm modules used in the build process.
* defaultModuleOptions: collection of module options defined in gbmConfig.js.
* conf: Single build definition (not array)
Initializing module options, mopts, which will be used in the build process.
Changed applied to 'mopts' will be reflected to whole subsequent build processes.
Returned option values of Object type({}) will be merged to mopts, too.
If mopts has all the necessary updates, nothing need to be returned.
Returns nothing(undefned) or addition option values of Object type.

##### OnBuilderModuleOptions(mopts, defaultModuleOptions, conf)
This is called by OnInitModuleOptions() to give a chance to specify builder specific module options.
Same arguments and return value.

##### OnInitStream(mopts, defaultModuleOptions, conf)
Initializing build stream.
Default OnInitStream() calls gulp.src() with 'plumber' and 'changed' function applied.
Returns the stream created.

##### OnBuild(stream, mopts, conf)
* stream: Vinyl stream returned from OnInitStream()
Body of build process, not including gulp.src() and gulp.dest()
Default OnBuild() just returns the stream

##### OnDest(stream, mopts, conf)
Finalizing gulp stream.
Default OnDest() simply calls gulp.dest()
Returns the stream.

##### OnWatch(stream, mopts, conf)
Check for Watch.
Default OnWatch() check 'watch.livereload' property of build definition,
and calls livereload() on the stream if if it's set to true.
Options for livereload() can be delivered in mopts (moduleOptions property of build definition) 
Returns stream.

#### Example: adding debug() function to GSassBuilder stream
```javascript
'use strict';
import GSassBuilder from '../../../lib/builders/GSassBuilder';
import debug from 'gulp-debug';

class GSassBuilderWithDebug extends GSassBuilder {
  OnInitStream(mopts, defaultModuleOptions, conf) {
    return super.OnInitStream(mopts, defaultModuleOptions, conf)
      .pipe(debug());
  }
}

export default GSassBuilderWithDebug;
module.exports = GSassBuilderWithDebug;
```


### buildSet(...args)
buildSet() is a function to create 'BuildSet' class object. It accepts single or multiple items if type:
* build name: string
* build definition: single build definition object or array of build definition objects
* buildSet itself (Actually a BuildSet class object)
BuildSet class object returned from buildSet() function resolves build definitions, dependencies,
and the type of dependencies(series or parallel)


### PostCSS support in GSassBuilder
Built-in default sass builder, GSassBuilder supports PostCSS, which means we can use sass/scss with postcss features such as postcss-cssnext, postcss-utilities, lost grid systems, etc.
This makes style sheet development much fun and efficient.
For the details, please refer to the example code in [github](https://github.com/shnam7/gulp-build-manager/tree/master/example).
Here's a sample sass build definition:
```javascript
/**
 * config for sass/scss builds
 *
 */

import gbmCofig from '../gbmConfig';
import upath from 'upath';

const srcRoot = gbmCofig.srcRoot;
const destRoot = gbmCofig.destRoot;

export default module.exports = [
  {
    buildName: 'sass',
    builder: 'GSassBuilder',
    src: [
      upath.join(srcRoot, 'scss/**/*.scss'),
      upath.join(srcRoot, 'sass/**/*.sass')
    ],
    dest: upath.join(destRoot, 'css'),
    buildOptions: {
      enableLint: false,
      enablePostCSS: true,
      postcss: {
        plugins:[
          require('postcss-cssnext'),
          require('postcss-utilities'),
        ]
      }
    },
    moduleOptions: {
      sass: {
        includePaths: [
          'bower_components/gridle/sass',
          'bower_components/uikit/scss',
          'bower_components',
          'd:/web/lib/wcl/assets/scss',
          'assets/scss'
        ]
      },
      postcss: {
      }
    },
    watch: {
      livereload: true
    }
  },
];
```

### Working Example
To see a working example with various build definitions and custom builders,
please refer to the github [example](https://github.com/shnam7/gulp-build-manager/tree/master/example)
