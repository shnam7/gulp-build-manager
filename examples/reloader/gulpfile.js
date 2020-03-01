// Sample

const gbm = require('../../lib');
const upath = require('upath');

// set base directory to project root
process.chdir('../../');
const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, 'html');

const html = {
    buildName: 'html-watcher',
    watch: { watched: [upath.join(destRoot, '**/*.html')] }
};

const scss = {
    buildName: 'scss',
    builder: 'GCSSBuilder',
    src: [upath.join(srcRoot, 'scss/**/*.scss')],
    dest: upath.join(destRoot, 'css'),
    clean: [upath.join(destRoot, 'css')]
};

// create gbmConfig object
gbm({
    systemBuilds: {
        build: [html, scss],
        default: ['@clean', '@build'],
        watch: { browserSync: { server: upath.resolve(destRoot) } }
    }
});
