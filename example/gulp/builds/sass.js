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
    buildName: 'sass',
    builder: 'GSassBuilder',
    src: [
      upath.join(srcRoot, 'scss/**/*.scss'),
      upath.join(srcRoot, 'sass/**/*.sass')
    ],
    dest: upath.join(destRoot, 'css'),
    buildOptions: {
      enableLint: false,
      enablePostCSS: true,
      postcss: {
        plugins:[
          require('postcss-cssnext'),
          require('postcss-utilities'),
          require('lost'),
        ]
      }
    },
    moduleOptions: {
      sass: {
        includePaths: [
          'bower_components/uikit/scss',
          'bower_components',
          'd:/web/lib/wcl/assets/scss',
          'assets/scss'
        ]
      },
    },
    watch: {livereload: true}
  },
];
