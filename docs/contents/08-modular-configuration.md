---
id: modular-configuration
title: Modular Configuration
---

# Modular Configuration
GBM is designed with managing mulple sub-projects in mind. Typically, main gbm configuration is described in gulpfile.js in project root, and other sub project configurations are located in each sub-project root typically in a file with gbmconfig.js. gbmconfig.js typically returns GProject instance.

## Quick Example
```js
// file: 'docs/gbmconfig.js
const gbm = require('gulp-build-manager');
// make some BuildConfig's
module.exports = gbm.createProject(/*...*/);
```

```js
// file: 'example/gbmconfig.js
const gbm = require('gulp-build-manager');
// make some BuildConfig's
module.exports = gbm.createProject(/*...*/);
```

```js
// file: 'gulpfile.js
const gbm = require('gulp-build-manager');

const doc = require('./docs/gbmconfig.js');
const example = require('./example/gbmconfig.js');

gbm.addProject([docs, example]);
```


Refer to **[gulpfile.js][1]** of gulp-bild-manager source and gbmconfig.js file in its **[examples][0]** directory for general usage and examples.

[0]: ../../examples
[1]: ../../gulpfile.js
