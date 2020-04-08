'use strict';

const gbm = require('../../lib');
const gulp = require('gulp');
const upath = require('upath');

const projectName = upath.basename(__dirname);
const prefix = projectName + ':';


//--- build item type #1: BuildConfig items
const build1 = { buildName: 'build1' };
const build2 = { buildName: 'build2' };

//--- build item type #2: native gulp task function
function gulpTaskFunc(done) { console.log('gulpTaskFunc: Hello, Gulp Build Manager!'); done(); }

//--- build item type #3: existing gulp task
gulp.task(prefix + 'nativeGulpTask', (done) => done()); // this task will be created first


//--- buildset: combination of single item, series, parallel
const set01 = [prefix+build1.buildName];
const set02 = [prefix+build1.buildName, prefix+build2.buildName, gulpTaskFunc, prefix+'nativeGulpTask']; // series
const set03 = gbm.parallel(prefix+build1.buildName, prefix+build2.buildName);
const set04 = gbm.series(prefix+build1.buildName, prefix+build2.buildName);
const set05 = [prefix+build1.buildName, prefix+build2.buildName];   // serial set, the same as set04
const set06 = prefix + 'build1';

const simpleTask = {
    buildName: 'simple-build',
    builder: (rtb) => console.log(rtb.buildName + ' executed'),
    preBuild: rtb => console.log(rtb.buildName + `:preBuild called, customVar1=${rtb.conf.customVar1}`),
    postBuild: {
        func: (rtb, arg1, arg2) => console.log(rtb.buildName +`:postBuild called,`
            + `customVar1=${rtb.conf.customVar2}, arg1=${arg1}, arg2=${arg2}`),
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
}


//--- external commands
const cmd1 = {
    buildName: 'cmd1',
    builder: rtb => rtb.exec({ command: 'dir', args: ['.'] }),
    flushStream: true
}

const cmd2 = {
    buildName: 'cmd2',
    builder: {
        command: 'node',
        args: ['-v'],
        options: { shell: false }
    },
    flushStream: true
}

const main = {
    buildName: '@build',
    builder: (rtb) => console.log(rtb.buildName + ' is running'),
    dependencies: gbm.parallel(set01, set02, set03, set04, set05, set06),
    triggers: [prefix+cmd1.buildName, prefix+cmd2.buildName]  // run in series
}

module.exports = gbm.createProject({build1, build2, simpleTask, cmd1, cmd2, main}, {prefix})
