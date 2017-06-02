'use strict';

// import gulp-build-manager
import gbm from 'gulp-build-manager';
process.chdir(__dirname);

let simpleTask = {
  buildName: 'simpleTask',
  builder: (conf, mopts, done)=>{
    console.log('simpleTask executed');
    done(); // signal end of task
  }
};

// create gbmConfig object
const gbmConfig = {
  builds: [
    simpleTask
  ],

  systemBuilds: {
    default: 'simpleTask'
  }
};

gbm.loadBuilders(gbmConfig);
