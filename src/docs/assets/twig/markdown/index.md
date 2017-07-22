Gulp Build Manager(gbm) is a tool enabling gulp task to be created and customized easily with simple configuration. This provides the convenience of configuration and flexibility of javascript programming in setting up gulp tasks.

<a name="Installation"></a>
# Installation
By default, Gulp Build Manager is using gulp 4.x with javascript es6/babel support. When you install it by following the commands below, the core dependent modules including gulp 4.x and babel will be automatically installed.
```bash
npm install gulp-build-manager --save-dev
```

After installation, be sure to have <em>.babelrc</em> file in the project root directory with the contents below at minimum, which enables es6 in babel.
```json
{ "presets": ["es2015"] }
```

<a name="QuickStart"></a>
# Quick Start
To get started, just create <em>'gulpfile.babel.js'</em>, instead of <em>'gulpfile.js'</em>, which will enable es6/babel support automatically. Within this file, creating gulp task is very simple. Just creat a "Build Configuration Object" and register it to "gbmConfig" which is to be loaded by "loadBuilders()" function of gulp build manager. The only mandatory property of Build Configuration Bbject is "buildName", but to do something meaningful work, "builder" property also need to be set with proper builder function or a valid build class name. Let's see an example.
```javascript
import gbm from 'gulp-build-manager';

const simpleTask = {
  buildName: 'simpleTask',
  builder: (conf, mopts, done)=>{
    console.log('simpleTask executed');
    done(); // signal end of task
  },
};

const gbmConfig = {
  builds: [ simpleTask ],
};

gbm.loadBuilders(gbmConfig);
```


Here's another example using a builder class. "src" and "dest" are properties of build configuration and required by GBuilder class object. For the details on GBuilder or builder classes, please refer to [System Builders](./builder-classes.html#system-builders)
```javascript
import gbm from 'gulp-build-manager';

const copyTask = {
  buildName: 'simpleTask',
  builder: GBuilder;
  src: './static/**/*.*';
  dest: '../dest/static';
};

const gbmConfig = {
  builds: [ copyTask ],
};

gbm.loadBuilders(gbmConfig);
```

To see working examples and learn how to use various features of Gulp Build Manager, please refer to the [samples](https://github.com/shnam7/gulp-build-manager/tree/master/samples) in GitHub.


# License
This work is licensed under MIT license.