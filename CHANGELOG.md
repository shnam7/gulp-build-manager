# Changelog
## v3.0.0
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
- Add modular configuration example (examples/modular)

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
