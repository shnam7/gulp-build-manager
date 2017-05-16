import gbmConfig from './gulp/gbmConfig';
import upath from 'upath';

module.exports = {
  entry: upath.resolve(gbmConfig.destRoot, 'js/sample-ts.js'),
  output: {
    filename: 'bundle.js',
    path: upath.resolve(gbmConfig.destRoot, 'js/')
  }
};