---
layout: docs
---
# Using Plugins

Plugin is a modularized build action that can be implemented as a function or class object.

### Plugin function
prototype: (builder: GBuilder, ...args: any[]) =\> void | Promise<any>
@param builder is builder object running this plugin
@param args is an optional arguments list specific to each plugins. This can be passed by GBuilder.chain() or direct call to the plugin function.
Let's see an example:

```javascript
const gbm = require('gulp-build-manager');

const sass = {
  buildName: 'sass',
  builder: 'GCSSBuilder',
  src: ['scss/**/*.scss'],
  dest: 'css',
  preBuild: (builder)=>{
    // call GPlugin.copy with args={src:..., dest:...}
    builder.chain(gbm.GPlugin.copy, {
      src:['*.txt'],
      dest:'text'
    })
  }
};

gbm({
  builds: sass
});
```

### Plugin class
Plugin classes should derive from GPlugin and must implement process() member function. If process() returns a promise, then it is finished before the build process. Typical plugin class looks like this:
```javascript
export class SamplePlugin extends gbm.GPlugin {
  constructor(options:Options={}) { super(options); }

  process(builder: GBuilder) {
    //...
  }
}
```

### invoking plugins
Plugins can be invoked by GBuilder.chain() or it can be directly called with GBuilder as fist argument.
```javascript
const sass = {
  buildName: 'sass',
  builder: 'GCSSBuilder',
  src: ['scss/**/*.scss'],
  dest: 'css',
  preBuild: (builder)=>{
    // call GPlugin.copy with args={src:..., dest:...}
    builder.chain(gbm.GPlugin.copy, {
      src:['*.txt'],
      dest:'text'
    });
    
    // this is equivalent copy call    
    gbm.GPlugin.copy(builder, {
      src:['*.txt'],
      dest:'text'
    })
    
    // calling Plugin class
    builder.src().chain(new gbm.GPlugin.TypeScriptPlugin()).dest();
  }
};
```

### Resources
To learn more how to use plugins, see the [builder source codes]({{site.repo}}/src/builders)
