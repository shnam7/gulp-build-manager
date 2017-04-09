/**
 * config for sass/scss builds
 *
 */

import gbmCofig from '../gbmconfig';
import path from 'path';

const srcRoot = gbmCofig.srcRoot;
const destRoot = gbmCofig.destRoot;

export default module.exports = [
  {
    buildName: 'sass',
    builder: 'GSassBuilder',
    src: [
      path.join(srcRoot, 'scss/**/*.scss'),
      path.join(srcRoot, 'sass/**/*.sass')
    ],
    dest: path.join(destRoot, 'css'),
    buildOptions: {
      enableLint: false
    },
    moduleOptions: {
      sass: {
        includePaths: [
          // 'bower_components/compass-mixins/lib',
          'bower_components/gridle/sass',
          'bower_components/uikit/scss',
          'bower_components',
          'd:/web/lib/wcl/assets/scss',
          'assets/scss'
        ]
      }
    },
    watch: {
      livereload: true
    }
  },
];
