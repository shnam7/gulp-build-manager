'use strict';

// import gulp-build-manager
import gbm from 'gulp-build-manager';
import buildSet from 'gulp-build-manager/lib/buildSet';
import upath from 'upath';

process.chdir(__dirname);

let srcRoot = 'assets';
let destRoot = '_build';

/**
 * Define build items
 */
let copyBuild = {
  buildName: 'copy',
  builder: 'GBuilder',
  src: upath.join(srcRoot, 'copy-me/**/*.txt'),
  dest: destRoot,
};

let imagesBuild = {
  buildName: 'images',
  builder: 'GImagesBuilder',
  src: upath.join(srcRoot, 'images/**/*'),
  dest: destRoot,
};

let zipBuild = {
  buildName: 'zip',
  builder: 'GZipBuilder',
  src: [
    upath.join(destRoot, '**/*'),
    upath.join(srcRoot, 'zip-me-too/**/*')
  ],
  dest: '_dist',
  outFile: 'primitives.zip',
  watch: {
    // disable watch by setting 'watched' list to empty array
    watched:[]
  }
};


/**
 * Create gbmConfig object
 */
const gbmConfig = {
  builds: [
    copyBuild,
    imagesBuild,
    zipBuild
  ],

  systemBuilds: {
    // 'copy' and 'images' will be executed in paralle, and then zip will be executed in series
    build: [buildSet('copy', 'images'), 'zip'],
    clean: [destRoot, '_dist'],
    default: ['@clean', '@build'],

    // if 'watch' property exists, watch task is created.
    // To enable livereload, uncomment below livereload option
    watch: {
      // livereload: {start:true}
    },
  }
};

gbm.loadBuilders(gbmConfig);
