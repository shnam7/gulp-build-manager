---
layout: docs
---


# Built-in Plugins
You can get the built-in plugin classes with gbm:
```javascript
const gbm = require('gulp-build-manager');

const CoffeeScriptPlugin = gbm.CoffeeScriptPlugin;
// ...
```

## Built-in plugin functions
See [source code]({{site.repo}}/src/core/plugin.ts){:target='_blank'} for the details.
Built-in plugin functions searches BuildConfig.moduleOptions to find options for gulp plugin modules. And then, overrides it with the settings in 'options' argument. For example, for gulp-debug module,
  - First search builder.conf.modulesOptions.debug
  - And then, override(merge not replace) it with options.debug

#### GPlugin.debug
gulp-debug plugin.<br>
*Prototype*: GPlugin.debug(builder: GBuilder, options: Options={})<br>
For convenience, options itself is used an an argument to gulp-debug if options.debug is not found
```javascript
builder.chain(gbm.GPlugin.debug, {title: 'title-test'})
```

#### GPlugin.filter
gulp-filter plugin.<br>
*Prototype*: GPlugin.filter(builder: GBuilder, pattern:string[], options: Options={})
```javascript
builder.pipe(require('gulp-filter')(['**', '!**/*.map'], options.filter));
```

#### GPlugin.concat
gulp-concat plugin.<br>
Concatenates the files in gulp stream of the current builder. For output file name, builder.conf.outFile is checked first and then options.outFile is checked to override it.<br>
*Prototype*: GPlugin.concat(builder: GBuilder, options: Options = {})<br>
*options.filter*: pattern to filter the gulp stream<br>
*options.outFile*: output path name to override builder.conf.outFile.<br>
*options.concat*: module options to gulp-concat, which will override builder.moduleOptions.concat
```javascript
builder.chain(GPlugin.concat);
```


#### GPlugin.rename
gulp-rename plugin.<br>
If both builder.moduleOptions.rename and options.rename are missing, then options itself is used for convenience.
*Prototype*: GPlugin.rename(builder: GBuilder, options: Options = {})<br>
  
```javascript
builder.chain(GPlugin.rename, {extname: '.html'});
```

#### GPlugin.copy
{:#copy}
Copy files from multiple sources to multiple destinations.
*prototype*: GPlugin.copy(builder:GBuilder, options:Options={})
*options.src*: Optional glob string or an array of glob strings
*options.dest*: Optional string of destination directory
*options.targets*: Optional array of src/dest pairs.
If both options.src and options.dest exist, they are process before processing targets. Or, they are ignored.
See the usage below:
```javascript
const copyOptions = {
  src: ['*.txt'],
  dest: './text',
  targets: [
    {src: ['*.js'], dest: './js'},
    {src: ['*.ts'], dest: './ts'}
    //...
  ]
}

builder.chain(GPlugin.copy, copyOptions);
``` 
   
#### GPlugin.clean
{:#clean}
Delete files specified by BuildConfig.clean or options.clean properties.
 prototype*: GPlugin.clean(builder:GBuilder, options:Options={})
*options.clean*: Optional glob string or string[] to delete.
*options.del*: gulp-del options, which will override BuildConfig.moduleOptions.del.
All the files specified in BuildConfig.clean and options.clean will be deleted.<br>
Returns a promise for the delete operation. 
```javascript
const clean1 = {
  buildName: 'myClean1',
  builder: 'GCleanBuilder',
  flushStream: true,    // finish clean before the build finishes (sync)
  clean: ['dir/**/files-to-delete*.*']    // set files to delete here
};

const clean2 = {
  buildName: 'myClean2',
  clean: ['dir/**/files-to-delete*.*'],   // set files to delete here

  preBuild: (builder)=>{
    // call with builder if sync is not required
    builder.chain(gbm.GPlugin.clean);

    // or, call from GPlugin if sync is required
    let promise = gbm.GPlugin.clean(builder);
    return promise;   // return promise to finish clean before the build finishes (sync)
  }
};
``` 
   
#### GPlugin.uglify
gulp-uglify-es plugin.<br>
*Prototype*: GPlugin.uglify(builder: GBuilder, options: Options = {})<br>
*options.filter*: pattern to filter the gulp stream<br>
*options.uglifyES*: module options to gulp-uglify-es, which will override builder.moduleOptions.uglifyES
*options.rename*: rename options. default is { extname: '.min.js' } 
```javascript
builder.chain(GPlugin.uglify);
```

#### GPlugin.cssnano
gulp-uglify-es plugin.<br>
*Prototype*: GPlugin.cssnano(builder: GBuilder, options: Options = {})<br>
*options.filter*: pattern to filter the gulp stream<br>
*options.cssnano*: module options to gulp-uglify-es, which will override builder.moduleOptions.cssnano
*options.rename*: rename options. default is { extname: '.min.css' }
```javascript
builder.chain(GPlugin.cssnano);
```


## Built-in plugin classes
#### CoffeeScriptPlugin
CoffeeScript transpiler.<br>
See [source code]({{site.repo}}/src/plugins/CoffeeScriptPlugin.ts){:target='_blank'} for the details.

#### CSSPlugin
Stylesheet processor supporting sass/scss/less with postcss. See source code for the details.<br>
See [source code]({{site.repo}}/src/plugins/CSSPlugin.ts){:target='_blank'} for the details.

#### JavaScriptPlugin
JavaScript process with babel support. See source code for the details.<br>
See [source code]({{site.repo}}/src/plugins/JavaScriptPlugin.ts){:target='_blank'} for the details.

#### MarkdownPlugin
Markdown compiler.
See [source code]({{site.repo}}/src/plugins/MarkdownPlugin.ts){:target='_blank'} for the details.

#### TwigPlugin
Twig builder. See source code for the details.<br>
See [source code]({{site.repo}}/src/plugins/TwigPlugin.ts){:target='_blank'} for the details.

#### TypeScriptPlugin
TypeScript transpiler. See source code for the details.<br>
See [source code]({{site.repo}}/src/plugins/TypeScriptPlugin.ts){:target='_blank'} for the details.
