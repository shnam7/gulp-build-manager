---
layout: docs
title: Getting started
---

# {{page.title}}


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

This configuration creates three gulp tasks, 'watch', 'scss', and 'clean'. Now, you can edit scss files and see the changes in the browser window immediately. 'GCSSBuilder' is one of built in builders of gbm. It compiles sass/scss/less/postcss into css. You can refer to **[Built-in Builders][3]** section for details.
In addition to this, you have clean task which removes files specified in scss.clean of the scss build configuration. Cleaner task created by addCleaner() function collects 'clean' properties form all the build configuration registered to project, which is created by gbm.createProject() function.

This is just a quick start. GBM provides various features useful in using gulp.


## Built-in builders
gbm provides predefined built-in builders, similar to the 'GCSSBuilder' in the above example, for your convenience. Those buildes include:
- [GBuilder]({{site.contentsurl}}/builtin-builders/GBuilder)
- [GCoffeeScriptBuilder]({{site.contentsurl}}/builtin-builders/GCoffeeScriptBuilder)
- [GConcatBuilder]({{site.contentsurl}}/builtin-builders/GConcatBuilder)
- [GCSSBuilder]({{site.contentsurl}}/builtin-builders/GCSSBuilder)
- [GImagesBuilder]({{site.contentsurl}}/builtin-builders/GImagesBuilder)
- [GJavaScriptBuilder]({{site.contentsurl}}/builtin-builders/GJavaScriptBuilder)
- [GJekyllBuilder]({{site.contentsurl}}/builtin-builders/GJekyllBuilder)
- [GMarkdownBuilder]({{site.contentsurl}}/builtin-builders/GMarkdownBuilder)
- [GPaniniBuilder]({{site.contentsurl}}/builtin-builders/GPaniniBuilder)
- [GRTLCSSBuilder]({{site.contentsurl}}/builtin-builders/GRTLCSSBuilder)
- [GTwigBuilder]({{site.contentsurl}}/builtin-builders/GTwigBuilder)
- [GTypeScriptBuilder]({{site.contentsurl}}/builtin-builders/GTypeScriptBuilder)
- [GWebpackBuilder]({{site.contentsurl}}/builtin-builders/GWebpackBuilder)
- [GZipBuilder]({{site.contentsurl}}/builtin-builders/GZipBuilder)


### Migration from v3
Version 4 has substantial changes from v3, and it's not compatible with v3 or earlier version.
You can refer to [Migration guide][2], but it's highly recommended to see the [Examples][0] and create your project configuration file again.


### Resources
For better understanding on gbm, it's highly recommended to see the examples included the source code. It contains examples showing various features of gbm that can be applied to your project quickly.

- [Examples][0]{:target="_blank"}
- [ChangeLog][1]{:target="_blank"}



[0]: {{site.repo}}/examples
[1]: {{site.repo}}/CHANGELOG.md
[2]: {site.contentsurl}}/09-migration-from-v3
