---
layout: docs
---
# Function Builders

To create a simple gulp tasks, you can use functions to simplify the whole process.

## Function as a builder in build configuration
A function can be assigned to builder property in build configuration.<br>
Let's see an example: 
```javascript
const gbm = require('gulp-build-manager');

const simpleTask = {
  buildName: 'simpleTask',
  builder: (mopts, conf, done)=>{
    console.log('simpleTask executed');
    done(); // signal end of task
  }
};

gbm({
  builds: simpleTask
});
```
The function here can have three parameters:
  - mopts: default module options (gbm.defaultModuleOptions) 
  - conf: build configuration itself
  - done: gulp task done function


## Function as an independent Builder
Function can be used as a builder itself that can be used as part of BuildSet task dependencies. In this case, an unnamed gulp task will be created.<br>
Let's see an example:
```javascript
const gbm = require('gulp-build-manager');

function myTask(done) {
  console.log('Hello, Gulp Build Manager!');
  done(); // signal the end of task
}

gbm({
  systemBuilds: {
      build: myTask
    },
});
```
With this configuration, myTask cannot be created as an independent task because it has no name. However, it can be added to @build task. Actually, it can be used in any places that BuildSet can be placed.
