# gulp-build-manager
Gulp Build Manager enables gulp task to be created or customized easily and quickly by using simple configurations, but with more flexiility leveraging javascript.


### Installation
gulp-build-manager is developed using gulp 4.x with babel support. So, it's recommended to use the sames tools, even though it's not mandatory.
To have the development environment set, follow the commands below:
```bash
npm install gulp -g
npm install gulpjs/gulp.git#4.0 --save-dev

npm i gulp-build-manager --save-dev
```

### Preparing gulpfile with babel support
Gulp 4.x supports babel, so to use it just create 'gulpfile.babel.js', instead of 'gulpfile.js' with contents below.
```javascript
'use strict';
process.chdir(__dirname);

import gbm from 'gulp-build-manager';
gbm.loadBuilders('./gulp/gbmconfig.js');
```

### Creating gulp-build-manager main configuration file: './gulp/gbmconfig.js'
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
According to this configuration, GulpBuildManager will load two build definitions, './builds/sass', './builds/javascript', and create 4 system tasks: '@clean', '@build', '@watch', 'default'


### Creating build definition files
Build definition files are described with an object {}, or array of objects like [{},{}...].
Single object means a single task, array of object means series of multiple tasks.
To have parallel tasks, embrace the definitions with buildSet().
For more details on buildSet(), please refer to the buildSet section.

```javascript
import gbmCofig from '../gbmconfig';
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
      enableLint: false
    },
    moduleOptions: {
      sass: {
        includePaths: [
          'bower_components/gridle/sass',
          'bower_components/uikit/scss',
          'bower_components',
          'assets/scss'
        ]
      }
    },
    watch: {
      livereload: true
    }
  },
];
```

#### Build Object properties
##### buildName: string
This is the only mandatory property to define a build task. The string specified here will be the name of gulp task that is created by the specified builder.  

##### builder: string | function(defaultModuleOptions, conf, done) {}
Name of builder class or custom function to be executed. The customBuildDir, which is specified in the gbmconfig.js will be searched first, and if not found, default builders will be searched. With this search sequence, users can have chance to overload default builders.
Currently available builders are:
```
 - GBuilder: General (Copy) Builder, which just executes user defined custom function
 - GSassBuilder: Sass/Scss builder, using gulp-sass
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
Users can create their own builder classes by placing builder file in the locations specified by customBuilderDir property in gbmconfig.js.
customBuildDir property can be a string of single path, or array of multiple paths.
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

#### Overloadiing functions
##### build(defaultModuleOptions, conf, done):
Overload entire build process.

##### OnInitModuleOptions(mopts, defaultModuleOptions, conf)
Overload initializing module options, mopts, which will be used in the build process.
mopts can be changed directly, or you can return option values to add them in the mopts.

##### OnBuilderModuleOptions(mopts, defaultModuleOptions, conf)
This is called by OnInitModuleOptions() to give a chance to specify builder specific module options.

##### OnInitStream(mopts, defaultModuleOptions, conf)
Overload create gulp.src() stream. Default OnInitStream() creates an src stream with 'plumber' and 'changed' function applied. Please look into the source files for the details.

##### OnBuild(stream, mopts, conf)
Body of build process, which is not including gulp.src() and gulp.dest()

##### OnDest(stream, mopts, conf)
Finalizing gulp stream, which should be returned to signal the end of task.


### Example
To see an examples, please refer to the github [example](https://github.com/shnam7/gulp-build-manager/tree/master/example)
