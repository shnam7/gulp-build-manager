---
layout: docs
---
{% assign srcurl = site.repo | append: '/tree/master/src' %}

# Task Synchronization

### Why task synchronization is required?
When writing custom builders or plugins, returning input stream is one of basic methods signaling the end of task. see [gulp API](https://github.com/gulpjs/gulp/blob/4.0/docs/API.md){:target='_blank'} documentation on this.<br>

However, there are some cases that your builders or plugins are not following the stream flow. One example is writing output files, in which case gulp task can be signaled to be finished from the returned stream while file writing is still in progress. This can be Ok generally, but sometimes can be a problem. This is why the [conf.flushStream]({{site.baseurl}}/builders/using-builders#flushStream) option is provided in build configuration.

In some other cases, you may not create any input stream. For example, builders or plugins may create child process executing external commands just like GJekyllBuilder. In this case, the builder or plugin may need to wait until the child process is finished. 
 

### How to resolve?
GBuilder provides *promise* property which collects all the promises generated during the build process. At the end of the build process, it waits for all these promises to be finished and then signals the end of task. Let see examples from source codes:<br>

#### a snippet from [GBuilder]({{srcurl}}/builders/GBuilder.js){:target='_blank'}:
```javascript
if (conf.flushStream)
  this.promise.push(new Promise((resolve, reject)=>{
    stream.pipe(gulp.dest(path||conf.dest, opts.dest))
      .on('end', resolve)
      .on('error', reject);
  }));
else
  return stream.pipe(gulp.dest(path||conf.dest, opts.dest));
```

#### a snippet from [GJekyllBuilder]({{srcurl}}/builders/GJekyllBuilder.js){:target='_blank'}:
```javascript
if (conf.flushStream) {
      this.promise.push(new Promise((resolve, reject)=>{
        jekyll.on('close', (code)=>{
          if (conf.watch && conf.watch.livereload) require('gulp-livereload').changed(conf.src || '.');
          console.log(`Jekyll process finished(exit code:${code})`);
          resolve();
        });
      }));
    }
    else {
      jekyll.on('close', (code)=>{
        if (conf.watch && conf.watch.livereload) require('gulp-livereload').changed(conf.src || '.');
        console.log(`Jekyll process finished(exit code:${code})`);
      });
    }
```
