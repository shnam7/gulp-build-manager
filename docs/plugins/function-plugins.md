---
layout: docs
---
# Function Plugins

A function can be used as a plugin. This can be sometimes convenient.<br>
Plugin function prototype has the same parameters as GPlugin.process():

```javascript
function(stream, mopts, conf, slot) {}
```

Let's see an example:
```javascript
const gbm = require('gulp-build-manager');

const sass = {
  buildName: 'sass',
  builder: 'GCSSBuilder',
  src: ['scss/**/*.scss'],
  dest: 'css',
  plugins: [
    (stream) => require('gulp-debug')()
  ]
};

gbm({
  builds: sass
});
```

Note that function plugins cannot specify slots. It is plugged into 'build' stage only.
