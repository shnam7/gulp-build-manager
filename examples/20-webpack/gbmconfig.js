// Sample


const gbm = require('../../lib');
const upath = require('upath');   // use path instead of upath to workaround windows/linux path notation issue

const projectName = upath.basename(__dirname);
const prefix = projectName + ':';

const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, '_build');
const port = 5000;


const pages = {
    buildName: 'twig',
    builder: 'GTwigBuilder',
    src: [upath.join(srcRoot, 'pages/**/*.html')],
    dest: upath.join(destRoot, ''),
    buildOptions: { prettify: true },
}

const webpack = {
    buildName: 'webpack',
    builder: 'GWebpackBuilder',
    // src: [upath.join(srcRoot, 'scripts/ts/app.ts')],
    dest: upath.join(destRoot, 'js'),
    flushStream: true,
    buildOptions: {
        printConfig: true,
        webpackConfig: upath.join(basePath, 'webpack.config.js')
    },
    moduleOptions: {
        webpack: {
            // settings here will be merged override webpackConfig file contents
        },
    },
    watch: [upath.join(srcRoot, 'scripts/ts/**/*.ts')]
}


module.exports = gbm.createProject({pages, webpack}, { prefix })
    .addTrigger('@build', /.*/)
    .addWatcher('@watch', {
        browserSync: {
            server: upath.resolve(destRoot),
            open: true,
            port: port + parseInt(prefix),
            ui: { port: port + 100 + parseInt(prefix) }
       }
    })
    .addCleaner('@clean', { clean: [destRoot]});
