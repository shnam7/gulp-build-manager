---
layout: frontpage
title: Gulp build Manager
---
# Introduction
Gulp Build Manager, gbm in a short name, is an Easy to use, Flexible gulp task manager. It is a tool helping gulp users to create tasks with simple configuration. This provides the convenience of configuration and the flexibility of javascript programming in setting up gulp tasks.


### Peer dependencies
Gulp 4.0 is required as a peer dependency of gbm. Currently, it not officially released in npm repository, but can be installed from [Guithub](https://github.com/gulpjs/gulp/tree/4.0):

```jshint
npm install gulpjs/gulp#4.0 --save-dev
# or
yarn add gulpjs/gulp#4.0 --dev
```

### Quick Start
Creating gulp task is simple and easy.

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

### Resources
To learn more, check out the resources below. You are highly recommended to see the examples which shows various usage and practices that can be applied to your work quickly.
 
- [Documentation][0]
- [Examples][1]


[0]: {{site.baseurl}}
[1]: {{site.repo}}/examples
