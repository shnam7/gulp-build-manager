---
layout: docs
---

# GConcatBuilder
Copy files from multiple sources to multiple destinations.

#### Builder specific Options
buildOptions.targets

#### Example
```javascript
const copy = {
  buildName: 'copy',
  builder: 'GCopyBuilder',
  src: ['path-src1/**/*.*'],
  dest:'path-dest1',
  flushStream: true,  // task to finish after all the files copies are finished
  buildOptions: {
    targets:[
      {src: ['path-src1/**/*.*'], dest:'path-dest2'},
      {src: ['path-src2/**/*.*'], dest:'path-dest3'}
    ],
  },
};
```

See [GPlugin.copy]({{site.siteurl}}/plugins/built-in-plugins#copy) for the details.