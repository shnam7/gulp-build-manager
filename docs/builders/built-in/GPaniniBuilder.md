---
layout: docs
---

# GPaniniBuilder
Panini project builder.<br>
See [panini](https://github.com/zurb/panini){:target='_blank'} to learn more about panini.<br>
As an additional reference, [zerb foundation](http://foundation.zurb.com/sites/docs/panini.html){:target='_blank'} is explaining well about panini with good examples.

#### Builder specific Options
None

#### Example
```javascript
const panini = {
  buildName: 'panini',
  builder: 'GPaniniBuilder',

  // panini does not handle backslashes correctly, so replace them to slash
  src: [upath.join(srcRoot, 'pages/**/*')],
  dest: upath.join(destRoot, ''),
  moduleOptions: {
    panini: {
      root: upath.join(srcRoot, 'pages/'),
      layouts: upath.join(srcRoot, 'layouts/'),
      partials: upath.join(srcRoot, 'partials/'),
      data: upath.join(srcRoot, 'data/'),
      helpers: upath.join(srcRoot, 'helpers/')
    }
  },

  plugins: [
    // rename *.md files into *.html in the start of build process
    stream=>stream.pipe(require('gulp-rename')({extname:'.html'}))
  ],
};
```