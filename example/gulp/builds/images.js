/**
 * config for images builds
 *
 */

import gbmConfig from '../gbmconfig';
import path from 'path';

const srcRoot = gbmConfig.srcRoot;
const destRoot = gbmConfig.destRoot;

export default module.exports = [
  {
    buildName: 'images',
    builder: 'GImagesBuilder',
    src: [path.join(srcRoot, 'images/**/*')],
    dest: path.join(destRoot, 'images'),
    buildOptions: {},
    moduleOptions: {}
  }
];
