// Sample

const gbm = require('../../lib');
const upath = require('upath');

const projectName = upath.basename(__dirname);
const prefix = projectName + ':';

const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets/panini');
const destRoot = upath.join(basePath, '_build');
const port = 5000;

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

    // include sub directories to detect changes of the file which are not in src list.
    watch: [upath.join(srcRoot, '**/*')],
    clean: [destRoot]
};

module.exports = gbm.createProject(panini, {prefix})
    .addTrigger('@build', /.*/)
    .addWatcher('@watch', {
        browserSync: {
            server: upath.resolve(destRoot),
            port: port + parseInt(prefix),
            ui: { port: port + 100 + parseInt(prefix) }
        }
    })
    .addCleaner();
