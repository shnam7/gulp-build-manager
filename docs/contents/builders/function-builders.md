---
layout: docs
---
# Function Builders

To create a simple gulp tasks, you can use functions to simplify the whole process.

## Using function as a builder in build configuration
A function can be assigned to builder property in build configuration.
Let's see an example:
```javascript
const gbm = require('gulp-build-manager');

const simpleTask = {
  buildName: 'simpleTask',
  builder: (builder)=>{
    console.log(`simpleTask executed. buildName=${build.conf.buildName}`);
  }
};

gbm({
  builds: simpleTask
});
```

## Function as an independent Build task
Function can be used as a builder itself that can be used as part of BuildSet task dependencies. In this case, an unnamed gulp task will be created.
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
