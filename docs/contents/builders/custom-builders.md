---
layout: docs
---

# Writing Custom Builders

## Writing custom Builder class
GBuilder provides basic builder interface and all custom builder classes should extends from it.

### Public variables
*GBuilder.prototype.stream*: Main build stream
*GBuilder.prototype.conf*: Build configuration
*GBuilder.prototype.buildOptions*: Build options. Equivalent to conf.buildOptions. If conf.buildOptions is not defined, it becomes {}
*GBuilder.prototype.moduleOptions*: Module options. Equivalent to conf.moduleOptions. If conf.moduleOptions is not defined, it becomes {}

### Public methods
#### GBuilder.prototype.constructor(buildFunc: BuildFunction)
@param *buildFunc* is an optional main build function. If not specified, default becomes copy function.
*BuildFunction*: (builder: GBuilder, ...args: any[]) => void | Promise\<any\>

#### GBuilder.prototype.build()
Main build function. By default, it call GPlugin.prototype.buildFunc. Derived classes typically override this.

#### Example from source code: GCopyBuilder
```javascript
export class GConcatBuilder extends GBuilder {
  constructor() { super(); }

  build() {
    let opts = {
      src: this.conf.src,
      dest: this.conf.dest,
      targets: this.buildOptions.targets
    };

    let promise = GPlugin.copy(this, opts);
    if (this.conf.flushStream) return promise;
  }
}
```

### GBuilder API
GBuilder provides service functions to help custom builder development. All those functions return itself(this) so that it can be chained to other build service functions or build actions.

#### src(src?: string | string[])
Creates main build stream based on conf.src settings.
 If conf.order is specified, then the files in the stream are ordered.
 If buildOptions.sourceMap is true, internal sourceMaps are initialized.


### dest(path?: string)
Writes files in current stream to destination directory specified by conf.dest.

### pipe(destination: NodeJS.WritableStream, options?: { end?: boolean; })
Relay the pipe() call onto the main stream.

### on(event: string | symbol, listener: (...args: any[]) => void)
Relay the on() call onto the main stream.

### chain(action: Plugin, ...args: any[])
Calls plugin object or function. This function does not support Promise. So, if plugin function or object should return a Promise, it must be called directly.

### sourceMaps(options: Options = {})
Provides gulp-sourcemaps service.
*options.init*: if evaluates to true, then sourceMaps are initialized. This is done by default in src() function.
If called without init options, it generates sourcemaps for the current main stream files.

### reload()
Reload browsers. Currently, livereload and browserSync are supported.


### Example from source code: GCSSBuilder
```javascript
export class GCSSBuilder extends GBuilder {
  constructor() { super(); }

  async build() {
    this.src().chain(new CSSPlugin());
    if (!this.buildOptions.minifyOnly) await this.dest();
    if (this.conf.outFile) this.chain(GPlugin.concat);
    if (this.buildOptions.minify || this.buildOptions.minifyOnly) this.chain(GPlugin.cssnano);
    return this.dest();
  }
}
```
Note that async/await used to have non-minified output files to be flushed into the disk before they are concatenated.

### Resources
It is recommended to see the source code and examples to learn more on writing custom builders.
See asl [Using Plugins]({{site.contentsurl}}/plugins/using-plugins) to learn about plugins.
