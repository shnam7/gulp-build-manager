// Sample

const gbm = require('../../lib');

process.chdir(__dirname);

class MyBuilder extends gbm.GBuilder {
  constructor() { super()}
  build() {
    console.log('MyBuilder loaded. default operation will be bypassed. Bye!');
  }
}

const customFunction = {
  buildName: 'customFunction',
  builder: (builder) => {
    console.log('Custom builder using function(): Hello!!!', builder.conf.buildName);
  }
};

const customBuilder = {
  buildName: 'customBuilder',
  builder: 'GCustomBuilder'
};

const myBuilder = {
  buildName: 'myBuilder',
  builder: new MyBuilder(),
};


// create gbmConfig object
gbm({
  customBuilderDir: './custom-builders',
  systemBuilds: {
    build: [customFunction, customBuilder, myBuilder],
    clean: [""],  // dummy to create '@close' task to make main gulpfile not to fail with error
    default: ['customFunction', 'customBuilder', 'myBuilder']
  }
});
