# gulp-build-manager
Gulp Build Manager enables gulp task to be created or customized easily and quickly by using simple configurations.
It provides the convenience like grunt with flexibility of gulp.

### Installation
gulp-build-manager is using gulp 4.x with babel support. If you install it following the commands below, core dependent modules including gulp 4.x and babel will be automatically installed as part of dependency.
```bash
npm install gulp-build-manager -g
npm install gulp-build-manager --save-dev
```
Please be sure to have .babelrc file in the project root directory with the minimum contents below, which enables es6 support. 
```json
{
  "presets": ["es2015"]
}
```


### Preparing gulpfile with babel support
To enable babel in Gulp 4.x, just create 'gulpfile.babel.js', instead of 'gulpfile.js'.


### Using command line tool 'gbm' to setup initial project frame with example config
```bash
npm install gulp-build-manager -g
gbm init
```
This will create an initial project framework with example build configurations in current directory.
If you want to set it up in a different directory, use 'gbm init \<dir\>'.

For more information, please follow the documentation link below:<br>
[Documentation](https://shnam7.github.io/gulp-build-manager/)



### Working Example
To see a working example with various build definitions and custom builders,
please refer to the github [samples](https://github.com/shnam7/gulp-build-manager/tree/master/samples)
