/**
 *  Configuration for GulpBuildManager
 */

'use strict';
import buildSet from 'gulp-build-manager/lib/buildSet';
import upath from 'upath';

const srcRoot = 'assets';
const destRoot = '_build';

const gbmConfig = {
  srcRoot: srcRoot,
  destRoot: destRoot,
  customBuilderDir: './custom-builders',

  // uncomment required items
  builds: [
    // './builds/sass',
    // './builds/postcss',
    // './builds/coffeescript',
    // './builds/typescript',
    // './builds/javascript',
    // './builds/markdown',
    // './builds/panini',
    // './builds/twig',
    // './builds/images',
    './builds/copy',
    './builds/custom',
    // './builds/zip',
  ],

  systemBuilds: {
    // system task: '@clean'
    clean: [
      destRoot,
      '_dist',
      upath.join(srcRoot, 'scripts/{coffee,ts}/*.{js,js.map}'),
      upath.join(srcRoot, 'assets/languages/*.mo')
    ],

    // system task: '@build'
    build: buildSet(
      // 'sass', 'postcss',
      // ['coffeescript', 'javascript'],
      // 'markdown', 'panini', 'twig', 'images',
      'copy', 'custom'
    ),
    // system task: '@watch' with livereload options
    watch: {
      livereload: {start:true}
    },

    // default task
    default: ['@clean', '@build'],
  },
};

module.exports = gbmConfig;
export default gbmConfig;
