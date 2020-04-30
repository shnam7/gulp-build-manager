---
id: builders
title: Builders
---

# Builders

There four builder types supported by gulp-build-manager.
* Named builder - class name of GBuilder or it's decendant classes
* Function builder - function or function object
* External builder - External command to execute
* GBuilder instance


## Types
```js
//--- Named Builders
export type GBuilderClassName = string;

//--- Function Builders
export type FunctionBuilder = (rtb: RTB, ...args: any[]) => void | Promise<unknown>;

//--- Object Builders
export interface ExternalBuilder extends ExternalCommand {}

//--- GBuilder
class GBuilder extends RTB {}

//--- Combined Builders Type
export type Builders = GBuilderClassName | FunctionBuilder | ExternalBuilder | GBuilder;

```

## Named Builder
Example:
```js
const sass = {
    buildName: 'sass',
    builder: 'GCSSBuilder',
    src: [upath.join(srcRoot, 'postcss/**/*.pcss')],
    dest: upath.join(destRoot, 'css'),
}
```

## Function Builder
Example:
```js
const customFunction = {
    buildName: 'customFunction',
    builder: (rtb) => {
        console.log('Custom builder using function(): Hello!!!', rtb.conf.buildName);
    }
};
```

## Object Builder
Example:
```js
const cmd1 = {
    buildName: 'node-version',
    builder: { command: 'node', args: ['-v'],
}
```


## GBuilder
It is recommended all the custom builder classes to extend GBuilder, not RTB. GBuilder class is avail from GBuilder.builders property.

### build()
```js
build() =>  void | Promise<unknown>;
```
Main build function. All the RTB API's are availabe using this object because GBuilder extends RTB. Default action is copying conf.src to conf.dest.


### Custom Builder class example
```js
const gbm = require('gulp-build-manafer');

class CopyBuilder extends gbm.builders.GBuilder {
    protected build() {
        this.src().debug()dest();
    }
}
```


## Build-in Builders
- [GBuilder](builtin-builders/GBuilder.md)
- [GCoffeeScriptBuilder](builtin-builders/GCoffeeScriptBuilder.md)
- [GConcatBuilder](builtin-builders/GConcatBuilder.md)
- [GCSSBuilder](builtin-builders/GCSSBuilder.md)
- [GImagesBuilder](builtin-builders/GImagesBuilder.md)
- [GJavaScriptBuilder](builtin-builders/GJavaScriptBuilder.md)
- [GJekyllBuilder](builtin-builders/GJekyllBuilder.md)
- [GMarkdownBuilder](builtin-builders/GMarkdownBuilder.md)
- [GPaniniBuilder](builtin-builders/GPaniniBuilder.md)
- [GRTLCSSBuilder](builtin-builders/GRTLCSSBuilder.md)
- [GTwigBuilder](builtin-builders/GTwigBuilder.md)
- [GTypeScriptBuilder](builtin-builders/GTypeScriptBuilder.md)
- [GWebpackBuilder](builtin-builders/GWebpackBuilder.md)
- [GZipBuilder](builtin-builders/GZipBuilder.md)
