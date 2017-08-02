'use strict';

import gbm from '../../src';
import gulp from 'gulp';

process.chdir(__dirname);

const simpleTask = {
  buildName: 'simpleTask',
  builder: (conf, mopts, done)=>{
    console.log('simpleTask executed');
    done(); // signal end of task
  },

  triggers: gbm.parallel((done)=>{
    console.log('trigger successful.'); done();
  })
};


const task1 = {
  buildName: 'task1'
};

const task2 = {
  buildName: 'task2'
};

function task3(done) {
  console.log('Hello, Gulp Build Manager!');
  done();
}

gulp.task('task4', (done)=>done()); // this task will be created first

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
  [set01, set02, gbm.parallel(set03,set04)],  // series
  set05,
  task3,
  'task4',
  (done)=>done()
);

const buildSetTest = {
  buildName: 'buildSetTest',
  dependencies: gbm.parallel(set01, set02, set03, set04, set05, set06, set07, set08, set09)
};

gbm({
  // builds: [simpleTask, buildSetTest],
  systemBuilds: {
    build: task3
  },
});

// gbm({
//   systemBuilds: {
//     build: simpleTask,
//     default: 'simpleTask'
//   }
// });
