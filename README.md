# Gulp Build Manager

Gulp Build Manager, gbm in a short name, is an easy to use, flexible gulp task manager. It is a tool helping gulp users to create tasks with simple configuration. This provides the convenience of configuration and the flexibility of javascript programming in setting up gulp tasks.

#### Reference
  - [Documentation][0]
  - [Examples][1]

gbm provides various built-in builder classes including:
  - GBuilder - Base Builder, which work as a Copy Builder.
  - GCoffeeScriptBuilder
  - GConcatBuilder
  - GCSSBuilder - sass/scss/less/postcss builder.
  - GImagesBuilder - Image optimizer
  - GJavaScriptBuilder
  - GJekyllBuilder
  - GMarkdownBuilder
  - GPaniniBuilder
  - GTwigBuilder
  - GTypeScriptBuilder
  - GWebPackBuilder
  - GZipBuilder - File packer for distribution

Those classes can be extended or modified using class inheritance.<br>
gbm also provides plugin system, which enables users to add custom functions or plugin objects into specific stages of the build process.
Builders can also be in the form of function, which is sometimes simpler and convenient.

To learn more, see [Documentation][0].<br>
You can also check out various working [examples][1] in GitHub.

[0]: https://shnam7.github.io/gulp-build-manager/
[1]: ./examples
