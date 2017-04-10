/**
 * config for sass/scss builds
 *
 */

import gbmCofig from '../gbmconfig';
import upath from 'upath';

const srcRoot = gbmCofig.srcRoot;
const destRoot = gbmCofig.destRoot;

export default module.exports = [
  {
    buildName: 'postcss',
    builder: 'GPostCSSBuilder',
    src: [upath.join(srcRoot, 'postcss/**/*.css')],
    dest: upath.join(destRoot, 'css'),
    buildOptions: {
      enableLint: false
    },
    moduleOptions: {}
  },
];
