'use strict';

const gbm = require('../../lib');
const gulp = require('gulp');
const upath = require('upath');

const projectName = upath.basename(__dirname);
const prefix = projectName + ':';


//--- build item type #1: BuildConfig items
const build1 = {
    buildName: 'build1'
};

const build2 = {
    buildName: 'build2'
};

//--- build item type #2: native gulp task function
function build3(done) { console.log('build3:: Hello, Gulp Build Manager!'); done(); }

//--- build item type #3: existing gulp task
gulp.task(prefix + 'build4', (done) => done()); // this task will be created first


//--- buildset: combination of single item, series, parallel
const set01 = [prefix+build1.buildName];
const set02 = [prefix+build1.buildName, prefix+build2.buildName, build3, prefix+'build4']; // series
const set03 = gbm.series(prefix+build1.buildName, prefix+build2.buildName);         // same as set02
const set04 = gbm.parallel(prefix+build1.buildName, prefix+build2.buildName);
const set05 = prefix + 'build1';
const set06 = [prefix+build1.buildName, prefix+build2.buildName];

const exConfig = {
    build1, build2,

    simpleTask: {
        buildName: 'simple-builds',
        builder: () => {
            console.log('simpleTask executed');
        },
        preBuild: rtb => console.log(`preBuild called, customVar1=${rtb.conf.customVar1}`),
        postBuild: {
            func: (builder, arg1, arg2) => console.log(`postBuild called,`
                + `customVar1=${builder.conf.customVar2}, arg1=${arg1}, arg2=${arg2}`),
            args: ['arg1', 'arg2']
        },

        // buildSet can be of type GulpTaskFunction, not normal function.
        // so, gulp.serial() or gulp.parallel() is required
        triggers: gbm.parallel((done) => {
            console.log(this.buildName, `: trigger successful.`);
            done();
        }),

        customVar1: 'customer variable#1',
        customVar2: 'customer variable#2'
    },

    buildSetTest: {
        buildName: 'buildset-test',
        builder: (rtb) => console.log('This is the main task: buildSetTest\n'),
        dependencies: gbm.parallel(set01, set02, set03, set04, set05, set06)
    },
};

module.exports = gbm.createProject(exConfig, {prefix})
    .addTrigger('@build', gbm.buildNamesOf(exConfig))
