/**
 * config for images builds
 *
 */

import gbmConfig from '../gbmconfig';
import upath from 'upath';

const srcRoot = gbmConfig.srcRoot;
const destRoot = gbmConfig.destRoot;

export default module.exports = [
  {
    buildName: 'images',
    builder: 'GImagesBuilder',
    src: [upath.join(srcRoot, 'images/**/*')],
    dest: upath.join(destRoot, 'images'),
    buildOptions: {},
    moduleOptions: {}
  }
];
