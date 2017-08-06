---
layout: docs
---
{% assign srcurl = site.repo | append: '/tree/master' %}

# Built-in Plugins
You can get the built-in plugin classes with gbm:
```javascript
const gbm = require('gulp-build-manager');

const DebugPlugin = gbm.DebugPlugin;
// ...
```

### ChangedPlugin
Plugin wrapper for [gulp-changed](https://github.com/sindresorhus/gulp-changed){:target='_blank'}<br>
See [source code]({{srcurl}}/src/plugins/ChangedPlugin.js){:target='_blank'} for the details.

## CoffeeScriptPlugin
CoffeeScript transpiler.<br>
See [source code]({{srcurl}}/src/plugins/CoffeeScriptPlugin.js){:target='_blank'} for the details.

## ConcatPlugin
File concatenator. See source code for the details.<br>
See [source code]({{srcurl}}/src/plugins/ConcatPlugin.js){:target='_blank'} for the details.

## CSSNanoPlugin
CSS minifier. See source code for the details.<br>
See [source code]({{srcurl}}/src/plugins/CSSNanoPlugin.js){:target='_blank'} for the details.

## CSSPlugin
Stylesheet processor supporting sass/scss/less with postcss. See source code for the details.<br>
See [source code]({{srcurl}}/src/plugins/CSSPlugin.js){:target='_blank'} for the details.

## DebugPlugin
Plugin wrapper for [gulp-debug](https://github.com/sindresorhus/gulp-debug){:target='_blank'}<br>
See [source code]({{srcurl}}/src/plugins/DebugPlugin.js){:target='_blank'} for the details.

## FilterPlugin
Plugin wrapper for [gulp-filter](https://github.com/sindresorhus/gulp-filter){:target='_blank'}<br>
See [source code]({{srcurl}}/src/plugins/FilterPlugin.js){:target='_blank'} for the details.

## JavaScriptPlugin
JavaScript process with babel support. See source code for the details.<br>
See [source code]({{srcurl}}/src/plugins/JavaScriptPlugin.js){:target='_blank'} for the details.

## MarkdownPlugin
Markdown compiler.
See [source code]({{srcurl}}/src/plugins/MarkdownPlugin.js){:target='_blank'} for the details.

## PlumberPlugin
Plugin wrapper for [gulp-plumber](https://github.com/floatdrop/gulp-plumber){:target='_blank'}<br>
See [source code]({{srcurl}}/src/plugins/PlumberPlugin.js){:target='_blank'} for the details.

## TwigPlugin
Twig builder. See source code for the details.<br>
See [source code]({{srcurl}}/src/plugins/TwigPlugin.js){:target='_blank'} for the details.

## TypeScriptPlugin
TypeScript transpiler. See source code for the details.<br>
See [source code]({{srcurl}}/src/plugins/TypeScriptPlugin.js){:target='_blank'} for the details.

## UglifyPlugin
Javascript minifier.<br>
See [source code]({{srcurl}}/src/plugins/UglifyPlugin.js){:target='_blank'} for the details.

