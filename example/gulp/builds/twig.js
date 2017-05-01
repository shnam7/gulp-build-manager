/**
 * config for markdown builds
 *
 */

import gbmConfig from '../gbmconfig';
import upath from 'upath';
import twigMarkdown from 'twig-markdown';

const srcRoot = gbmConfig.srcRoot;
const destRoot = gbmConfig.destRoot;


export default module.exports = [
  {
    buildName: 'twig',
    builder: 'GTwigBuilder',

    src: [upath.join(srcRoot, 'docs/twig/*.twig')],
    dest: upath.join(destRoot, 'docs/twig-test'),
    buildOptions: {},
    moduleOptions: {
      twig: {
        base: upath.join(srcRoot, 'docs/twig'),
        data: {
          site: {
            name: 'Gulp Build Manager Test',
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
      }
    },
    watch: {livereload:true}
  },
];
