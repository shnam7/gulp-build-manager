/**
 * config for copy builds
 *
 */

import gbmConfig from '../gbmconfig';
import path from 'path';

const srcRoot = gbmConfig.srcRoot;
const destRoot = gbmConfig.destRoot;

export default module.exports = [
  {
    buildName: 'copy',
    builder: 'GBuilder',      // GBuilder is basically copies src to dest
    src: [path.join(srcRoot, 'copy-test/**/*.*')],
    dest: path.join(destRoot, 'copy-test'),
    buildOptions: {},
    moduleOptions: {}
  }
];
