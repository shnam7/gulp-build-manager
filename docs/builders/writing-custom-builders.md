---
layout: docs
---

# Writing Custom Builders

## Writing custom Builder class
GBuilder provides basic builder interface and all custom builder classes should extends from it. Here's an example overloading each interface functions:
```javascript
class GCustomBuilder extends gbm.GBuilder {
  constructor() { super(); }

  build(defaultModuleOptions, conf, done) {
    console.log('GCustomBuilder::build() called. continuing the build process...');
    return super.build(defaultModuleOptions, conf, done);
  }

  OnInitModuleOptions(mopts, defaultModuleOptions, conf) {
    console.log('GCustomBuilder::OnInitModuleOptions() called. continuing the build process...');
    return super.OnInitModuleOptions(mopts, defaultModuleOptions, conf);
  }

  OnPreparePlugins(mopts, conf) {
    console.log('GCustomBuilder::OnPreparePlugins() called. continuing the build process...');
    this.addPlugins(stream=>require('debug')());
  }

  OnBuilderModuleOptions(mopts, defaultModuleOptions, conf) {
    console.log('GCustomBuilder::OnBuilderModuleOptions() called. continuing the build process...');
    return super.OnBuilderModuleOptions(mopts, defaultModuleOptions, conf);
  }

  OnInitStream(mopts, defaultModuleOptions, conf) {
    console.log('GCustomBuilder::OnInitStream() called. continuing the build process...');
    return super.OnInitStream(mopts, defaultModuleOptions, conf);
  }

  OnBuild(stream, mopts, conf) {
    console.log('GCustomBuilder::OnBuild() called. continuing the build process...');
    return super.OnBuild(stream, mopts, conf);
  }

  OnDest(stream, mopts, conf) {
    console.log('GCustomBuilder::OnDest() called. continuing the build process...');
    return super.OnDest(stream, mopts, conf);
  }
}
```

### GBuilder interface
GBuilder interface functions share common function arguemnts:
  - defaultModuleOptions: module options object from gbm
  - conf: build configuration object
  - done: gulp task signaling function
  - mopts: an object with selected module options returned by OnInitModuleOptions()
  - plugins: array of plugin objects
  - stream: Vinyl stream object typically created by gulp.src()

If you are going to develop custom builder classes, it is highly recommended to see the GBuilder.js in source directory to understand default actions of each interface functions.


#### GBuilder.build(defaultModuleOptions, conf, done)
Main build function. If you overload this, whole build process is replaced.
It valid stream object available, then it should be returned. Or, done() should be called to signal the end of build process .
Returns a stream of Vinyl files stream.
  
#### OnInitModuleOptions(mopts, defaultModuleOptions, conf)
Initializes the value of mopts which will be used in nex build processes. If mopts is directly modified, then return false. Or, you can return your own mopts object which will be merged into the originale mopts value.
If mopts has all the necessary updates, nothing need to be returned.
 
#### OnPreparePlugins(mopts, conf)
You can add plugins here if necessary. Actually, many built-in builders are created by adding plugins here. Refer to the source files for more details.

#### OnBuilderModuleOptions(mopts, defaultModuleOptions, conf)
This is called by OnInitModuleOptions() to give a chance to specify builder specific module options. Default module options can be changed here as per the specific needs of the Builder.

#### OnInitStream(mopts, defaultModuleOptions, conf): stream
gulp stream is created here, and should be returned to be used in next build processes. Default action is to creates the stream by calling gulp.src(conf.src).
 If no stream is required in the build process, it may not return anything.
 
#### OnBuild(stream, mopts, conf): stream
Body of build process, not including gulp.src() and gulp.dest()
Default action does nothing but returns the stream.
 
#### OnDest(stream, mopts, conf): stream
Closes the stream. Default action just calls stream.pipe()gulp.dest()) and returns the stream.

#### OnPostBuild(stream, mopts, conf)
Post build actions. Default action is just returns the stream.

#### reload(stream, mopts, conf)
Reload the changed contents into web browsers. This is called automatically at the end of the build process.


### Example: adding debug() function to GSassBuilder stream
```javascript
const gbm = require('gulp-build-manager');
const debug = require('gulp-debug');

class GSassBuilderWithDebug extends gbm.GCSSBuilder {
  OnInitStream(mopts, defaultModuleOptions, conf) {
    return super.OnInitStream(mopts, defaultModuleOptions, conf)
      .pipe(debug());
  }
}
module.exports = GSassBuilderWithDebug;
```

### Notes
Generally, writing a derived class can be useful in changing the default actions of the builder. But, if you wants to add features to the existing builder classes, using plugins can be more convenient. See [Using Plugins]({{site.baseurl}}/plugins/using-plugins) to learn about plugins.
