# gulp-build-manager
modular gulp build manager using using babel/es6

Gulp Build Manager enables gulp task to be created or customized easily and quickly by using simple configurations, but with more flexiility leveraging javascript.

## Example

#### gulpfile.babel.js
```javascript
import config from './gulp/gbmconfig';
import gbm from 'gulp-build-manager';

gbm.loadBuilders('./gulp/gbmconfig.js');
```

#### ./gulp/gbmconfig.js
Refer to the [example dir](https://github.com/shnam7/gulp-build-manager/tree/master/example) in the source

Currently available builders are:
```
 - GBuilder: General (Copy) Builder, which just executes user defined custom function
 - GSassBuilder: Sass/Scss builder, using gulp-sass
 - GCoffeeScriptBuilder: CoffeeScript builder, using gulp-coffee
 - GTypeScriptBuilder: TypeScript builder, using gulp-typescript
 - GJavaScriptBuilder: JavaScript builder, which combines javascript files into a single output file.
 - GMarkdownBuilder: Markdown builder, which converts markdown files into html
 - GPaniniBuilder: Panini builder
 - GTwigBuilder: Twig builder
 - GPostCSSBuilder: PostCSS builder
 - GImagesBuilder: Image Optimizer, using gulp-images
 - GCopyBuillder: Copies source files to destination
```

## Dependency
This program was developed and tested with gulp 4.0+

##### install gulp #4
```bash
npm install gulp -g
npm install gulpjs/gulp.git#4.0 --save-dev
```
