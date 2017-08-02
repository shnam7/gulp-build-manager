---
layout: docs
title: GZipBuilder
---

# {{page.title}}
File packer for distribution. 

#### Builder specific Options
None

### Notes
  - watch need to be disabled if you do not want to compress the file whenever you make changes. See example below.
  
#### Example

```javascript
const zip = {
  buildName: 'zip',
  builder: 'GZipBuilder',
  src: [
    upath.join(destRoot, '**/*'),
    upath.join(srcRoot, 'zip-me-too/**/*')
  ],
  dest: '_dist',
  outFile: 'primitives.zip',
  watch: {
    // disable watch by setting 'watched' list to empty array
    watched:[]
  }
};
```