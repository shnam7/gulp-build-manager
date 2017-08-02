---
layout: docs
title: GMarkdownBuilder
---

# {{page.title}}
Converts markdown files into html using gulp-markdonn plugin.

#### Builder specific Options
None

#### Example
```javascript
const markdown = {
  buildName: 'markdown',
  builder: 'GMarkdownBuilder',
  src: [upath.join(srcRoot, '**/*.md')],
  dest: upath.join(destRoot, ''),
  watch: {livereload:true}
};
```