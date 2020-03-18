---
layout: docs
title: Getting started
---

# Getting started

## Installation
Gulp Build Manager can be installed with NPM.

Note that gulp 4.0 or higher is also required. It's not installed automatically with gulp-build-manager. So, you have to install it manually.

```bash
npm i gulp-build-manager --save-dev
npm i gulp --save-dev
```

### Node modules dependency
gbm provides a collection of built-in builders and plugins. These modules typically has their own dependency to other node modules. gbm does not install all those modules as dependency because they are not always used in the build configurations of your project. So, if you run gulp with gbm configuration, you could see warnings of missing node modules like this:

```sh
[01:14:22] Using gulpfile D:\dev\pub\gulp-build-manager\gulpfile.js
[01:14:22] Starting '01-watcher:scss'...
[01:14:22] '01-watcher:scss' errored after 48 ms
[01:14:23] Error: Cannot find module 'gulp-sass'
Require stack:
- D:\dev\pub\gulp-build-manager\lib\plugins\CSSPlugin.js
...
```
If you see error messages like this, then install all themissing modules required - 'gulp-sass' in this case.
This can be inconvenient but it'd be more efficient to install only the required modules.


## Quick Start
Creating gulp task is very simple and easy.

First, install requires modules.
```sh
npm i gulp gulp-build-manager browser-sync --save-dev
```

This is gulpfile.js.
```js
const gbm = require('gulp-build-manager');

module.exports = gbm.createProject()
    .addWatcher("watch", {
        watch: ['www/**/*.html'],
        browserSync: { server: 'www' }
    })
    .resolve();
```
This configuration will create a gulp task named 'watch', which monitors html files in 'www' directory. Now, if you run 'gulp watch' command , you will see a browser poping up showing the page in 'www'. And you will see this page is automatically updated when you edit the html files.

Now, let's add a sass builder to this configuration.

```javascript
const gbm = require('gulp-build-manager');

const scss = {
    buildName: 'scss',
    builder: 'GCSSBuilder',
    src: ['assets/scss/**/*.scss'],
    dest: 'www/css',
    clean: ['www/css']
};

module.exports = gbm.createProject(scss)
    .addWatcher("watch", {
        watch: ['www/**/*.html'],
        browserSync: { server: 'www' }
    })
    .addCleaner('clean')
    .resolve();
```

This configuration creates three gulp tasks, 'watch', 'scss', and 'clean'. Now, you can edit scss files and see the changes in the browser window immediately. 'GCSSBuilder' is one of built in builders of gbm. It compiles sass/scss/less/postcss into css. You can refer to **[Builders][3]** section for details.

In addition to this, you have clean task which removes files specified in scss.clean of the scss build configuration. Cleaner task created by addCleaner() function collects 'clean' properties form all the build configuration registered to project, which is created by gbm.createProject() function.

This is just a quick start. GBM provides various features useful in using gulp.


## Built-in builders
gbm provides predefined built-in builders, similar to the 'GCSSBuilder' in the above example, for your convenience. Those buildes include:
- [GBuilder](builtin-builders/GBuilder.md)
- [GCoffeeScriptBuilder](builtin-builders/GCoffeeScriptBuilder.md)
- [GConcatBuilder](builtin-builders/GConcatBuilder.md)
- [GCSSBuilder](builtin-builders/GCSSBuilder.md)
- [GImagesBuilder](builtin-builders/GImagesBuilder.md)
- [GJavaScriptBuilder](builtin-builders/GJavaScriptBuilder.md)
- [GJekyllBuilder](builtin-builders/GJekyllBuilder.md)
- [GMarkdownBuilder](builtin-builders/GMarkdownBuilder.md)
- [GPaniniBuilder](builtin-builders/GPaniniBuilder.md)
- [GRTLCSSBuilder](builtin-builders/GRTLCSSBuilder.md)
- [GTwigBuilder](builtin-builders/GTwigBuilder.md)
- [GTypeScriptBuilder](builtin-builders/GTypeScriptBuilder.md)
- [GWebpackBuilder](builtin-builders/GWebpackBuilder.md)
- [GZipBuilder](builtin-builders/GZipBuilder.md)


### Migration from v3
Version 4 has substantial changes from v3, and it's not compatible with v3 or earlier version. You can refer to [Migration guide][2], but it's highly recommended to see the [Examples][0] and create your project configuration file again.


### Resources
For better understanding on gbm, it's highly recommended to see the examples included the source code. It contains examples showing various features of gbm that can be applied to your project quickly.

- [Examples][0]
- [ChangeLog][1]



[0]: ../../examples
[1]: ../../CHANGELOG.md
[2]: 09-migration-from-v3.md
