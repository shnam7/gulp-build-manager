// Sample

const gbm = require('../../lib');
const upath = require('upath');
const twigMarkdown = require('twig-markdown');

// set base directory to project root
process.chdir('../../');
const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, '_build');

// build configuration
const twig = {
  buildName: 'twig',
  builder: 'GTwigBuilder',

  src: [upath.join(srcRoot, 'twig/*.twig')],
  dest: upath.join(destRoot, ''),
  buildOptions: {
    minify: true,
    prettify: true
  },
  moduleOptions: {
    twig: {
      base: upath.join(srcRoot, 'twig'),
      data: {
        site: {
          name: 'Gulp Build Manager Sample - Twig',
          charset: 'UTF-8',
          url:'.'
        }
      },
      extend: twigMarkdown,
      functions:[
        {
          name: "nameOfFunction",
          func: function (args) {
            return "the function";
          }
        }
      ],
      filters:[
        {
          name: "nameOfFilter",
          func: function (args) {
            return "the filter";
          }
        }
      ]
    },
    htmlPrettify: {indent_char: ' ', indent_size: 2},
    htmlmin: {
      collapseWhitespace: true,
    }
  },
  watch: {
    // include sub directories to detect changes of the file which are not in src list.
    watched: [upath.join(srcRoot, 'twig/**/*.{twig,md}')],
    livereload:true
  }
};


// build manager
gbm({
  systemBuilds: {
    build: twig,
    clean: [destRoot],
    default: '@build',
    watch: {livereload:{start:true}}
  }
});
