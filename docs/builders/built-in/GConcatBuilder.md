---
layout: docs
title: GConcatBuilder
---

# {{page.title}}
Concatenates input files into a single output file.

#### Builder specific Options
None

#### Example
```javascript
const concat = {
  buildName: 'concat',
  builder: 'GConcatBuilder',
  src: [upath.join(srcRoot, '*.js')],
  order:['file2.js','*.js'],  // file2.js comes first
  dest: destRoot,
  outFile: 'concated.js'
};
```
