---
layout: docs
---
{% assign srcurl = site.repo | append: '/tree/master' %}

# GJekyllBuilder
Jekyll project builder. Internally, it creates child process to run jekyll command.<br>
To learn more about Jekyll, visit [Jekyll website](https://jekyllrb.com/){:target='_blank'}.

#### Builder specific Options
  - *conf.src* (<i>type:string, default:undefined</i>)<br>
    If this is set to a directory path, it will be used to override default jekyll source directory.
  - *conf.dest* (<i>type:string, default:undefined</i>)<br>
    If this is set to a directory path, it will be used to override default jekyll desitination directory.

#### Notes
  - *conf.flushStream* (<i>type:boolean, default:false</i>)<br>
    If this is set to true, build task will not finish until external jekyll command finishes.

#### Example
```javascript
const jkDest = '../_gh_pages';

const jekyll = {
  buildName: 'jekyll',
  builder: 'GJekyllBuilder',
  src: '.',
  dest: jkDest,
  moduleOptions: {
    jekyll: {
      command: 'build',
      options: [
        '--incremental',
        '--baseurl /gulp-build-manager/_gh_pages'
      ]
    }
  },
  watch: { watched: ['**/*', '!.jekyll-metadata', '!assets/**/*', '!gulpfile.*'], livereload:true },
  clean: [jkDest, '.jekyll-metadata'],
};
```

#### Resources
  - This document site was built with GJekyllBuilder and CCSSBuilder.
  - See [docs build configuration]({{srcurl}}/docs/gulpfile.js){:target="_blank"} for more details.

