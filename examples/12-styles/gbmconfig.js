// Sample

const gbm = require('../../lib');
const upath = require('upath');

const projectName = upath.basename(__dirname);
const prefix = projectName + ':';

const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, 'www');
const port = 5000;

const pcssPlgingNames = ['postcss-preset-env', 'postcss-utilities', 'lost'];
const pcssPlugins = () => pcssPlgingNames.map( mod => require(mod));
const stylelint = {
    "extends": [
        "stylelint-config-recommended",
        "./.stylelintrc"
    ],
    rules: {
        "function-calc-no-unspaced-operator": null,
        "no-descending-specificity": null
    },
    // "fix": true,
}

const sass = {
    buildName: 'sass',
    builder: 'GCSSBuilder',
    preBuild: (rtb) => {
        gbm.utils.npmInstall(pcssPlgingNames);
        rtb.conf.moduleOptions = {
            sass: { includePaths: [ 'assets/scss' ] },
            postcss: { plugins: pcssPlugins() },
        }
    },
    src: [upath.join(srcRoot, 'scss/**/*.scss')],
    dest: upath.join(destRoot, 'css'),
    buildOptions: {
        sourceType: 'scss',
        sourceMap: true,
        lint: true,
        minify: false,
        postcss: true
    },
    flushStream: true,
}

const less = {
    buildName: 'less',
    builder: 'GCSSBuilder',
    preBuild: (rtb) => {
        gbm.utils.npmInstall(pcssPlgingNames);
        rtb.conf.moduleOptions = {
            postcss: { plugins: pcssPlugins() },
        }
    },
    src: [upath.join(srcRoot, 'less/**/*.less')],
    dest: upath.join(destRoot, 'css'),
    buildOptions: {
        sourceType: 'less',
        sourceMap: true,
        lint: true,
        minify: false,
        autoprefixer: false,
        // postcss: true
    },
    flushStream: true,
}

const postcss = {
    buildName: 'postcss',
    builder: 'GCSSBuilder',
    preBuild: (rtb) => {
        gbm.utils.npmInstall(pcssPlgingNames);
        rtb.conf.moduleOptions = {
            stylelint,
            postcss: { plugins: pcssPlugins() },
        }
    },
    src: [upath.join(srcRoot, 'postcss/**/*.pcss')],
    dest: upath.join(destRoot, 'css'),
    buildOptions: {
        lint: true,
        sourceMap: true,
        minify: false,
        postcss: true
    },
    flushStream: true,
}

const rtl = {
    buildName: 'rtl',
    builder: 'GRTLCSSBuilder',
    src: [
        upath.join(destRoot, 'css/*.css'),
        `!${upath.join(destRoot, 'css/**/*-rtl.css')}`
    ],
    dest: upath.join(destRoot, 'css'),
    moduleOptions: {
        // if no rename option is set, default is {suffix: '-rtl'}
        rename: { suffix: '-rtl' }
    },
    watch: []
}

module.exports = gbm.createProject({sass, less, postcss, rtl}, {prefix})
    .addBuildItem({
        buildName: '@build',
        dependencies: [
            gbm.parallel(sass.buildName, less.buildName, postcss.buildName),
            rtl.buildName
        ],
        clean: [upath.join(destRoot, 'css')]
    })
    .addWatcher('@watch', {
        watch: [upath.join(destRoot, "**/*.html")],
        browserSync: {
            server: upath.resolve(destRoot),
            port: port + parseInt(prefix),
            ui: { port: port + 100 + parseInt(prefix) }
        }
    })
    .addCleaner();
