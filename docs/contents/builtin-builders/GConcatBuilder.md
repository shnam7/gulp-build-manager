---
layout: docs
title: GConcatBuilder
---

# GConcatBuilder
Concatenates input files into a single output file.

### Builder specific Options
None

### Example
```js
const concat = {
    buildName: 'concat',
    builder: 'GConcatBuilder',
    src: [upath.join(srcRoot, '*.js')],
    order:['file2.js','*.js'],  // file2.js comes first
    dest: destRoot,
    outFile: 'concated.js'
};
```
