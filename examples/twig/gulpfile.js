// Sample

const gbm = require('../../lib');
const upath = require('upath');

// set base directory to project root
process.chdir('../../');
const conf = require('./gbmconfig');

// build manager
gbm({
  systemBuilds: {
    build: conf.build,
    clean: conf.cleanList,
    default: '@build',
    watch: {browserSync:{server:'./examples/twig/_build'}}
  }
});
