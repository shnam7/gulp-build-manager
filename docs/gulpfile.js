/**
 *  Documentation for Gulp Build Manager
 *
 */

const gbm = require('../lib');
const upath = require('upath');

// set base directory to project root
process.chdir('../');

const docs = require('./gbmconfig');


gbm({
  systemBuilds: {
    build: docs.build,
    clean: docs.cleanList,
    default: ['@clean', '@build'],
    watch: {
      browserSync: {
        server: upath.resolve(docs.destRoot),
        port: 3000,
        open: true,
        // reloadDebounce: 500
      }
    }
  },
  // moduleOptions: {del: {force:true}}  // enable files outside of this project to be deleted
});