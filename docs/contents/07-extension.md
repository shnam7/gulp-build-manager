---
id: extension
title: Extension
---

# Extension to RTB API
RTB Extension is a mdule that can be chained using rtb.chain() API. It is actually a function with following interface.
```js
type FunctionBuilder = (rtb: RTB, ...args: any[]) => void | Promise<unknown>;
type RTBExtension = (...args: any[]) => FunctionBuilder;
```
It receives arbitrary number of arguments and returns a build function with RTB instance as the first argement and the passed-in args as the next. With this RTB instance, users can do necessary operations during the build process.

Once the extension is ready, it can be registered to RTB extension set using RTB.registerExtension() function.

### Return value
If Extension returns promise, then it will follow the promise execution process involving sync or async options. Otherwise, it runs asynchronously and the returned value is ignored.

If synchronous actions are required, it is generally recommended to use rtb.promise() rather than returning a promise.


## Quick example
```js
// file: 'extensions/ext-hello.js'

const gbm = require('gulp-build-manager');
const upath = require('upath');

gbm.registerExtension('hello', (options={}) => (rtb, ...args) => {
    console.log(`Hello, this is custom extension. buildName=${rtb.buildName}`, options.msg)
    console.log(args);
});
```

```js
//file: 'gulpfile.js'
RTB.loadExtensions('./extensions/*.js'));

//--- custom extension
const customExt = {
    buildName: 'custom-ext',
    builder: rtb => rtb
        .chain(rtb.ext.hello({msg: 'Hi~~'}), 'arg1', 'arg2')
        .chain((rtb) => console.log(`custom function #1, buildName=${rtb.buildName}`))
        .chain(() => console.log('custom function #2')),

    postbuild: rtb => console.log(rtb.buildName + ` executed.`),
};
```


## Built-in Plugin classes

### rtb.ext.coffeeScript
CoffeeScript transpiler. See [source code](../../src/extension/ext-coffee.ts) for the details.


### rtb.ext.css
Stylesheet processor supporting sass/scss/less with postcss. See source code for the details. See [source code](../../src/extension/ext-css.ts) for the details.


### rtb.ext.javaScript
JavaScript process with babel support. See source code for the details. See [source code](../../src/extension/ext-javascript.ts) for the details.


### rtb.ext.markdown
Markdown transpiler. See [source code](../../src/extension/ext-markdown.ts) for the details.


### rtb.ext.twig
Twig builder. See source code for the details. See [source code](../../src/extension/ext-twig.ts) for the details.


### rtb.ext.typeScript
TypeScript transpiler. See source code for the details. See [source code](../../src/extension/ext-typeScript.ts) for the details.


### rtb.ext.webPack
Webpack builder. See source code for the details. See [source code](../../src/extension/ext-webpack.ts) for the details.
