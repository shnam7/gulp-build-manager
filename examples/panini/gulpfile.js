// Sample

const gbm = require('../../lib');
const upath = require('upath');

// set base directory to project root
process.chdir('../../');
const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets/panini');
const destRoot = upath.join(basePath, '_build');

const panini = {
    buildName: 'panini',
    builder: 'GPaniniBuilder',

    // panini does not handle backslashes correctly, so replace them to slash
    src: [upath.join(srcRoot, 'pages/**/*')],
    dest: upath.join(destRoot, ''),
    moduleOptions: {
        panini: {
            root: upath.join(srcRoot, 'pages/'),
            layouts: upath.join(srcRoot, 'layouts/'),
            partials: upath.join(srcRoot, 'partials/'),
            data: upath.join(srcRoot, 'data/'),
            helpers: upath.join(srcRoot, 'helpers/')
        }
    },

    plugins: [
        // rename *.md files into *.html in the start of build process
        stream => stream.pipe(require('gulp-rename')({ extname: '.html' }))
    ],

    watch: {
        // include sub directories to detect changes of the file which are not in src list.
        watched: [upath.join(srcRoot, '**/*')],
        livereload: true
    }
};

// create gbmConfig object
gbm({
    systemBuilds: {
        build: [panini],
        clean: [destRoot],
        default: ['@clean', 'panini'],
        // watch: {livereload:{start:true}},
        watch: { browserSync: { server: upath.resolve(destRoot) } }
    }
});
