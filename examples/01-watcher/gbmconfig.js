const gbm = require('../../lib');
const upath = require('upath');

const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, 'www');

const projectName = upath.basename(__dirname);
const prefix = projectName + ':';
const port = 5000;

const scss = {
    buildName: 'scss',
    builder: 'GCSSBuilder',
    src: upath.join(srcRoot, 'scss/**/*.scss'),
    dest: upath.join(destRoot, 'css'),
    clean: upath.join(destRoot, 'css'),
}

module.exports = gbm.createProject(scss, { prefix })
    .addTrigger('@build', [scss.buildName])
    .addWatcher('@watch', {
        watch: [upath.join(destRoot, '**/*.html')],  // watch files for reloader (no build actions)
        browserSync: {
            server: destRoot,
            port: port + parseInt(prefix),
            ui: { port: port + 100 + parseInt(prefix) }
        },
    })
    .addCleaner();
