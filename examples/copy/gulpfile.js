// Sample

const gbm = require('../../lib');

// const upath = require('upath');

process.chdir(__dirname);

const copy = {
  buildName: 'copy',
  builder: 'GBuilder',
  plugins: [
    new gbm.CopyPlugin([
      {src: ['path-src1/**/*.*'], dest:'path-dest1'},
      {src: ['path-src2/**/*.*'], dest:'path-dest2'}
    ])
  ]
  // src: [upath.join(destRoot, 'do-not-delete/sample.txt')],
  // dest: destRoot
};

// create gbmConfig object
gbm({
  systemBuilds: {
    build: [copy],
    clean: ['path-dest*'],
    default: ['@clean', '@build']
  }
});
