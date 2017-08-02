---
layout: docs
title: Built-in Plugins
---

# {{page.title}}
You can get the built-in plugin classes with gbm:
```javascript
const gbm = require('gulp-build-manager');

const DebugPlugin = gbm.DebugPlugin;
// ...
```

### ChangedPlugin
Plugin wrapper for [gulp-changed](https://github.com/sindresorhus/gulp-changed)<br>
See [source code]({{site.repo}}/src/plugins/ChangedPlugin.js) for the details.

## CoffeeScriptPlugin
CoffeeScript transpiler.<br>
See [source code]({{site.repo}}/src/plugins/CoffeeScriptPlugin.js) for the details.

## ConcatPlugin
File concatenator. See source code for the details.<br>
See [source code]({{site.repo}}/src/plugins/ConcatPlugin.js) for the details.

## CSSNanoPlugin
CSS minifier. See source code for the details.<br>
See [source code]({{site.repo}}/src/plugins/CSSNanoPlugin.js) for the details.

## CSSPlugin
Stylesheet processor supporting sass/scss/less with postcss. See source code for the details.<br>
See [source code]({{site.repo}}/src/plugins/CSSPlugin.js) for the details.

## gbm.DebugPlugin
Plugin wrapper for [gulp-debug](https://github.com/sindresorhus/gulp-debug)<br>
See [source code]({{site.repo}}/src/plugins/DebugPlugin.js) for the details.

## FilterPlugin
Plugin wrapper for [gulp-filter](https://github.com/sindresorhus/gulp-filter)<br>
See [source code]({{site.repo}}/src/plugins/FilterPlugin.js) for the details.

## JavaScriptPlugin
JavaScript process with babel support. See source code for the details.<br>
See [source code]({{site.repo}}/src/plugins/JavaScriptPlugin.js) for the details.

## PlumberPlugin
Plugin wrapper for [gulp-plumber](https://github.com/floatdrop/gulp-plumber)<br>
See [source code]({{site.repo}}/src/plugins/PlumberPlugin.js) for the details.

## TwigPlugin
Twig builder. See source code for the details.<br>
See [source code]({{site.repo}}/src/plugins/TwigPlugin.js) for the details.

## TypeScriptPlugin
TypeScript transpiler. See source code for the details.<br>
See [source code]({{site.repo}}/src/plugins/TypeScriptPlugin.js) for the details.

## UglifyPlugin
Javascript minifier.<br>
See [source code]({{site.repo}}/src/plugins/UglifyPlugin.js) for the details.

