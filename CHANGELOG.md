# Changelog

## 4.0
- RTB, Run-Time-Builder, introduction with rich API set
- Improved promise handling for better build process synchronization
- Add Object Builder types, ExternalBuilder and CopyBuilder
- Remove GExternalBuilder, GCopyBuilder
- Remove BuildConfig.copy
- Remove examples and docs (moved to separate repositories)
- Feature Add check for duplicate gulp task in GBuildManager:resolve()
- Feature Add GProjectManager
- Feature Add new interface for main task creator in gulpfle
- Feature Add multiple reloader supports
- Feature Add automatic npm module installation
- Replace plugins with extension model
- Improve performance by removing all dummy task creation
- Add Event emissions to RTB for custom hooks


## 3.2.0-rc
- Add GRTLCSSBuilder
- Rename cleancss to cleanCss in GPlugin.cleancss and moduleOptions.cleancss
- Update docs using wicle 2.0.0-dev
- Update SystemJS loader to version 5
- Fix "Can't find module 'chokidar'" error (Set tsconfig.json moduleResolution to "Node")
- Add ExternalBuilder into GBuilder (GExternalBUilder is deprecated)
- Restructuring internal module architecture (in progress)
- Refine code formatting (4 spaces for tab)

## v3.1.2
- Add Browserslist support, removing default value for autoprefixer
- Fix crash issue when conf.dependencies or conf.triggers has empty array value

## v3.1
- Add GCleanBuilder and GPlugin:clean() plugin function
- Fix to prevent dummy task creation when no builder is set but dependencies or triggers exist in BuildConfig
- Fix BuildConfig.watchedPlus error of adding BuildConfig.watched data too making ti duplicated
- Fix faulty build task creation: removed parallel call when there's only one task
- Improve example/twig
- Add utils to gbm namespace. usage example: gbm.index.wait()
- Add util function spawn(), which does not use shell by default. exec() now calls spawn() with shell enable option
- Change default value of BuildConfig.buildOptions.postcss to true (enable postcss by default)
- Add watcher and cleaner to gbm namespace
- Fix BuildConfig.watch.task option to override task to run on watch
- Add loadData() to utils (load yml and json files into a single object)
- Add data file support for TwigPlugin using gulp-data
- Add verbose option to spawn() function in utils/process.ts
- Update CSSPlugin: separate postcss mode and gulp mode, improved lint, improved autoprefixer
- Deprecate GPlugin.cssnano replacing it with GPlugin.cleancss (gulp-cssnano replaced with gulp-clean-css)
- Add common support layer modules and default enabled modules into npm dependency: gulp-clone, gulp-concat, gulp-filter, gulp-order, gulp-rename, gulp-postcss, autoprefixer
- Fix error in TypeScriptPlugin outFile and outDir normalization and config overriding sequence
- Improve examples/webpack to have simple watchable demo page
- Add BuildConf.copy option to support file copies in the last stage of build, but before postBuild()
- Fix reload() to come after postBuild() in build sequence
- Modify WebpackPlugin to run webpack without wepack-stream, simplifying the structure
- Move GPlugin built-in plugin functions, debug(), filter(), concat(), rename() to GBuilder API
- Fix TypeScriptPlugin not to generate map file for non-minified source when minifyOnly option is enabled
- Add buildConfig.declarationMap option to GTypeScriptBuilder

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
