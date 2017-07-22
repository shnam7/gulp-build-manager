// Sample

import gbm from '../../src';
import upath from 'upath';

process.chdir(__dirname);

const parallel = gbm.parallel;
const srcRoot = 'assets';
const destRoot = '_build';

/**
 * Define build items
 */
const copyBuild = {
  buildName: 'copy',
  builder: 'GBuilder',
  src: upath.join(srcRoot, 'copy-me/**/*.txt'),
  dest: destRoot,
};

const imagesBuild = {
  buildName: 'images',
  builder: 'GImagesBuilder',
  src: upath.join(srcRoot, 'images/**/*'),
  dest: destRoot,
};

const zipBuild = {
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
gbm({
  builds: [
    copyBuild,
    imagesBuild,
    zipBuild
  ],

  systemBuilds: {
    // 'copy' and 'images' will be executed in paralle, and then zip will be executed in series
    build: [parallel('copy', 'images'), 'zip'],
    clean: [destRoot, '_dist'],
    default: ['@clean', '@build'],

    // if 'watch' property exists, watch task is created.
    // To enable livereload, uncomment below livereload option
    watch: {
      // livereload: {start:true}
    },
  }
});
