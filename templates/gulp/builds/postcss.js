/**
 * config for sass/scss builds
 *
 */

import gbmCofig from '../gbmConfig';
import upath from 'upath';

const srcRoot = gbmCofig.srcRoot;
const destRoot = gbmCofig.destRoot;

export default module.exports = [
  {
    buildName: 'postcss',
    builder: 'GPostCSSBuilder',
    src: [upath.join(srcRoot, 'postcss/**/*.pcss')],
    dest: upath.join(destRoot, 'css'),
    buildOptions: {
      enableLint: false,
      postcss:{
        plugins: [
            require('postcss-cssnext'),
            require('postcss-utilities'),
        ]
      }
    },
    moduleOptions: {},
    watch: {livereload:true}
  },
];
