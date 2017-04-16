'use strict';
process.chdir(__dirname);

import gbm from '../src/';
gbm.loadBuilders('./gulp/gbmconfig.js');

// import gulp from 'gulp';
// gulp.task('test', done=>done());
//
// gulp.task('test1', done=>{
//   console.log('test1 executed - this will take 3 seconds to finish.');
//   return new Promise(resolve=>{
//     setTimeout(()=>{ resolve(); done(); }, 3000);
//   });
// });
//
// gulp.task('test2', done=>{
//   console.log('test2 executed.');
//
//   return gulp.src('./assets/scss/*.scss', {sourcemaps: true})
//     .pipe(sass())
//     .pipe(gulp.dest('_build/styles'));
//
//   done();
// });
