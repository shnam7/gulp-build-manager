/**
 *  Configuration for GulpBuildManager
 */

'use strict';
import buildSet from '../../src/buildset';
import path from 'path';

const srcRoot = 'assets';
const destRoot = '_build';

const gbmConfig = {
  srcRoot: srcRoot,
  destRoot: destRoot,
  customBuilderDir: './custom-builders',

  builds: [
    './builds/sass',
    './builds/coffeescript',
    './builds/typescript',
    './builds/javascript',
    './builds/markdown',
    './builds/panini',
    './builds/twig',
    './builds/images',
    './builds/copy',
    './builds/custom',
    './builds/zip',
  ],

  systemBuilds: {
    // system task: '@clean'
    clean: [
      destRoot,
      '_dist',
      'css',
      'js',
      'images',
      path.join(srcRoot, 'scripts/{coffee,ts}/*.{js,js.map}'),
      path.join(srcRoot, 'assets/languages/*.mo')
    ],

    // system task: '@build'
    build: buildSet(
      'sass',
      ['coffeescript', 'javascript'],
      'markdown', 'panini', 'twig', 'images', 'copy', 'custom'
    ),

    watch: true,

    // default task
    default: ['@clean', '@build'],

  },

  moduleOptions: {
    gulp: {},
    livereload: {}
  },
};

module.exports = gbmConfig;
export default gbmConfig;
