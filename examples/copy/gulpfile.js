// Sample

const gbm = require('../../lib');

process.chdir(__dirname);

const copy = {
  buildName: 'copy',
  builder: 'GBuilder',
  flushStream: true,
  plugins: [
    new gbm.CopyPlugin([
      {src: ['path-src1/**/*.*'], dest:'path-dest1'},
      {src: ['path-src2/**/*.*'], dest:'path-dest2'}
    ])
  ]
};

// create gbmConfig object
gbm({
  systemBuilds: {
    build: [copy],
    clean: ['path-dest*'],
    default: ['@clean', '@build']
  }
});
