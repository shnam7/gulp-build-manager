# Changelog

## v3.1
- Add GCleanBuilder and GPlugin:clean() plugin function
- Fix to prevent dummy task creation when no builder is set but dependencies or triggers exist in BuildConfig
- Fix BuildConfig.watchedPlus error of adding BuildConfig.watched data too making ti duplicated
- Fix faulty build task creation: removed parallel call when there's only one task
- Improve example/twig
- Add utils property to gbm namespace. usage example: gbm.index.wait()
- Add util function spawn(), which does not use shell by default. exec() now calls spawn() with shell enable option
- Change default value of BuildConfig.buildOptions.postcss to true (enable postcss by default)

## v3.0
- Redesign architecture utilizing Promise
  - Change GBuilder and GPlugin interface
  - Remove inline user plugin(BuildConf.plugins) support
  - Add preBuild and postBuild entries to BuildConfig
  - Full control on synchronous and asynchronous build actions
  - Change gulp-uglify to uglify-es to support es6
  - Remove DebugPlugin, FilterPlugin, ConcatPlugin, CopyPlugin, CSSNanoPlugin, UglifyPlugin, which are supported by GPlugin plugin functions (GPlugin.debug, etc)
- Update examples using new interfaces
- Remove default reloader from watcher because Watch does not always mean browser reloads.
- Change current directory of examples to the project root directory
- Add modular configuration guide(docs) and example(examples/modular)
- Add outFileOnly option to buildOptions
- Fix missing sourceMaps() call in GPlugin.concat() and CSSPlugin
- Fix minify and outFile errors on GCoffeeScriptBuilder, GJavaScriptBuilder, GCSSBuilder
- Add pushStream() and popStream()to GBuilder
- Fix build sequence to handle flushStream just after build() and before reload() 
- Change gulp 4.0 dependency from github to npm (npm i gulp@next)

## v2.2 - 2018-03-25
- Add GExternalBuilder and exmaples/external (Sec docs)
- Add GWebpackBuilder, WebpackPlugin (See docs)
- Simplify GJekyllBuilder with improved error handling by extending from GExternalBuilder.
- Add main gulpfile.js to build all the sub-projects including docs and examples 
- moduleOptions support arguments to module property functions (See docs)
- Add Travis CI support
- Update package.json scripts
- Package version tags are set to 'latest'

## v2.1 - 2018-03-06
- convert source codes into typescript
- Remove lodash.pick and lodash.merge 
- Add browser-sync support
- Add GPlugin.OnStream()

## 2.0.1 - 2018-01-06
- Add moduleOptions support in systemBuilds

## v2.0.0 - 2017-12-19
- Fix: UglifyPlugin to generate non-minified output correctly.
