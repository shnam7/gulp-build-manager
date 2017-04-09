/**
 * config for copy builds
 *
 */

import gbmConfig from '../gbmconfig';
import upath from 'upath';

const srcRoot = gbmConfig.srcRoot;
const destRoot = gbmConfig.destRoot;

export default module.exports = [
  {
    buildName: 'copy',
    builder: 'GBuilder',      // GBuilder is basically copies src to dest
    src: [upath.join(srcRoot, 'copy-test/**/*.*')],
    dest: upath.join(destRoot, 'copy-test'),
    buildOptions: {},
    moduleOptions: {}
  }
];
