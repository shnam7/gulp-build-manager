---
layout: docs
title: Getting started
---
# {{page.title}}


## Installation
```bash
npm install gulp --save-dev
npm install gulp-build-manager --save-dev
```
Note that gulp 4.0 or higher is required, and it's not installed automatically when gulp-build-manager is installed. It should be installed of its own.

### Peer dependency
gulp is not installed automatically. It can be installed using following command.<br>
gbm requires gulp 4.0 or higher.

```bash
npm install gulp  # be sure to have gulp v4.0 or higher
```
### Node modules dependency
gbm does not install all the required modules automatically. So, When running gulp with gbm the configuration, you may see errors of missing node modules. In that case, you have to install all the modules reuired manually.


## Quick Start
Creating gulp task is simple and easy. First, install requires modules.
```sh
npm i gulp gulp-build-manager browser-sync --save-dev
```

Let's see an examnple.
```js
const gbm = require('gulp-build-manager');

module.exports = gbm.createProject()
    .addWatcher("watch", {
        watch: ['www/**/*.html'],
        browserSync: { server: 'www' }
    })
    .resolve();

```
This configuration will create a gulp task named 'watch', which monitors html files in 'www' directory. Now, if you run 'gulp watch' command , you will see a browser poping up showing the page in 'www', which is automatically updated when you edit.

Now, let's add a sass builder to this configuration.

```javascript
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
This configuration creates three gulp tasks, 'watch', 'scss', and 'clean'. Now, you can edit scss files and see the changes in the browser immediately. 'GCSSBuilder' is one of built in builders, which compiles sass/scss/less/postcss into css. You can refer to *[*Built-in Builders][3]** section for details.
In addition to this, you have clean task which removes files specified in scss.clean of the scss build configuration. Cleaner task created by addCleaner() function collects 'clean' properties form all the build configuration registered to project, which is created by gbm.createProject() function.

This is just a quick start. GBM provides various features useful in using gulp.


## Built-in builders
gbm provides various predefined built-in builders, similar to the 'GCSSBuilder' in the above example, for your convenience.

* Those buildes include:
    - [GBuilder](/{{site.contentsurl}}/builders/built-in/GBuilder)
    - [GCoffeeScriptBuilder](/{{site.contentsurl}}/builders/built-in/GCoffeeScriptBuilder)
    - [GConcatBuilder](/{{site.contentsurl}}/builders/built-in/GConcatBuilder)
    - [GCopyBuilder](/{{site.contentsurl}}/builders/built-in/GCopyBuilder)
    - [GCSSBuilder](/{{site.contentsurl}}/builders/built-in/GCSSBuilder)
    - [GExternalBuilder](/{{site.contentsurl}}/builders/built-in/GExternalBuilder)
    - [GImagesBuilder](/{{site.contentsurl}}/builders/built-in/GImagesBuilder)
    - [GJavaScriptBuilder](/{{site.contentsurl}}/builders/built-in/GJavaScriptBuilder)
    - [GJekyllBuilder](/{{site.contentsurl}}/builders/built-in/GJekyllBuilder)
    - [GMarkdownBuilder](/{{site.contentsurl}}/builders/built-in/GMarkdownBuilder)
    - [GPaniniBuilder](/{{site.contentsurl}}/builders/built-in/GPaniniBuilder)
    - [GRTLCSSBuilder](/{{site.contentsurl}}/builders/built-in/GRTLCSSBuilder)
    - [GTwigBuilder](/{{site.contentsurl}}/builders/built-in/GTwigBuilder)
    - [GTypeScriptBuilder](/{{site.contentsurl}}/builders/built-in/GTypeScriptBuilder)
    - [GWebpackBuilder](/{{site.contentsurl}}/builders/built-in/GWebpackBuilder)
    - [GZipBuilder](/{{site.contentsurl}}/builders/built-in/GZipBuilder)

See the **[Documentation][0]** for more details.


### Migration from v3
Version 4 has substantial changes from v3, and it's not compatible with v3 or earlier version.
You can refer to migration guide, but it's highly recommended to see the **[Examples][2]** and create your project configuration file again.

### Resources
For better understanding on gbm, it's highly recommended to see the examples in the below link. It contains various usage and practical examples that can be applied to your work quickly.

- [Documentation][0]{:target="_blank"}
- [Examples][1]{:target="_blank"}

[0]: /{{site.contentsurl}}
[1]: {{site.repo}}/examples
[2]: /{{site.contentsurl}}/resources/modular-configuration


## References
  - [Documentation][0]
  - [Examples][1]
  - [ChangeLog][2]


Those classes can be extended or modified using class inheritance.<br>
gbm also provides plugin system, which enables users to add custom functions or plugin objects into specific stages of the build process.
Builders can also be in the form of function, which is sometimes simpler and convenient.<br>
For *modular configuration* to handle complex projects, refer to [modular configuration][4] section in documentation.<br>
