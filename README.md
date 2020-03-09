# Gulp Build Manager
Gulp Build Manager, gbm in short, is an easy to use, configuration based gulp task manager. Users can create gulp tasks with simple build configuration. At the same time, javascript can be used to customize or extend the configuration.

## Key features
- Various Buildt-in builders and plugins
- Custom builders and plugins support
- Watchers and Reloaders for change detection and browser reloading
- Rich run-time builder API's, which can be used for custom build actions
- Synchronization control for tasks, build actions, gulp stream flushing, etc.
- Modular project support to handle multiple sub projects from a single gulpfile.


## What's new in version 4?
- Whole architecture improved for better features and performance
- Main task creator redesigned using class object, not gbm() function
- Promise handling improved for better synchronization in build processes
- Multiple, modular build projects support is supported in a single gulpfile
- Reloaders enhanced to support multiple watch task execution
- Rich run time API support with RTB, Run-Time-Builder, class
- And more ...


## Installation
Refer to [Getting Started](/docs/contents/getting-started.md) guide


## Migration from v3
Refer to [Migration from v3](/docs/contents/resources/migration-from-v3.md)



## Sample gulpfile.js using gbm
```js
const gbm = require('../../lib');
const upath = require('upath');

const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, '_build');


const scss = {
    buildName: 'scss',
    builder: 'GCSSBuilder',
    src: upath.join(srcRoot, 'scss/**/*.scss'),
    dest: upath.join(destRoot, 'css'),
}

const scripts = {
    buildName: 'scripts',
    builder: 'GTypeScriptBuilder',
    src: upath.join(srcRoot, 'scripts/**/*.ts'),
    dest: upath.join(destRoot, 'js'),
}

const twig = {
    buildName: 'twig',
    builder: 'GTwigBuilder',
    src: [upath.join(srcRoot, 'pages/**/*.twig')],
    dest: upath.join(destRoot, ''),
    moduleOptions: {
        twig: {
            base: upath.join(srcRoot, 'templates'),
            data: upath.join(srcRoot, 'data/**/*.{yml,yaml,json}'),
            extend: require('twig-markdown'),
        },
        htmlPrettify: { indent_char: ' ', indent_size: 2 },
        htmlmin: { collapseWhitespace: true, }
    },
    addWatch: [ // include sub directories to detect changes of the files which are not in src list.
        upath.join(srcRoot, 'templates/**/*.twig'),
        upath.join(srcRoot, 'markdown/**/*.md'),
        upath.join(srcRoot, 'data/**/*.{yml,yaml,json}')
    ]
}

gbm.createProject(app)
    .addTrigger('default', /.*/)
    .addWatcher('watch', { browserSync: { server: upath.resolve(destRoot), } })
    .addCleaner('clean', { clean: destRoot })
    .resolve();
```


<p align="center">
  <img class="logo" src="https://shnam7.github.io/gulp-build-manager/images/gbm.svg" width="64px">
  <p align=center>Copyright &copy; 2017, under <a href="./LICENSE">MIT</a></p>
</div>

[0]: https://shnam7.github.io/gulp-build-manager/
[1]: https://github.com/shnam7/gulp-build-manager-examples
[2]: https://github.com/shnam7/gulp-build-manager/tree/master/CHANGELOG.md
