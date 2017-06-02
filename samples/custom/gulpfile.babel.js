'use strict';

// import gulp-build-manager
import gbm from 'gulp-build-manager';
process.chdir(__dirname);

let customFunction = {
  buildName: 'customFunction',
  builder: (defaultModuleOptions, conf, done) => {
    console.log('Custom builder using function(): Hello!!!', conf.buildName);
    done();
  }
};

let customBuilder = {
  buildName: 'customBuilder',
  builder: 'GCustomBuilder'
};


// create gbmConfig object
const gbmConfig = {
  customBuilderDir: './custom-builders',
  builds: [
    customFunction,
    customBuilder,
  ],

  systemBuilds: {
    default: ['customFunction', 'customBuilder']
  }
};

gbm.loadBuilders(gbmConfig);
