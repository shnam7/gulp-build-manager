---
layout: docs
---

# GCoffeeScriptBuilder
CoffeeScript builder. Compiles coffeescript files into javascript.

#### Builder specific Options
  - *conf.buildOptions.sourceMap* (<i>type:boolean, default:false</i>)
    If set to true, sourceMap files are generated.
  - *conf.buildOptions.lint* (<i>type:boolean, default:false</i>)
    If set to true, linter is activated.
  - *conf.buildOptions.minify* (<i>type:boolean, default:false</i>)
    If set to true, *.min.js files are generated.
  - *conf.buildOptions.minifyOnly* (<i>type:boolean, default:false</i>)
    If set to true, *.min.js files are generated but non-minified files are not created.
  - *conf.buildOptions.outFileOnly* (<i>type:boolean, default:*true*</i>)
    If set to false, each transpiled files are generated before concatenation.
    This option is valid only when conf.outFile is set.


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
