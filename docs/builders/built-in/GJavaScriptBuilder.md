---
layout: docs
---

# GCSSBuilder
CSS builder. sass/scss/less and postcss are suported. You can use postcss together with sass/scss/less.

#### Builder specific Options
  - *conf.buildOptions.sourceMap* (<i>type:boolean, default:false</i>)<br>
    If set to true, sourceMap files are generated.
  - *conf.buildOptions.lint* (<i>type:boolean, default:false</i>)<br>
    If set to true, linter is activated.
  - *conf.buildOptions.minify* (<i>type:boolean, default:false</i>)<br>
    If set to true, *.min.js files are generated.
  - *conf.buildOptions.minifyOnly* (<i>type:boolean, default:false</i>)<br>
    If set to true, *.min.js files are generated but non-minified files are not created.
  - *conf.buildOptions.babel* (<i>type:boolean, default:false</i>)<br>
    If set to true, babel is enabled so that you can use es6 features.

#### Example
```javascript
const javaScript = {
  buildName: 'javaScript',
  builder: 'GJavaScriptBuilder',
  src: [upath.join(srcRoot, 'scripts/js/**/*.js')],

  // use order property to set outFile orders
  order: ['*main.js'],
  dest: upath.join(destRoot, 'js'),
  outFile: 'sample.js',
  buildOptions: {
    lint: true,
    babel: true,
    minify: true,
    sourceMap: true
  },
  moduleOptions: {
    eslint: {
      "extends": "eslint:recommended",
      "rules": {
        "strict": 1,
      },
      "parserOptions": {
        "ecmaVersion": 6,
      }
    }
  },
};
```
