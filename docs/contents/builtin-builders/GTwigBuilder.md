---
layout: docs
title: GTwigBuilder
---

# GTwigBuilder
Panini project builder.
See [twig](https://twig.symfony.com) to learn more about twig.


### Builder specific Options
  - *conf.buildOptions.minify* (<i>type:boolean, default:false</i>)<br>
    If set to true, output html files are minimized.

  - *conf.buildOptions.prettify* (<i>type:boolean, default:false</i>)<br>
    If set to true, output html files are prettified.


#### Notes
  - If both minify and prettify options are set, then minify is done first and it's prettified.



### Example
```js
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
        htmlBeautify: {indent_char: ' ', indent_size: 2},
        htmlmin: {
          collapseWhitespace: true,
        }
    },

    // include sub directories to detect changes of the file which are not in src list.
    watch: [upath.join(srcRoot, 'twig/**/*.{twig,md}')],
};
```
