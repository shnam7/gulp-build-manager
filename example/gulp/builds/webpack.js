/**
 * config for typescript builds
 *
 */

import gbmConfig from '../gbmconfig';
import upath from 'upath';

const srcRoot = gbmConfig.srcRoot;
const destRoot = gbmConfig.destRoot;

export default module.exports = [
  {
    buildName: 'webpack',
    builder: 'GWebPackBuilder',
    src: upath.join(destRoot, 'js/sample-ts.js'),
    dest: upath.join(destRoot, 'js/'),
    buildOptions: {
      webpack: './webpack.config.js'
    },
  },
];
