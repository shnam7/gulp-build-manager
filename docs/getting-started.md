---
layout: docs
title: Getting started
---
# {{page.title}}

#### 1. Install Gulp Build Manager(gbm in short):
```sh
npm install gulp-build-manager --save-dev
```

#### 2. Create gulpfile using gbm at the root of your project:
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

Then, 'javaScript' task will be created and run. It will concatenate all the *.js files in src directory into sample.js dest directory.
Three more tasks in systemBuilds setting will also be created: @build, @clean, default.
