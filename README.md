# Gulp Build Manager

Gulp Build Manager, 'gbm' for short, is an easy to use, flexible gulp task manager. It is a tool helping gulp users to create tasks with simple configuration. This provides the convenience of configuration and the flexibility of javascript programming in setting up gulp tasks.

### Installation
```bash
npm install gulp@4    # install gulp version 4
npm install gulp-build-manager --save-dev
```

To install the latest version from github:
```bash
npm install gulp@4    # install gulp version 4
npm install github:shnam7/gulp-build-manager --save-dev
````
Note that gulp is not automatically installed together with gulp-build-manager. It should be installed of its own.

### Quick Start
Creating gulp task is simple and easy.

```javascript
const gbm = require('gulp-build-manager');
const srcRoot = 'assets';
const destRoot = '_build';

const scss = {
  buildName: 'scss',
  builder: 'GCSSBuilder',
  src: [upath.join(srcRoot, 'scss/**/*.scss')],
  dest: upath.join(destRoot, 'css'),
  moduleOptions: {
    sass: { includePaths: [ 'assets/scss' ] },
  }
};

const javaScript = {
  buildName: 'javaScript',
  builder: 'GJavaScriptBuilder',
  src: ['assets/scripts/js/**/*.js'],
  dest: '_build/js',
  outFile: 'sample.js',
  buildOptions: {
    minify: true,
    sourceMap: true
  }
};

gbm({
  systemBuilds: {
    build: gbm.parallel(scss, javaScript),
    clean: ['_build'],
    default: ['@clean', '@build'],
  }
});
```

### Notes
Required modules are not installed automatically. When running gulp with the configuration, you can see errors of missing node modules. Then, install all the modules reuired.

### References
  - [Documentation][0]
  - [Examples][1]
  - [ChangeLog][2]

gbm provides various built-in builder classes including:
  - GBuilder - Base Builder, which work as a Copy Builder.
  - GCoffeeScriptBuilder
  - GConcatBuilder
  - GCopyBuilder - Copy files from multiple sources to multiple destinations
  - GCSSBuilder - sass/scss/less/postcss builder.
  - GExternalBuilder - builder to run external commands.
  - GImagesBuilder - Image optimizer
  - GJavaScriptBuilder
  - GJekyllBuilder
  - GMarkdownBuilder
  - GPaniniBuilder
  - GTwigBuilder
  - GTypeScriptBuilder
  - GWebpackckBuilder
  - GZipBuilder - File packer for distribution

Those classes can be extended or modified using class inheritance.
gbm also provides plugin system, which enables users to add custom functions or plugin objects into specific stages of the build process.
Builders can also be in the form of function, which is sometimes simpler and convenient.
For *modular configuration* to handle complex projects, refer to [modular configuration][4] section in documentation.


### Migration from v2
- Some of Build Configuration interface was changed and please refer to the [Examples][1] to find out how to migrate to achieve the same functionality with v3 interface.
- User plugins inside the Build Configuration are not supported. Instead, consider using 'preBuild' and 'postBuild' options or overload GBuilder methods.
- To keep using v2.x, install it with following command
  ```bash
  npm i gulp-build-manager@2 --save-dev
  ```

### Documentations for previous versions
  - [Dcoumentation - v2.2][3]

[0]: https://shnam7.github.io/gulp-build-manager/
[1]: https://github.com/shnam7/gulp-build-manager/tree/master/examples
[2]: https://github.com/shnam7/gulp-build-manager/tree/master/CHANGELOG.md
[3]: https://github.com/shnam7/gulp-build-manager/tree/v2.2.0/docs
[4]: https://shnam7.github.io/gulp-build-manager/resources/modular-configuration/

<br>
<br>
<p align="center">
  <img class="logo" src="https://shnam7.github.io/gulp-build-manager/images/gbm.svg" width="64px">
  <p align=center>Copyright &copy; 2017, under <a href="./LICENSE">MIT</a></p>
</div>
