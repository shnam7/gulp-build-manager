# Gulp Build Manager
Gulp Build Manager, gbm in a short name, is an Easy to use, Flexible gulp task manager. It is a tool helping gulp users to create tasks with simple configuration. This provides the convenience of configuration and the flexibility of javascript programming in setting up gulp tasks.

gbm provides various built-in builder class objects including:
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
  
Those classes can be extended or modified using class inheritance.
gbm also provides plugin system that can be plugged into the build processes.
Builder can also be in the form of function, which is sometimes simpler and convenient.

To learn more, see [Documentation][0].<br>
You can also check out various working [examples][1] in GitHub.

[0]: docs/index.md
[1]: ./examples
