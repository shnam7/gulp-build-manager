# Gulp Build Manager
Gulp Build Manager, gbm in short, is an easy to use, configuration based gulp task manager. Users can create gulp tasks with simple build configurations. At the same time, javascript can be used to customize and extend the configuration.

Focus on build actions, rather than environment setup.

## Installation
```bash
npm i gulp-build-manager --save-dev
npm i gulp --save-dev
```
Note that gulp should also be installed.


## Documentation
Go to [Documentation](https://shnam7.github.io/gulp-build-manager)


## Key features
- Quick and easy gulp task creation
- Watching, reloading, and cleaning with minimal efforts
- Rich run-time builder API for user build actions
- Sync and async control for tasks, build actions, and gulp streams for flushing.
- Automatic Node module installation (npm/pnpm/yarn)
- Small to large scale project support using modular configuration
- Pre-defined Buildt-in builders and extensions
- Custom builders and extension support


## Quick example: gulpfile.js

```js
const gbm = require('gulp-build-manager');

const scss = {
    buildName: 'scss',
    builder: (rtb) => {
        const sass = require('gulp-sass');
        rtb.src().pipe(sass().on('error', sass.logError)).dest()
    },
    src: 'assets/scss/**/*.scss',
    dest: 'www/css',
    npmInstall: ['gulp-sass']
}

const scripts = {
    buildName: 'babel',
    builder: (rtb) => {
        const babel = require('gulp-babel');
        rtb.src().pipe(babel()).dest()
    },
    src: 'assets/js/**/*.js',
    dest: 'www/js',
    npmInstall: ['gulp-babel', '@babel/core']
}

const build = {
    buildName: '@build',
    triggers: gbm.parallel(scss, scripts),
    clean: 'www/{css,js}'
}

gbm.createProject(build)
    .addWatcher({
        watch: 'www/**/*.html',
        browserSync: { server: 'www' }
    })
    .addCleaner();
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

const scss = {
    buildName: 'scss',
    builder: 'GCSSBuilder',
    src: 'assets/scss/**/*.scss',
    dest: 'www/css',
    npmInstall: ['gulp-sass']
}

const scripts = {
    buildName: 'babel',
    builder: 'GJavaScriptBuilder',
    src: 'assets/js/**/*.js',
    dest: 'www/js',
    npmInstall: ['gulp-babel', '@babel/core']
}

const build = {
    buildName: '@build',
    triggers: gbm.parallel(scss, scripts),
    clean: 'www/{css,js}'
}

gbm.createProject(build)
    .addWatcher({
        watch: 'www/**/*.html',
        browserSync: { server: 'www' }
    })
    .addCleaner();
```

Check **[examples](examples)** directory for more working examples.


<p align="center">
  <img class="logo" src="https://shnam7.github.io/gulp-build-manager/images/gbm.svg" width="64px">
  <p align=center>Copyright &copy; 2017, under <a href="./LICENSE">MIT</a></p>
</div>
