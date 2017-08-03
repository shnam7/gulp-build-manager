---
layout: docs
---

# GCoffeeScriptBuilder
CoffeeScript builder. Compiles coffeescript files into javascript.

#### Builder specific Options
  - <em>conf.buildOptions.sourceMap</em> (<i>type:boolean, default:false</i>)<br>
    If set to true, sourceMap files are generated.
  - <em>conf.buildOptions.lint</em> (<i>type:boolean, default:false</i>)<br>
    If set to true, linter is activated.
  - <em>conf.buildOptions.minify</em> (<i>type:boolean, default:false</i>)<br>
    If set to true, *.min.js files are generated.
  - <em>conf.buildOptions.minifyOnly</em> (<i>type:boolean, default:false</i>)<br>
    If set to true, *.min.js files are generated but non-minified files are not created.


#### Example
```javascript
const srcRoot = 'assets';
const destRoot = '_build';

const coffeeScript = {
  buildName: 'coffeeScript',
  builder: 'GCoffeeScriptBuilder',
  src: [upath.join(srcRoot, 'scripts/coffee/**/*.coffee')],

  // use order property to set outFile orders
  order: ['*main.coffee'],
  dest: upath.join(destRoot, 'js'),
  outFile: 'sample.js',
  buildOptions: {
    lint: true,
    // minify: true,
    minifyOnly:true,
    sourceMap: true
  },
};
```
