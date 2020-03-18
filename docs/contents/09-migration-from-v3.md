---
layout: docs
title: Migration from v3
---

# Migration from v3

### gbm main function
In v4, gbm() function is not supported. Instead, gbm is available as an instance of GBuildManager class.
To resolve build configurations, createProject() with build configurations, and add additional managing build configuratiopns with addTrigger(), addBuildItem(), addWatcher(), addCleaner(), and then finally call resolve().
resolve() actually analyze build configurations registered and creates gulp task tree based on it.

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
gbm.project({scss, scripts, twig})
    .addTrigger('@build', /.*/, {sync: true})   // sync option determins series or parallel(default)
    .addTrigger('default', '@build')
    .addWatcher('@watch', { browserSync: { server: upath.resolve(destRoot) } })
    .addCleaner('@clean', { clean: ['_build'] })
    .resolve()
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
Built-in builders available in gbm.xxx now moved to gbm.builders.xxx. Built-in plugins available in gbm.xxx now moved to gbm.plugins.xxx.

v3 example
```js
class MyClass extends gbm.GBuilder {
};

class MyPlugin extends gbm.GPlugin {
};
```

v4 conversion
```js
class MyClass extends gbm.builders.GBuilder {
};

class MyPlugin extends gbm.plugins.GPlugin {
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
- gbm.GPlugin.uglify --> rtb.uglify()
- gbm.GPlugin.cleanCss --> rtb.cleanCss()
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
Use rtb.exec() instead.

v3 example
```js
const cmd1 = {
    buildName: 'external-command1',
    builder: new gbm.GBuilder({ command: 'dir', args: ['.'] }),
};
```

v4 conversion
```js
cmd1: {
    buildName: 'command1',
    builder: rtb => rtb.exec({ command: 'dir', args: ['.'] }),
}
```


### BuildConfig.watch,  options
In v4, BuildConfig.watch should be striing | string[], not object. BuildConfig.watch.watchedPlus changed to BuildConfig.addWatch. No reloader options, such as livereload or browserSync, are accepted because these are now supported by GBuildProject, and can be configured using GBuildProject.addWatcher().

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


### Sequenced triggering in GBMConfig.sysBuilds
To create systemBuilds entries with complex sequence options with mixied gbm.series() or gbm.parallel in v4, use gbm.addBuildItem().

v3 example
```js
gbm({
    systemBuilds: {
        build: [gbm.parallel(copy, images), zip],
    }
});
```

v4 conversion
```js
gbm.createProject()
    .addBuildItem({
        buildName: '@build',
        dependencies: [gbm.parallel(copy, images), zip],
    })
});
```

For single series or parallel options, ProjectOptions.sync can be used. Default sequence option is parallel (sync:false).
```js
gbm.createProject()
    .addTrigger('@build', [copy.buildName, images.buildName], {sync: true}),
    })
});
```


### Resource
For more examples, look into the gbmconfig.js files in **[examples](../../examples)** directory of gbm source.
