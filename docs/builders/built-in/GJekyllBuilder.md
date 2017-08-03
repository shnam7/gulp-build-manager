---
layout: docs
---

# GJekyllBuilder
Jekyll project builder. Internally, it creates child process to run jekyll command.

#### Builder specific Options
  - <em>conf.src</em> (<i>type:string, default:undefined</i>)<br>
    If this is set to a directory path, it will be used to override default jekyll source directory.
  - <em>conf.dest</em> (<i>type:string, default:undefined</i>)<br>
    If this is set to a directory path, it will be used to override default jekyll desitination directory.


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
  - This documents was built with GJekyllBuilder and CCSSBuilder.
  - See [docs]({{site.repo}}/docs) for more details.

