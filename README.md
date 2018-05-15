# Gulp Build Manager

Gulp Build Manager, 'gbm' for short, is an easy to use, flexible gulp task manager. It is a tool helping gulp users to create tasks with simple configuration. This provides the convenience of configuration and the flexibility of javascript programming in setting up gulp tasks.

### Installation
```bash
npm install gulp-build-manager --save-dev
```

To install the latest version from github:
```bash
npm install github:shnam7/gulp-build-manager#master --save-dev
````

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

Those classes can be extended or modified using class inheritance.<br>
gbm also provides plugin system, which enables users to add custom functions or plugin objects into specific stages of the build process.
Builders can also be in the form of function, which is sometimes simpler and convenient.<br>
For *modular configuration* to handle complex project, refer to [modular configuration][4] section in documentation.<br>

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
[3]: https://github.com/shnam7/gulp-build-manager/tree/master/docs
[4]: https://shnam7.github.io/gulp-build-manager/resources/modular-configuration/

<br>
<br>
<p align="center">
  <img class="logo" src="https://shnam7.github.io/gulp-build-manager/images/gbm.svg" width="64px">
  <p align=center>Copyright &copy; 2017, under <a href="./LICENSE">MIT</a></p>
</div>
