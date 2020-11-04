---
id: getting-started
title: Getting started
---

# Getting started

<div style='color:white; background:#B12F5C; padding: 1.5rem; border-radius: 5px; text-align:center'>
<div style='font-size:1.3rem; margin-bottom: 0.5rem'>
    Migration to <a href='https://github.com/shnam7/gulp-tron' target='_blank' style='color:#FFE21f'>gulp-tron</a>
</div>
<div>gulp-build-manager is no longer maintained. Please use <a href='https://github.com/shnam7/gulp-tron' target='_blank' style='color:#FFE21f'>gulp-tron</a> instead.</div>
</div>


## Installation
Gulp Build Manager can be installed with NPM.

```bash
npm i gulp-build-manager --save-dev
npm i gulp --save-dev
```

Note that gulp 4.0 or higher version is also required. It's not installed automatically with gulp-build-manager. So, you have to install it manually.



## Node module dependency
gbm uses various node module, but most of them are not installed with gbm automatically becuase only parts of them could be used depending on user's project requirements. To minimize the overhead on module dependency, gbm tries to keepit as small as possible. So, when you first try to use gbm, you would see warnings like this:

```sh
[01:14:22] Using gulpfile D:\dev\pub\gulp-build-manager\gulpfile.js
[01:14:22] Starting '01-watcher:scss'...
[01:14:22] '01-watcher:scss' errored after 48 ms
[01:14:23] Error: Cannot find module 'gulp-sass'
Require stack:
- D:\dev\pub\gulp-build-manager\lib\plugins\CSSPlugin.js
...
```
If you see error messages like this, then you have to install all the missing modules required - 'gulp-sass' in this case.

To reduce this inconvenience, gbm provides automatic module installation options.



## Automatic module installation
gbm provides two ways of installing dependency modules automatically.

### Using command line option: --npm-auto-install (--npm-auto for short)
```sh
# npx gulp <taskName> --npm-auto
# npx gulp <taskName> --npm-auto='npm install options>'

npx gulp task1 --npm-auto # default npm install option is '--save-dev'
npx gulp task2 --npm-auto='--no-save' # default npm install option is '--save-dev'
```
When executing gulp task, --npm-auto=<npm install options> can be used. if <npm install option> is not given, '--save-dev' is used as default.


### Using API: gbm.setNpmOptions(options)
```js
const gbm = require('gulp-build-manager');

// default option valeu: {autoInstall: false, installOptions: '--save-dev'}
gbm.setNpmOptions({autoInstall: true, installOptions: '--no-save'});
```
Automatic module installation feature is initially turned off by default because it would degrade overall build task execution performance. Once build tasks are executed with this turned on, then package.json file will be updated as per the given installation options (default: '--save-dev'). Once all the required modules are installed, it is recommended to turn this feature off for better performance. If the moduels already installed, installation action is skipped. However, all the modules requiring using automatic installation API will run in sequence, not in parallel, because each npm installation command should update package.json sequencially.


### Using automatic installation API
For user build actiosn, gbm provides two utility functions.
- gbm.utils.npmInstall(modules)
- gbm.utils.requireSafe(module)

```js
const gbm = require('gulp-build-manager');

// gbm.utils.npmInstall(moduleNames, options);
// gbm.utils.requireSafe(moduleName);

// examples
gbm.utils.npmInstall('react');  // single module installation
gbm.utils.npmInstall(['react', 'react-dom', ...]);  // multiple module installation

// Ensure the module is installed and returns it
const pcss = gbm.utils.requireSafe('gulp-postcss');
```
Typically, it is recommended to use these API in build functions such as conf.preBuild, so that the installation to be done only when the build task is executed. See [examples][1] in gbm source for actual usage cases.



## Quick Start

### Create gbm instance
```js
const gbm = require('gulp-build-manager');
const upath = require('upath');

const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, 'www');
```

It is recommended to use upath which is automatically installed with gbm as dependency. upath replaces the windows \ with the unix / in all string params & results, making everything simple and consistent.

In addition, it is a good idea to set up basic root directories:
- basePath: project root directory
- srcRoot: source root directory for input files
- destRoot: destination root directory for output files


### Prepare BuildConfig (conf)
```js
const scss = {
    buildName: 'scss',
    builder: (rtb) => rtb.src().pipe(sass().on('error', sass.logError)).dest(),
    src: upath.join(srcRoot, 'scss/**/*.scss'),
    dest: upath.join(destRoot, 'css'),
    clean: upath.join(destRoot, 'css'),
}
```

'builder' property is for main build function. rtb, runtime builder, is available in the build function as first argument. it provides rich API for build process and its conf property(rtb.conf) has all the information given in ths BuildConfig object. conf.clean will be added to internal cleaner task, which will clean up all the registered clean targets when executed.

Refer to [Build Config][0] for detailed information on BuildConfig type.


### Create build project
```js
gbm.createProject(scss)
    .addWatcher()
    .addCleaner()
```
gbm.createproject() will actually analyze BuildConfig(scss) and create gulp task to execute scss.builder function. addWatch will create gulp watch task which will monitor files described in scss.src. addCleaner() creates cleaner task to erase all the clean targets found in conf.clean properties.


### Consolidation: gulpfile.js
Combining all the steps above will result in the codes below:
```js
const gbm = require('gulp-build-manager');
const upath = require('upath');

const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, 'www');

const scss = {
    buildName: 'scss',
    builder: (rtb) => rtb.src().pipe(sass().on('error', sass.logError)).dest(),
    src: upath.join(srcRoot, 'scss/**/*.scss'),
    dest: upath.join(destRoot, 'css'),
    clean: upath.join(destRoot, 'css'),
};

gbm.createProject(scss)
    .addWatcher()
    .addCleaner();
```
This gulpfile.js will create 3 gulp tasks:
- scss: scss transpiles (task name is from scss.buildName)
- @watch: watch task monitoring files described in scss.src (default task name is @watch)
- @clean: clean task to delete files described in scss.clean (default task name is @clean)



## Built-in builders
gbm provides predefined built-in builders that can be used immediately with no cost. For example, above 'scss BuildConfig can be written GCSSBuilder like this:
```js
const scss = {
    buildName: 'scss',
    builder: 'GCSSBuilder',
    src: upath.join(srcRoot, 'scss/**/*.scss'),
    dest: upath.join(destRoot, 'css'),
    clean: upath.join(destRoot, 'css'),
};
```

Currently, following built-in builders are available:
- [GBuilder]({{site.baseurl}}/contents/builtin-builders/GBuilder)
- [GCoffeeScriptBuilder]({{site.baseurl}}/contents/builtin-builders/GCoffeeScriptBuilder)
- [GConcatBuilder]({{site.baseurl}}/contents/builtin-builders/GConcatBuilder)
- [GCSSBuilder]({{site.baseurl}}/contents/builtin-builders/GCSSBuilder)
- [GImagesBuilder]({{site.baseurl}}/contents/builtin-builders/GImagesBuilder)
- [GJavaScriptBuilder]({{site.baseurl}}/contents/builtin-builders/GJavaScriptBuilder)
- [GJekyllBuilder]({{site.baseurl}}/contents/builtin-builders/GJekyllBuilder)
- [GMarkdownBuilder]({{site.baseurl}}/contents/builtin-builders/GMarkdownBuilder)
- [GPaniniBuilder]({{site.baseurl}}/contents/builtin-builders/GPaniniBuilder)
- [GRTLCSSBuilder]({{site.baseurl}}/contents/builtin-builders/GRTLCSSBuilder)
- [GTwigBuilder]({{site.baseurl}}/contents/builtin-builders/GTwigBuilder)
- [GTypeScriptBuilder]({{site.baseurl}}/contents/builtin-builders/GTypeScriptBuilder)
- [GWebpackBuilder]({{site.baseurl}}/contents/builtin-builders/GWebpackBuilder)
- [GZipBuilder]({{site.baseurl}}/contents/builtin-builders/GZipBuilder)



## Examples
gbm source comes with various [examples][1], which can be helpful in understanding gbm usage. It is highly recommended to check it.



## Migration from v3
Version 4 has substantial changes from v3, and it's not compatible with v3 or earlier versions. You can refer to [Migration guide][2], but it's recommended to see the [examples][1] and create your project configuration file again, which can be easier than migration.



[0]: {{site.baseurl}}/contents/02-build-config
[1]: https://github.com/shnam7/gulp-build-manager/tree/master/examples
[2]: {{site.baseurl}}/contents/09-migration-from-v3
