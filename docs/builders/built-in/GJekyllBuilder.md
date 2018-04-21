---
layout: docs
---

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
  - *Important*: If you have any dependencies in jekyll project, such as scss or scripts, then be sure to add flushStream option to them so that all the output files are ready before jekyll compiler starts. See [here]({{site.repo}}/tree/master/docs/gulpfile.js) for an example

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
  - See [docs build configuration]({{site.srcurl}}/docs/gulpfile.js){:target="_blank"} for more details.

