---
layout: docs
---

# GRTLCSSBuilder
Converts css files into rtl(right-to-left) format using gulp-rtlcss plugin.


### Builder specific Options
None


### Module Options
moduleOptions.rtlcss: Option for gulp-rtlcss.
moduleOptions.rename: Options for gulp-rename, which is used to change the output names.


### Example
```javascript
const rtl = {
    buildName: 'rtl',
    builder: 'GRTLCSSBuilder',
    src: [upath.join(destRoot, 'css/*.css')],
    dest: upath.join(destRoot, 'css'),
    moduleOptions: {
        // if no rename option is set, default is {suffix: '-rtl'}
        rename: { suffix: '---rtl' }
    },
};
```
