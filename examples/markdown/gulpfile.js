'use strict';

const gbm = require('../../lib');
const upath = require('upath');

// set base directory to project root
process.chdir('../../');
const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, '_build');

const markdown = {
  buildName: 'markdown',
  builder: 'GMarkdownBuilder',
  src: [upath.join(srcRoot, '**/*.md')],
  dest: upath.join(destRoot, ''),
  buildOptions: {},
  moduleOptions: {},
  watch: {livereload:true}
};

// create gbmConfig object
gbm({
  systemBuilds: {
    build: [markdown],
    clean: [destRoot],
    default: 'markdown',
    // watch: {livereload:{start:true}},
    watch: {browserSync:{server: upath.resolve(destRoot)}}
  }
});
