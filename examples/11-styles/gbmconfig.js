// Sample

const gbm = require('../../lib');
const upath = require('upath');

const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, 'www');
const projectName = upath.basename(__dirname);
const prefix = projectName + ':';
const port = 5000;
const sourceMap = true;


const pcssPlgingNames = ['postcss-preset-env', 'postcss-utilities', 'lost'];
const pcssPlugins = () => pcssPlgingNames.map( mod => require(mod)());
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
    src: [upath.join(srcRoot, 'scss/**/*.scss')],
    dest: upath.join(destRoot, 'css'),
    preBuild: (rtb) => {
        gbm.utils.npmInstall(pcssPlgingNames);
        rtb.moduleOptions = {
            sass: { includePaths: [ 'assets/scss' ] },
            postcss: { plugins: pcssPlugins() },
        }
    },
    buildOptions: {
        sourceType: 'scss',
        sourceMap,
        lint: true,
        minify: true,
        postcss: true
    },
    flushStream: true,
}

const less = {
    buildName: 'less',
    builder: 'GCSSBuilder',
    src: [upath.join(srcRoot, 'less/**/*.less')],
    dest: upath.join(destRoot, 'css'),
    preBuild: (rtb) => {
        gbm.utils.npmInstall(pcssPlgingNames);
        rtb.moduleOptions = { postcss: { plugins: pcssPlugins() }, }
    },
    buildOptions: {
        sourceType: 'less',
        sourceMap,
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
    src: [upath.join(srcRoot, 'postcss/**/*.pcss')],
    dest: upath.join(destRoot, 'css'),
    preBuild: (rtb) => {
        gbm.utils.npmInstall(pcssPlgingNames);
        rtb.moduleOptions = {
            stylelint,
            postcss: { plugins: pcssPlugins() },
        }
    },
    buildOptions: {
        lint: true,
        sourceMap,
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
    buildOptions: { sourceMap },
    moduleOptions: {
        // if no rename option is set, default is {suffix: '-rtl'}
        rename: { suffix: '-rtl' }
    },
    watch: []
}

const build = {
    buildName: '@build',
    dependencies: gbm.series(gbm.parallel(sass, less, postcss), rtl),
    clean: [upath.join(destRoot, 'css')]
}


module.exports = gbm.createProject(build, {prefix})
    .addWatcher('@watch', {
        watch: [upath.join(destRoot, "**/*.html")],
        browserSync: {
            server: upath.resolve(destRoot),
            port: port + parseInt(prefix),
            ui: { port: port + 100 + parseInt(prefix) }
        }
    })
    .addCleaner();
