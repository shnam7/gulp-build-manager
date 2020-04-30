---
id: migration-from-v3
title: Migration from v3
---

# Migration from v3

### gbm main function
In v4, gbm() function is not supported. Instead, gbm is available as an instance of GBuildManager class. No systemBuilds tasks are created automatically. So, uses should create it using conf.dependencies or conf.triggers property if it is necessary.

v3 example
```js
gbm({
    builds: [scss, scripts, twig],
    systemBuilds: {
        build: [scss.buildName, scripts.buildName, twig.buildName],
        default: ['@build'],
        watch: { browserSync: { server: upath.resolve(destRoot) } },
        clean: ['_build']
    }
});
```

v4 conversion
```js
const build = { buildName: '@build', dependencies: gbm.parallel(scss, scripts, twig) };
const default = { buildName: '@default', dependencies: '@build' };
gbm.project(build)
    .addWatcher({ browserSync: { server: upath.resolve(destRoot) } })
    .addCleaner({ clean: ['_build'] })
```


### Copy operations
GCopyBuilder and buildConf.copy property is removed, because it can be easily achieved with rtb object v4.

v3 example
```js
const copy = {
    buildName: 'copy',
    builder: 'GCopyBuilder',
    src: [upath.join(basePath, 'path-src1/**/*.*')],
    dest: upath.join(basePath, 'path-dest1'),
    copy: [
        { src: [upath.join(basePath, 'path-src1/**/*.*')], dest: upath.join(basePath, 'path-dest3') },
        { src: [upath.join(basePath, 'path-src2/**/*.*')], dest: upath.join(basePath, 'path-dest4') },
    ],
    flushStream: true, // task to finish after all the files copies are finished
    buildOptions: {
        targets: [
            { src: [upath.join(basePath, 'path-src1/**/*.*')], dest: upath.join(basePath, 'path-dest1') },
            { src: [upath.join(basePath, 'path-src2/**/*.*')], dest: upath.join(basePath, 'path-dest2') },
        ],
    },
};
```

v4 conversion
```js
const copy = {
    buildName: 'copy',
    builder: rtb => rtb.copy({
        { src: [upath.join(basePath, 'path-src1/**/*.*')], dest: upath.join(basePath, 'path-dest1') },
        { src: [upath.join(basePath, 'path-src1/**/*.*')], dest: upath.join(basePath, 'path-dest1') },
        { src: [upath.join(basePath, 'path-src2/**/*.*')], dest: upath.join(basePath, 'path-dest2') },
    }),
    postBuild: rtb => rtb.copy({
        { src: [upath.join(basePath, 'path-src1/**/*.*')], dest: upath.join(basePath, 'path-dest3') },
        { src: [upath.join(basePath, 'path-src2/**/*.*')], dest: upath.join(basePath, 'path-dest4') },
    }),
    flushStream: true, // task to finish after all the files copies are finished
};
```


### Built-in builders and Plugins
Built-in builders available in gbm.xxx now moved to gbm.builders.xxx. Plugins are not supported anymore because it's replace with RTB extension.

v3 example
```js
class MyClass extends gbm.GBuilder {
};
```

v4 conversion
```js
class MyClass extends gbm.builders.GBuilder {
};
```


### GCleanBuilder
GCleanBuilder removed. user rtb.clean() instead.

v3 example
```js
const clean1 = {
    buildName: 'myClean1',
    builder: 'GCleanBuilder',
    clean: ['dir/**/files-to-delete*.*'] // set files to delete here
};
```

v4 conversion
```js
const clean1 = {
    buildName: 'myClean1',
    builder: rtb = > rtb.clean(),
    clean: ['dir/**/files-to-delete*.*'] // set files to delete here
};
```


### GPlugin static functions moved to RTB class
- gbm.GPlugin.clean --> rtb.clean()
- gbm.GPlugin.clean --> rtb.copy()
- ...

v3 example
```js
const clean2 = {
    buildName: 'myClean2',
    preBuild: (builder) => {
        builder.chain(gbm.GPlugin.clean);
        let promise = gbm.GPlugin.clean(builder);
        return promise; // return promise to finish clean before the build finishes (sync)
    }
    clean: ['dir/**/files-to-delete*.*'], // set files to delete here
};
```

v4 conversion
```js
const clean1 = {
    buildName: 'myClean1',
    preBuild: rtb => rtb.clean(),           // returns Promise
    clean: ['dir/**/files-to-delete*.*']    // set files to delete here
};
```


### External command no longer supported in GBuilder constructor
Use rtb.exec() or External Builder instead.

v3 example
```js
const cmd1 = {
    buildName: 'external-command1',
    builder: new gbm.GBuilder({ command: 'dir', args: ['.'] }),
};
```

v4 conversion
```js
const cmd1: {
    buildName: 'external-command1',
    builder: rtb => rtb.exec({ command: 'dir', args: ['.'] }),
}

//--- or

const cmd2 = {
    buildName: 'node-version',
    builder: {
        command: 'node',
        args: ['-v'],
    }
}
```


### BuildConfig.watch,  options
In v4, BuildConfig.watch should be striing | string[], not object. BuildConfig.watch.watchedPlus changed to BuildConfig.addWatch. No reloader options, such as livereload or browserSync, are accepted because these are now supported by GProject, and can be configured using GProject.addWatcher().

v3 example
```js
const panini = {
    buildName: 'panini',
    builder: 'GPaniniBuilder',
    watch: {
        // include sub directories to detect changes of the file which are not in src list.
        watched: [upath.join(srcRoot, '**/*')],
        watchedPlus: ['extra-files/**/*']
    }
};
```

v4 conversion
```js
const panini = {
    buildName: 'panini',
    builder: 'GPaniniBuilder',
    watch: [upath.join(srcRoot, '**/*')],
    addWatch: ['extra-files/**/*']
};
```


### Resource
For more examples, look into the gbmconfig.js files in **[examples](../../examples)** directory of gbm source.
