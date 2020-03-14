---
layout: docs
title: Builders
---

# {{page.title}}

There three builder types supported by gulp-build-manager.
* Named builder - class name of GBuilder or it's decendant classes
* Function builder - function or function object
* Object builder - object describing internal or external command to execute
* GBuilder instance

## Types
```js
//--- Named Builders
export type GBuilderClassName = string;
export type NamedBuilders = GBuilderClassName;

//--- Function Builders
export type FunctionBuilder = (rtb: RTB, ...args: any[]) => void | Promise<unknown>
export type FunctionObjectBuilder = { func: FunctionBuilder; args: any[] }
export type FunctionBuilders = FunctionBuilder | FunctionObjectBuilder;

//--- Object Builders
export interface ExternalBuilder extends ExternalCommand { }

export interface CopyBuilder {
    command: 'copy',
    target?: CopyParam | CopyParam[],
    options?: Options
}
export type CopyParam = { src: string | string[], dest: string };

export type ObjectBuilders = CopyBuilder | ExternalBuilder;

//--- GBuilder
export class GBuilder extends RTB {
    constructor(conf?: BuildConfig) {
        super(conf || { buildName: '' });
    }

    protected build(): void | Promise<unknown> {}
}

//--- Combined Builders Type
export type Builders = NamedBuilders | FunctionBuilders | ObjectBuilders | GBuilder;

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
const copy1 = {
    buildName: 'copy1',
    builder: {
        command: 'copy',    // this is reserved internal command
        target: [
            { src: [upath.join(basePath, 'path-src1/**/*.*')], dest: upath.join(basePath, 'path-dest1') },
            { src: [upath.join(basePath, 'path-src2/**/*.*')], dest: upath.join(basePath, 'path-dest2') }
        ],
        options: { verbose: true }
    },
}

const cmd1 = {
    buildName: 'command1',
    builder: {
        command: 'node',
        args: ['-v'],
        options: { shell: false }
    },
    flushStream: true
}
```


## GBuilder
It is recommended all the custom builder classes to extend GBuilder, not RTB.
GBuilder class is avail from GBuilder.builders property.

### build()
Main build function. All the RTB API's are availabe using this object because GBuilder extends RTB.
```js
(): void | Promise<unknown> {}
```

### Custom Builder class example
```js
const gbm = require('gulp-build-manafer');

class CopyBuilder extends gbm.builders.GBuilder {
    protected build() {
        this.src().dest();
    }
}
```


## Build-in Builders
- [GBuilder](/{{site.contentsurl}}/builtin-builders/GBuilder)
- [GCoffeeScriptBuilder](/{{site.contentsurl}}/builtin-builders/GCoffeeScriptBuilder)
- [GConcatBuilder](/{{site.contentsurl}}/builtin-builders/GConcatBuilder)
- [GCSSBuilder](/{{site.contentsurl}}/builtin-builders/GCSSBuilder)
- [GImagesBuilder](/{{site.contentsurl}}/builtin-builders/GImagesBuilder)
- [GJavaScriptBuilder](/{{site.contentsurl}}/builtin-builders/GJavaScriptBuilder)
- [GJekyllBuilder](/{{site.contentsurl}}/builtin-builders/GJekyllBuilder)
- [GMarkdownBuilder](/{{site.contentsurl}}/builtin-builders/GMarkdownBuilder)
- [GPaniniBuilder](/{{site.contentsurl}}/builtin-builders/GPaniniBuilder)
- [GRTLCSSBuilder](/{{site.contentsurl}}/builtin-builders/GRTLCSSBuilder)
- [GTwigBuilder](/{{site.contentsurl}}/builtin-builders/GTwigBuilder)
- [GTypeScriptBuilder](/{{site.contentsurl}}/builtin-builders/GTypeScriptBuilder)
- [GWebpackBuilder](/{{site.contentsurl}}/builtin-builders/GWebpackBuilder)
- [GZipBuilder](/{{site.contentsurl}}/builtin-builders/GZipBuilder)
