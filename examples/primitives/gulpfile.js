// Sample

const gbm = require('../../lib');
const upath = require('upath');

// set base directory to project root
process.chdir('../../');
const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, '_build');

/**
 * Define build items
 */
const copy = {
  buildName: 'copy',
  builder: 'GBuilder',
  src: upath.join(srcRoot, 'copy-me/**/*.txt'),
  dest: destRoot,
};

const images = {
  buildName: 'images',
  builder: 'GImagesBuilder',
  src: upath.join(srcRoot, 'images/**/*'),
  dest: destRoot,
};

const zip = {
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
  systemBuilds: {
    build: [gbm.parallel(copy, images), zip],
    clean: [destRoot, '_dist'],
    default: ['@clean', '@build'],

    // if 'watch' property exists, watch task is created.
    // To enable livereload, uncomment below livereload option
    watch: {
      // livereload: {start:true}
    },
  }
});
