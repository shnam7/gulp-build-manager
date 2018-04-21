// Sample

const gbm = require('../../lib');

process.chdir(__dirname);

const copy = {
  buildName: 'copy',
  builder: 'GCopyBuilder',
  src: ['path-src1/**/*.*'],
  dest:'path-dest1',
  flushStream: true,  // task to finish after all the files copies are finished
  buildOptions: {
    targets:[
      {src: ['path-src1/**/*.*'], dest:'path-dest2'},
      {src: ['path-src2/**/*.*'], dest:'path-dest3'}
    ],
  },
};

// create gbmConfig object
gbm({
  systemBuilds: {
    build: [copy],
    clean: ['path-dest*'],
    default: ['@clean', '@build']
  }
});
