---
layout: docs
---

# GCSSBuilder
CSS builder. sass/scss/less and postcss are supported. You can use postcss together with sass/scss/less.
PostCSS is enabled by default (from v3.1) unless it's turned off intentionally.

#### Builder specific Options
  - *conf.buildOptions.postcss* (<i>type:boolean, default:true</i>)
    If set to false, PostCSS is disabled. PostCSS automatically handles auto-prefixing without autoPrefixer.
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
  - *conf.buildOptions.sourceType* (<i>type:string, default:'scss'</i>)
    Specifies input source type. Possible values are 'css', 'scss', 'sass', 'less'.
  - *conf.buildOptions.autoPrefixer* (<i>type:boolean, default:true</i>)
    Enable autoPrefixer. If postcss option is enabled(default), this is ignored in preference to auto-prefixing feature of postcss.

    If postcss option is enabled, this option is ignored and autoPrefixer is not used.
    See conf.buildOptions.postcss option above.

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
