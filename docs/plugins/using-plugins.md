---
layout: docs
title: Using Plugins
---
# {{page.title}}

Plugin is a modularized actions that can be inserted into specific build stages.

##### Build stages currently available are:
  - initStream: after GBuilder.OnInitStream()
  - build: after GBuilder.OnBuild()
  - dest: after GBuilder.OnDest()
  - postBuild: after GBuilder.OnPostBuild()

Let's see an example:

```javascript
const gbm = require('gulp-build-manager');

const sass = {
  buildName: 'sass',
  builder: 'GCSSBuilder',
  src: ['scss/**/*.scss'],
  dest: 'css',
  plugins: [
    new gbm.DebugPlugin()
  ]
};

gbm({
  builds: sass
});
```

Here, a DebugPlugin object is created and inserted into default slot, 'build'. This means that the plugin will be executed after OnBuild() from GBuilder's build process. So, you'd able to see a debug message after GBuilder.OnBuild() call.
If you want to see the input stream files before starting OnBuild(), you can do like this:
```javascript
const sass = {
  buildName: 'sass',
  builder: 'GCSSBuilder',
  src: ['scss/**/*.scss'],
  dest: 'css',
  plugins: [
    new gbm.DebugPlugin({}, 'initStream')
  ]
};
```

Note that plugins are available only for GBuilder class and its derivatives. You cannot ust it with function builders.
