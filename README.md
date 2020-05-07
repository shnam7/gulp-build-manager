# Gulp Build Manager
Gulp Build Manager, gbm in short, is an easy to use, configuration based gulp task manager. Users can create gulp tasks with simple build configurations. At the same time, javascript can be used to customize and extend the configuration.

Focus on build actions, rather than environment setup.

## Installation
```bash
npm i gulp-build-manager --save-dev
npm i gulp --save-dev
```

## Documentation
Go to [Documentation](https://shnam7.github.io/gulp-build-manager)


## Key features
- Quick and easy gulp task creation
- Watching, reloading, and cleaning with minimal efforts
- Rich run-time builder API for user build actions
- Sync and async control for tasks, build actions, and gulp streams for flushing.
- Automatic NPM module installation
- Small to large scale project support using modular configuration
- Pre-defined Buildt-in builders and extensions
- Custom builders and extension support


## What's new in version 4?
- New architecture for better performance and easier interface
- Improved promise handling for better synchronization in build processes
- Multiple, modular build projects support
- Enhanced watching and reloading
- Rich runtime builder API for easier build routine development and customization


## Automatic mudule installation

### Using gulpfile.js
```js
const gbm = require('gulp-build-manager');
gbm.setNpmOptions({autoInstall: true, installOptions: '--no-save'});
```

### Using command line
```sh
npx gulp <task-name> --npm-auto # default npm install option is '--save-dev'
```

Refer to [Getting Started](docs/contents/01-getting-started.md) page for more information.



## Quick example: gulpfile.js

```js
const gbm = require('gulp-build-manager');
const upath = require('upath')

const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, 'www');


const scss = {
    buildName: 'scss',
    builder: (rtb) => rtb.src().pipe(sass().on('error', sass.logError)).dest(),
    src: upath.join(srcRoot, 'scss/**/*.scss'),
    dest: upath.join(destRoot, 'css'),
}

const scripts = {
    buildName: 'babel',
    builder: (rtb) => rtb.src().pipe(require('gulp-babel')()).dest(),
    src: upath.join(srcRoot, 'js/**/*.js'),
    dest: upath.join(destRoot, 'js'),
}

const build = {
    buildName: '@build',
    triggers: gbm.parallel(scss, scripts),
    clean: upath.join(destRoot, '{css,js}')
}

gbm.createProject(build)
    .addWatcher({
        watch: upath.join(destRoot, '**/*.html'),
        browserSync: { server: destRoot }
    })
    .addCleaner()
```
This gulpfile will create a single project with 5 gulp tasks as following:
- scss: sass transpiler
- babel: ES6 transpiler using babel
- @build: main task running 'scss' and 'babel' in parallel
- @clean: clean task (default name is @clean)
- @watch: Full featured watch task with reloading using browser-sync (default name is @watch)


## Easier way using built-in builders: gulpfile.js
```js
const gbm = require('gulp-build-manager');
const upath = require('upath')

const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, 'www');


const scss = {
    buildName: 'GCSSBuilder',
    src: upath.join(srcRoot, 'scss/**/*.scss'),
    dest: upath.join(destRoot, 'css'),
}

const scripts = {
    buildName: 'GJavaScriptBuilder',
    src: upath.join(srcRoot, 'js/**/*.js'),
    dest: upath.join(destRoot, 'js'),
}

const build = {
    buildName: '@build',
    triggers: gbm.parallel(scss, scripts),
    clean: upath.join(destRoot, '{css,js}')
}

gbm.createProject(build)
    .addWatcher({
        watch: upath.join(destRoot, '**/*.html'),
        browserSync: { server: destRoot }
    })
    .addCleaner()
```

Check **[examples](examples)** directory for more working examples.


<p align="center">
  <img class="logo" src="https://shnam7.github.io/gulp-build-manager/images/gbm.svg" width="64px">
  <p align=center>Copyright &copy; 2017, under <a href="./LICENSE">MIT</a></p>
</div>
