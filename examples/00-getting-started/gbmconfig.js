const gbm = require('../../lib');
const upath = require('upath')

const basePath = upath.relative(process.cwd(), __dirname);
const projectName = upath.basename(__dirname);
const prefix = projectName + ':';

const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, 'www');


const scss = {
    buildName: 'scss',
    builder: (rtb) => {
        const sass = require('gulp-sass');

        //--- build using gulp
        // const gulp = require('gulp');
        // const { src, dest } = rtb.conf;
        // gulp.src(src).pipe(sass().on('error', sass.logError)).pipe(gulp.dest(dest));

        // better way to do the same job is using rtb(run-time-builder) API
        rtb.src().pipe(sass().on('error', sass.logError)).dest();
    },
    src: upath.join(srcRoot, 'scss/**/*.scss'),
    dest: upath.join(destRoot, 'css'),
}

const scripts = {
    buildName: 'babel',
    builder: (rtb) => rtb.src().pipe(require('gulp-babel')()).dest(),
    src: upath.join(srcRoot, 'js/**/*.js'),
    dest: upath.join(destRoot, 'js'),
}

const build = {
    buildName: '@build',
    triggers: gbm.parallel(scss, scripts),
    clean: upath.join(destRoot, '{css,js}')
}

gbm.createProject(build, { prefix })
    .addWatcher({
        watch: upath.join(destRoot, '**/*.html'),
        browserSync: { server: destRoot }
    })
    .addCleaner()
