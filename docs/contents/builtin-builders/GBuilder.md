---
layout: docs
---

# GBuilder
Base Builder. Base class of all builder classes.
It works as a Copy Builder - reads input from conf.src and writes them in conf.dest.


### Builder specific Options
None

### Example
```js
const copy = {
    buildName: 'copy',
    builder: 'GBuilder',
    src: upath.join(srcRoot, 'copy-me/**/*.txt'),
    dest: destRoot,
};
```
