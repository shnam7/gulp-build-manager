---
layout: docs
title: Getting started
---
# {{page.title}}

#### 1. Install Gulp Build Manager(gbm in short):
```sh
npm install gulpjs/gulp#4.0 --save-dev
npm install gulp-build-manager --save-dev
# or 
yarn add gulpjs/gulp#4.0 --dev
yarn add gulp-build-manager --dev
```

#### 2. Create gulpfile at the root of your project:
Please be sure to have some javascript files in the assets/scripts/js directory to see the build process working.
In case you have error messages such as <i>'Cannot find module ...'</i>, then install the required modules using npm or yarn command.
```javascript
const gbm = require('gulp-build-manager');

const javaScript = {
  buildName: 'javaScript',
  builder: 'GJavaScriptBuilder',
  src: ['assets/scripts/js/**/*.js'],
  dest: '_build/js',
  outFile: 'sample.js',
  buildOptions: {
    minify: true,
    sourceMap: true
  },
};

gbm({
  systemBuilds: {
    build: javaScript,
    clean: ['_build'],
    default: ['@clean', '@build'],
  }
});
```

##### 3. Run gulp:
```sh
gulp
```

Then, 'javaScript' task will be created and run. It will concatenate all the *.js files from src directory into sample.js in dest directory.
Three more tasks, @build, @clean, default will also be created as per the settings in systemBuilds property.

<br>

### Using babel with gulp
If you want, you can use babel with gulp. Just, install babel packages and create .babelrc file with preset settings.

##### Installing babel
```sh
npm install babel-core babel-preset-es2015 --save-dev
# or
yarn add babel-core babel-preset-es2015 --dev
```

##### .babelrc
```json
{ "presets": ["es2015"] }
```
And then, just create *gulpfile.babel.js* instead of gulpfile.js.
Now, you can use es6 features in gulpfile.babel.js.
