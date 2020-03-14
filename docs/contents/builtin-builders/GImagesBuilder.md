---
layout: docs
---

# GImagesBuilder
Image optimizer using 'gulp-imagemin' plugin.


### Builder specific Options
None


### Example
```js
const images = {
    buildName: 'images',
    builder: 'GImagesBuilder',
    src: upath.join(srcRoot, 'images/**/*'),
    dest: destRoot,
};
```
