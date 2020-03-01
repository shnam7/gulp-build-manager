---
layout: docs
---

# GBuilder
Base Builder. Base class of all builder classes. It works as a Copy Builder - reads input from conf.src and writes them in conf.dest.
It can also be configured to execute externakl commands. See example below.

#### Builder specific Options
None

#### Example
```javascript
const copy = {
  buildName: 'copy',
  builder: 'GBuilder',
  src: upath.join(srcRoot, 'copy-me/**/*.txt'),
  dest: destRoot,
};

const rollup = {
    buildName: 'rollup',
    builder: new gbm.GBuilder({command: ".\\node_modules\\.bin\\rollup",
        args:['gulpfile.js', '--file', 'bundle.js', '--format', 'iife']}),
};

```
