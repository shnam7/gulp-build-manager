---
layout: docs
title: Getting started
---
# {{page.title}}


# Introduction
Gulp Build Manager, gbm in short, is an easy to use, configuration based gulp task manager. Users can create gulp tasks with simple build configuration, but full javascript is supported in the configuration file so that users can customize the build process as necessary.

### Peer dependencies
gulp is not installed automatically. It can be installed using following command.<br>
gbm requires gulp 4.0 or higher.

```bash
npm install gulp  # be sure to have gulp v4.0 or higher
```

### Quick Start
Creating gulp task is simple and easy. Let's see an examnple.

```js
const html = {
    buildName: 'html-watcher',
    watch: { watched: ['www/**/*.html')] }
};

gbm({
    builds: [html],
    systemBuilds: {
        watch: { browserSync: { server: 'www' } }
    }
});
```
This configuration will create two gulp tasks, 'html-watcher' and '@watch'. For the names in 'systemBuilds' except 'default', '@' is prefixed to the task name to avoid conflict with other user defined task names.<br>
If you run 'gulp @watch' command with this configuration, you will see a browser page that are automatically updated when you edit html files in the watched folder, 'www/'.
<br>


Now, let's add a sass builder task to this project.

```javascript
const gbm = require('gulp-build-manager');

// build config: html-watcher
const html = {
    buildName: 'html-watcher',
    watch: { watched: ['www/**/*.html')] }
};

// build config: scss
const scss = {
    buildName: 'scss',
    builder: 'GCSSBuilder',
    src: ['assets/scss/**/*.scss')],
    dest: 'www/css'),
    clean: ['www/css')]
};

// build manager
gbm({
    systemBuilds: {
        build: gbm.parallel(html, scss),    // run tasks in
        default: ['@clean', '@build'],      // run tasks in series
        watch: { browserSync: { server: 'www' } }
    }
});
```
This configuration creates 6 gulp tasks, 'html-watcher', 'scss', '@build', 'default', '@watch', and '@clean'.<br>
Now, you have scss builder, which is automatically triggered and reloaded to brower when you edit the scss files in 'assets/scss' folder.<br>
'GCSSBuilder' is the name of one of built in builders. Please refer to **Built-in Builders** section for details. Note that gbm creates '@clean' task automatically if any build configurations has 'clean' property specified. If you run 'gulp @clean' command, then all the css output files will be deleted.


### Predefined Built-in Builders, Plugins, build API
Gulp Build Manager provides various predefined buiult-in builders, plugins, and runtime build API's for custom build operations. You can check on those topics in relevant sections.


### Modular Configuration
Sometimes, projects can be bigger and there could be multiple build modules with separate configurations. In such cases, each build configurations can be consolidated using modular approach. For more information on this, refer to **[modular configuration][2]** section.<br>


### Migration from v3
Version 4 has some changes in its interface and v3 configuration may not run correctly. Please refer to **Migration from v3** section to upgrade v3 configuration files.


### Resources
For better understanding on gbm, it's highly recommended to see the examples in the below link. It contains various usage and practical examples that can be applied to your work quickly.

- [Documentation][0]{:target="_blank"}
- [Examples][1]{:target="_blank"}

[0]: {{site.baseurl}}
[1]: {{site.repo}}/examples
[2]: {{site.baseurl}}/resources/modular-configuration






#### 1. Install Gulp Build Manager(gbm in short):
```sh
npm install gulp-build-manager --save-dev
```

If you have not installed gulp 4.0 yet, install it with following commands.
```bash
npm install gulp@next --save-dev  # gulp v4.0.0
# or
npm install gulp@4 --save-dev
```


#### 2. Create gulpfile at the root of your project:
Please be sure to have some javascript files in the assets/scripts/js directory to see the build process working.
In case you have error messages such as <i>'Cannot find module ...'</i>, then install the required modules using npm command.
```javascript
const gbm = require('gulp-build-manager');

const javaScript = {
  buildName: 'javaScript',
  builder: 'GJavaScriptBuilder',
  src: ['assets/scripts/js/**/*.js'],
  dest: '_build/js',
  outFile: 'sample.js',
  buildOptions: {
    minify: true,
    sourceMap: true
  },
};

gbm({
  systemBuilds: {
    build: javaScript,
    clean: ['_build'],
    default: ['@clean', '@build'],
  }
});
```

##### 3. Run gulp:
```sh
gulp
```

Then, 'javaScript' task will be created and run. It will concatenate all the *.js files from src directory into sample.js in dest directory.
Three more tasks, @build, @clean, default will also be created as per the settings in systemBuilds property.

<br>

### Using babel with gulp
If you want, you can use babel with gulp. Just, install babel packages and create .babelrc file with preset settings.

##### Installing babel
```sh
npm install babel-core babel-preset-env --save-dev
```

##### .babelrc
```json
{ "presets": ["env"] }
```
And then, just create *gulpfile.babel.js* instead of gulpfile.js.
Now, you can use es6 features in gulpfile.babel.js.
