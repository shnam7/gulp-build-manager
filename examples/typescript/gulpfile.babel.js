// Sample

import gbm from '../../src';
import upath from 'upath';

process.chdir(__dirname);

const srcRoot = 'assets';
const destRoot = '_build';


/**
 * Define build items
 */

const typeScript = {
  buildName: 'typeScript',
  builder: 'GTypeScriptBuilder',
  src: [upath.join(srcRoot, 'scripts/ts/**/!(*.d).ts')],

  // use order property to set outFile orders
  order: ['*ts-2.ts'],
  dest: (file) => file.base,
  outFile: upath.join(destRoot, 'js/sample-ts.js'),
  buildOptions: {
    sourceMap: true,
    minify: true,
    // You can specify tsconfig.json file here. To create a default one, run 'tsc -init'
    tsConfig: upath.join(srcRoot, 'scripts/tsconfig.json')
  },
  // moduleOptions: {
  //   // this will override the tsConfig settings in buildOptions
  //   typescript: {
  //     // "outFile": "sample-ts.js",
  //     // "outDir": upath.resolve(destRoot, 'js'),
  //     // "declarationDir": upath.resolve(destRoot, '@types')
  //
  //     // "target": "es5",
  //     // "module": "none",
  //     // "noImplicitAny": true,
  //     // "noEmitOnError": true
  //   }
  // },
  plugins: [
    // new gbm.DebugPlugin({title:'msg:'}, ['init', 'dest']),
  ]
};

//
// let minify = require('gulp-minify');
// gulp.task('compress', function() {
//   let sourcemaps = require('gulp-sourcemaps');
//   return gulp.src(upath.join(destRoot, 'js/sample-ts.js'), {sourcemaps:false})
//     .pipe(sourcemaps.init())
//     .pipe(minify({
//       ext:{
//         // src:'-debug.js',
//         min:'.min-.js'
//       },
//       noSource:true,
//       // exclude: ['tasks'],
//       ignoreFiles: ['.combo.js', '.min.js']
//     }))
//     // .pipe(sourcemaps.write('.'))
//     .pipe(gulp.dest('dist'))
//
// });
//
// class GMinifyBuilder extends GBuilder {
//   OnBuild(stream, mopts, conf) {
//     let minify = require('gulp-minify');
//     return stream.pipe(minify(mopts.minify));
//   }
// }
//
// let minifyBuild = {
//   buildName:'minify',
//   builder: new GMinifyBuilder,
//   src: upath.join(destRoot, 'js/sample-ts.js'),
//   dest: 'dist2',
//   moduleOptions: {
//     minify: {
//       ext:{min:'.min.js'},
//       // mangle:true,
//       // noSource:true,
//       exclude:['**/*.map']
//     }
//   }
// };


/**
 * Create gbmConfig object
 */
gbm({
  builds: [typeScript],
  systemBuilds: {
    // 'copy' and 'images' will be executed in paralle, and then zip will be executed in series
    build: 'typeScript',
    clean: [
      destRoot,
      upath.join(srcRoot, 'scripts/ts/**/*.{js,map,d.ts}')
    ],
    default: ['@clean', '@build'],
  }
});
