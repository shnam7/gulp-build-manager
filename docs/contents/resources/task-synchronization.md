---
layout: docs
---

# Task Synchronization

### Why task synchronization is required?
When writing custom builders or plugins, returning input stream is one of basic methods signaling the end of task. see [gulp API](https://gulpjs.com/docs/en/api/concepts){:target='_blank'} documentation on this.

However, there are cases that builders or plugins do not follow the normal stream flow. One example is writing output files, in which case gulp task can be signaled to finish from the returned stream while file writing is still in progress. This can be Ok generally, but sometimes can be a problem if the next build actions requires the output from the previous build actions.

 This is why the [conf.flushStream](/{{site.contentsurl}}/builders/using-builders#flushStream) option is provided in build configuration.

In some other cases, you may not create any input stream. For example, builders or plugins may create child process executing external commands just like GJekyllBuilder. In this case, the builder or plugin may need to wait until the child process is finished.


### How to resolve?
#### Using flushStream options
If build configurations specifies flushStream property to true, then the main build stream is finished before the build process ends. In the example below, the coffeeScript task confirms output file creation before it ends.
```javascript
const coffeeScript = {
  buildName: 'coffeeScript',
  builder: 'GCoffeeScriptBuilder',
  src: [upath.join(srcRoot, 'coffee/**/*.coffee')],
  dest: (file) => file.base,
  flushStream: true
};
```

#### Using Promise
All the builders and plugins can return a Promise. If Promise is returned, it is guranteed to be finished brfore next build actions.
```javascript
const gbm = require('../../lib');
const wait = require('../../lib/utils/utils').wait;

const buildItem1 = {
  buildName: 'task1',
  builder: (builder)=>{
    console.log('test1 executed - this will take 3 seconds to finish.');
    return new Promise(resolve=>setTimeout(()=>resolve(), 3000));
  },
  preBuild: ()=>{console.log('preBuild called. It will take 2 seconds.'); return wait(2000)},
  postBuild: ()=>console.log('postBuild called')
};
```
In this example, preBuild function will take 2 seconds before starting build process. wait() is a utility function returing a timeout promise.


### Resources
To learn more on task synchronization, refer to the source codes and examples.
