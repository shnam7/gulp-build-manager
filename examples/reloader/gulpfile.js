// Sample

const gbm = require('../../lib');
const upath = require('upath');

// set base directory to project root
process.chdir('../../');
const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, '_build');

const html = {
    buildName: 'html',
    builder: 'GBuilder',
    src: [upath.join(srcRoot, 'html/**/*.html')],
    dest: destRoot
};

const scss = {
    buildName: 'scss',
    builder: 'GCSSBuilder',
    src: [upath.join(srcRoot, 'scss/**/*.scss')],
    dest: upath.join(destRoot, 'css'),
    buildOptions: {
        postcss: true
    }
};

// create gbmConfig object
gbm({
    systemBuilds: {
        build: [html, scss],
        clean: [destRoot],
        default: ['@clean', '@build'],
        watch: { browserSync: { server: upath.resolve(destRoot) } }
    }
});
