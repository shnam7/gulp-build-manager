'use strict';

const gbm = require('../../lib');
const gulp = require('gulp');

// set base directory to project root
process.chdir('../../');

const simpleTask = {
    buildName: 'simpleTask',
    builder: () => {
        console.log('simpleTask executed');
    },
    pretBuild: (builder) => console.log(`preBuild called, customVar1=${builder.conf.customVar1}`),
    postBuild: {
        func: (builder, arg1, arg2) => console.log(`postBuild called,`
            + `customVar1=${builder.conf.customVar2}, arg1=${arg1}, arg2=${arg2}`),
        args: ['arg1', 'arg2']
    },
    triggers: gbm.parallel((done) => {
        console.log(`trigger successful. buildName`);
        done();
    }),

    customVar1: 'customer variable#1',
    customVar2: 'customer variable#2'
};


const task1 = {
    buildName: 'task1'
};

const task2 = {
    buildName: 'task2'
};

function task3(done) {
    console.log('task3:: Hello, Gulp Build Manager!');
    done();
}

gulp.task('task4', (done) => done()); // this task will be created first

// BuildSet examples
const set01 = [task1];
const set02 = [task1, task2, task3, 'task4']; // series
const set03 = gbm.series('task1', 'task2'); // same as set02
const set04 = gbm.parallel('task1', 'task2');
const set05 = 'task1';
const set06 = ['task1', 'task2'];
const set07 = gbm.series(task1, task2, task3); // same as set02
const set08 = gbm.parallel(task1, task2);
const set09 = gbm.parallel(
    [set01, set02, gbm.parallel(set03, set04)], // series
    set05,
    task3,
    'task4',
    (done) => done()
);

const buildSetTest = {
    buildName: 'buildSetTest',
    builder: (builder) => {
        console.log('This is the main task: buildSetTest\n');
    },
    dependencies: gbm.parallel(set01, set02, set03, set04, set05, set06, set07, set08, set09)
};

gbm({
    systemBuilds: {
        build: [simpleTask, buildSetTest],
        clean: ["__dummy"], // dummy to create '@close' task to make main gulpfile not to fail with error
        default: ['@build']
    }
});
