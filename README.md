# gulp-build-manager 2.0
Easy to use, flexible gulp task manager. Major

### Installation
gulp-build-manager is using gulp 4.x with babel support. If you install it following the commands below, core dependent modules including gulp 4.x and babel will be automatically installed as part of dependency.

```bash
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
