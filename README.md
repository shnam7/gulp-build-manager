# Gulp Build Manager

Gulp Build Manager, gbm in short, is an easy to use, configuration based gulp task manager. Users can create gulp tasks with simple build configuration. At the same time, javascript can be used to customize or extend the configuration to manage build processes.


## Installation
```bash
npm install gulp --save-dev
npm install gulp-build-manager --save-dev
```
Note that gulp 4.0 or higher is required, and it's not installed automatically when gulp-build-manager is installed. It should be installed of its own.


## Quick Example
```js
const gbm = require('gulp-build-manager');

// build config
const html = {
    buildName: 'html-watcher',
    watch: { watched: ['www/**/*.html'] }
};

// create gbmConfig object
gbm({
    builds: [html],
    systemBuilds: {
        watch: { browserSync: { server: './www' } }
    }
});
```
This is example creats two gulp tasks, 'html-watcher' and '@watch'. 'html-watcher' is a dummy builder(no build action) that just specifying watch targets - html files in 'www' directory. '@watch' is a task created by gbm that actually watching the watch targets and triggers build actions and broiwserSync reloading on any changes in watch targets.
So, with this configuration, we have html editing environment that automatically updated to the browser on change.

Now, let's add sass builders to the html watcher.

```js
const gbm = require('gulp-build-manager');

// build config
const html = {
    buildName: 'html-watcher',
    watch: { watched: ['www/**/*.html'] }
};

const sass = {
    buildName: 'scss',
    builder: 'GCSSBuilder',
    src: 'assets/scss/**/*.scss',
    dest: 'www/css/',
    watch: { watched: ['assets/scss/**/*.scss'] },
    clean: ['www/css']
}

// create gbmConfig object
gbm({
    builds: [html, sass],
    systemBuilds: { watch: { browserSync: { server: './www' } } }
});
```
Now you have sass builder automatically reloading the changes to browser.

For more examples, check [Gulp-Build-Manager-Examples][1] site.


## Built-in build modules
gbm provides various predefined built-in builders for your convenience, just like 'GCSSBuilder' in the above example.
Those buildes include:

  - GBuilder - Base Builder, which works as a copy builder.
  - GCoffeeScriptBuilder
  - GConcatBuilder
  - GCSSBuilder - sass/scss/less/postcss builder.
  - GImagesBuilder - Image optimizer
  - GJavaScriptBuilder
  - GJekyllBuilder
  - GMarkdownBuilder
  - GPaniniBuilder
  - GRTLCSSBuilder - generates rtl files form css files
  - GTwigBuilder
  - GTypeScriptBuilder
  - GWebpackckBuilder
  - GZipBuilder - File packer for distribution

See the **[Documentation][0]** for more details.


## Node modules dependency
gbm does not install all the required modules automatically. So, When running gulp with gbm the configuration, you may see errors of missing node modules. In that case, you have to install all the modules reuired.


## References
  - [Documentation][0]
  - [Examples][1]
  - [ChangeLog][2]


Those classes can be extended or modified using class inheritance.<br>
gbm also provides plugin system, which enables users to add custom functions or plugin objects into specific stages of the build process.
Builders can also be in the form of function, which is sometimes simpler and convenient.<br>
For *modular configuration* to handle complex projects, refer to [modular configuration][4] section in documentation.<br>

[0]: https://shnam7.github.io/gulp-build-manager/
[1]: https://github.com/shnam7/gulp-build-manager-examples
[2]: https://github.com/shnam7/gulp-build-manager/tree/master/CHANGELOG.md

<br>
<br>
<p align="center">
  <img class="logo" src="https://shnam7.github.io/gulp-build-manager/images/gbm.svg" width="64px">
  <p align=center>Copyright &copy; 2017, under <a href="./LICENSE">MIT</a></p>
</div>
