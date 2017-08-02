---
layout: docs
title: GCSSBuilder
---

# {{page.title}}
CSS builder. sass/scss/less and postcss are suported. You can use postcss together with sass/scss/less.

#### Builder specific Options
  - <em>conf.buildOptions.sourceMap</em> (<i>type:boolean, default:false</i>)<br>
    If set to true, sourceMap files are generated.
  - <em>conf.buildOptions.lint</em> (<i>type:boolean, default:false</i>)<br>
    If set to true, linter is activated.
  - <em>conf.buildOptions.minify</em> (<i>type:boolean, default:false</i>)<br>
    If set to true, *.min.js files are generated.
  - <em>conf.buildOptions.minifyOnly</em> (<i>type:boolean, default:false</i>)<br>
    If set to true, *.min.js files are generated but non-minified files are not created.
  - <em>conf.buildOptions.sourceType</em> (<i>type:string, default:'scss'</i>)<br>
    pecifies source type from 'css', 'scss', 'sass', 'less'.
  - <em>conf.buildOptions.autoPreficxer</em> (<i>type:boolean, default:false</i>)<br>
    If postcss is enabled, autoPrefix is enabled by default. If not, ou need to set this option to true to enable autoPrefixer.<br>

#### Notes
  - linter is using stylelint with postcss. So, if lint is enabled, postcss is automatically enabled and you need to install the required postcss packages.

#### Example
```javascript
const sass = {
  buildName: 'sass',
  builder: 'GCSSBuilder',
  src: [upath.join(srcRoot, 'scss/**/*.scss')],
  dest: upath.join(destRoot, 'css'),
  buildOptions: {
    sourceType: 'scss',
    sourceMap: true,
    lint: true,
    minify: true,
    // autoPrefixer: true,
    postcss: true
  },
  moduleOptions: {
    sass: {
      includePaths: [
        'assets/scss'
      ]
    },
    postcss: {
      plugins: [
        require('postcss-cssnext'),
        require('postcss-utilities'),
        require('lost'),
      ]
    }
    stylelint: {
      configFile: upath.join(srcRoot, '.stylelintrc')
    }
  }
};
```
