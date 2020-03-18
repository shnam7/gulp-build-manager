---
layout: docs
title: GMarkdownBuilder
---

# GMarkdownBuilder
Converts markdown files into html using gulp-markdonn plugin.


### Builder specific Options
None


### Example
```js
const markdown = {
    buildName: 'markdown',
    builder: 'GMarkdownBuilder',
    src: [upath.join(srcRoot, '**/*.md')],
    dest: upath.join(destRoot, ''),
};
```
