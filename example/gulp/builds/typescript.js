/**
 * config for typescript builds
 *
 */

import gbmConfig from '../gbmconfig';
import path from 'path';

const srcRoot = gbmConfig.srcRoot;

export default module.exports = [
  {
    buildName: 'typescript',
    builder: 'GTypeScriptBuilder',
    src: [path.join(srcRoot, 'scripts/ts/**/*.ts')],
    dest: (file)=>file.base,
    buildOptions: {
      enableLint: false
    },
    moduleOptions: {}
  },
];
