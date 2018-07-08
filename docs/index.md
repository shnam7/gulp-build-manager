---
layout: docs
title: Gulp Build Manager
frontpage: true
---
# Introduction
Gulp Build Manager is an easy to use, flexible gulp task manager. It helps users create gulp tasks with simple configuration providing the convenience of configuration and the flexibility of javascript in setting up the tasks.


### Peer dependencies
gbm requires gulp 4.0 or higher. To install it, follow the instruction below.

```bash
npm install gulp@next --save-dev  # gulp v4.0.0
# or
npm install gulp@4 --save-dev
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

### Modular Configuration
For modular configuration to handle complex project, refer to **[modular configuration][2]** section in documentation.<br>

### Resources
To learn more, check out the resources below. You are recommended to see the examples which shows various usage and practices that can be applied to your work quickly.
 
- [Documentation][0]{:target="_blank"}
- [Examples][1]{:target="_blank"}

[0]: {{site.baseurl}}
[1]: {{site.repo}}/examples
[2]: {{site.baseurl}}/resources/modular-configuration