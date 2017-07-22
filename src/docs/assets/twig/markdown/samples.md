# Samples
In GitHub source code, you can find [samples](https://github.com/shnam7/gulp-build-manager/tree/master/samples) directory which contains various working examples.
Not all the gulp plugin modules that are required for the samples are installed by default. So, when you initiate the build process with 'gulp' command, you can see some error messages requiring to install the missing modules. Then, just do it with following command:
```bash
npm i <module-name> --save-dev
```

#### Building Samples projects
Those sample programs are tested as part of Gulp Build Manager source codes. So, in the <em>gulpfile.babel.js</em> file of each samples, 'gulp-build-manager' is imported with relative path of '../../src'. If you want to compile each samples as separate source, then you need to change this to import 'gulp-build-manager', and then need to add '.babelrc' file as noted in the [Installation](./index.html#Installation) section. Here's sample how change the 'gulpfile.babel.js'.

##### Sample code as part of gbm source codes (default)
```javascript
import gbm from '../../src';
import GPlugins from '../../src/core/GPlugins';

// ...
```
Here, .babelrc file and all the gulp plugin modules installed in root of source codes will be shared.

##### Sample code as independent project
```javascript
import gbm from 'gulp-build-manager';
import GPlugins from 'gulp-build-manager/core/GPlugins';

// ...
```
Here, '.babelrc' file is required and each each sample projects will  their own npm modules.