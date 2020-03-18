---
layout: docs
title: Plugins
---

# Plugins

Plugin is a peice of build action encapsulated into a function or class object.
```js
type PluginFunction = (rtb: RTB, ...args: any[]) => Promise<unknown> | void;
type Plugins = PluginFunction | GPlugin;

class GPlugin {
    constructor(public options: Options = {}) { }

    process(rtb: RTB, ...args: any[]): Promise<unknown> | void {}
}
```


## Plugin function example
```js
const gbm = require('gulp-build-manager');

const myPlugin = (rtb, name) => { console.log('Hello!: ' + name) }

const hello = {
    buildName: 'hello',
    preBuild: rtb => rtb.chain(myPlugin, 'GBM')
}
```


## Plugin class example
Plugin classes should extend GPlugin class, which is available from GBuildManager instance.
```js
const gbm = require('gulp-build-manager');

class MyPlugin extends gbm.plugins.GPlugin {
    constructor(options = {}) { super(options); }

    process(rtb, name) {
        console.log(rtb.conf.buildName + ' - Hello!: ' + name + ', opt1=' + this.options.opt1);
    }
}

const hello = {
    buildName: 'hello',
    preBuild: rtb => rtb.chain(new MyPlugin({opt1: 'opt1'}), 'GBM')
}
```

## Return value
If Plugins return promise, then it will follow promise execution process including sync or async options.
Otherwise, it runs asynchronously and the returned value is ignored.



## Built-in Plugin classes

### CoffeeScriptPlugin
CoffeeScript transpiler. See [source code](../../src/plugins/CoffeeScriptPlugin.ts) for the details.


### CSSPlugin
Stylesheet processor supporting sass/scss/less with postcss. See source code for the details. See [source code](../../src/plugins/CSSPlugin.ts) for the details.


### JavaScriptPlugin
JavaScript process with babel support. See source code for the details. See [source code](../../src/plugins/JavaScriptPlugin.ts) for the details.


### MarkdownPlugin
Markdown compiler. See [source code](../../src/plugins/MarkdownPlugin.ts) for the details.


### TwigPlugin
Twig builder. See source code for the details. See [source code](../../src/plugins/TwigPlugin.ts) for the details.


### TypeScriptPlugin
TypeScript transpiler. See source code for the details. See [source code](../../src/plugins/TypeScriptPlugin.ts) for the details.
