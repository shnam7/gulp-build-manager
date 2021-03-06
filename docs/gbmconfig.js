/**
 *  Documentation for Gulp Build Manager
 */

const gbm = require('../lib');
const upath = require('upath');

const projectName = upath.basename(__dirname);   // set template name to parent directory name
const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, '_assets');
const destRoot = upath.join(basePath, '_site');
const prefix = projectName + ':';
const sourceMap = true;

// trigger file should be independent because scss and scripts builders will run in parallel
// If single file is used, file access colision could occur
const jekyllTriggerCss = upath.join(basePath, '.jekyll-trigger-css');  // flag to trigger jekyll watcher
const jekyllTriggerJs = upath.join(basePath, '.jekyll-trigger-js');  // flag to trigger jekyll watcher
const port = 4000;

const wicleName = 'shnam7/wicle';

const scss = {
    buildName: 'scss',
    builder: 'GCSSBuilder',
    src: [upath.join(srcRoot, 'scss/**/*.scss')],
    dest: upath.join(basePath, 'css'),
    preBuild: (rtb) => {
        gbm.utils.npmInstall(['stylelint-config-recommended', 'postcss-combine-duplicated-selectors', wicleName]);
        rtb.moduleOptions = {
            sass: { includePaths: ["node_modules/sass-wdk", "node_modules/wicle/scss"] },
            stylelint: {
                "extends": "stylelint-config-recommended",
                "rules": {
                    "function-calc-no-unspaced-operator": null,
                    "no-descending-specificity": null
                }
            },
            // autoprefixer: {
            //   // default browserlist is: '> 0.5%, last 2 versions, Firefox ESR, not dead'
            //   browsers: ['last 4 version']
            // },
            postcss: {
                plugins: [
                    require('postcss-combine-duplicated-selectors')(),
                    // require('postcss-cssnext')({features:{rem: false}}),
                    // require('postcss-utilities')(),
                    // require('lost')(),
                    // require('postcss-assets')({
                    //   loadPaths:[upath.join(srcRoot, 'images')],
                    // }),
                    // require('postcss-inline-svg')({path:upath.join(basePath, 'images')}),
                ]
            },
        };
    },
    postBuild: (rtb) => rtb.exec('echo', ['>', jekyllTriggerCss]),
    buildOptions: {
        lint: true,
        minifyOnly: true,
        sourceMap: sourceMap
    },
    clean: [upath.join(basePath, 'css')],
    flushStream: true,
}

const scripts = {
    buildName: 'scripts',
    builder: 'GTypeScriptBuilder',
    src: [upath.join(srcRoot, 'scripts/**/*.ts')],
    dest: upath.join(basePath, 'js'),
    preBuild: () => gbm.utils.npmInstall('shnam7/wicle'),
    postBuild: (rtb) => rtb.sync().copy([{
        src: ['node_modules/wicle/dist/js/wicle.min.js'], dest: upath.join(basePath, 'js')
    }]).exec('echo', ['>', jekyllTriggerJs]).async(),

    buildOptions: {
        minifyOnly: true,
        tsConfig: upath.join(basePath, "tsconfig.json"),
        sourceMap: sourceMap,
    },
    clean: [upath.join(basePath, 'js')],
    flushStream: true,
};

const jekyll = {
    buildName: 'jekyll',
    builder: {
        command: `jekyll build -s ${basePath} -d ${destRoot}/gulp-build-manager`,
        args: [
            '--safe', // github runs in safe mode foe security reason. Custom plugins are not supported.
            '--incremental'
        ],
    },

    watch: [
        jekyllTriggerCss, jekyllTriggerJs,
        upath.join(basePath, '**/*.{yml,html,md}'),
        `!(${upath.join(basePath, '{gulp-build-manager,gulp-build-manager/**/*}')})`,
        `!(${upath.join(basePath, '{js,js/**/*}')})`,
        `!(${upath.join(basePath, '{css,css/**/*}')})`,
        `!(${upath.join(basePath, '{.jekyll-metadata,gbmconfig.js,gulpfile.js}')})`,
    ],
    clean: [destRoot, upath.join(basePath, '.jekyll-metadata'), jekyllTriggerCss, jekyllTriggerJs],
};

const build = {
    buildName: '@build',
    dependencies: gbm.series(gbm.parallel(scss, scripts), jekyll)
}

module.exports = gbm.createProject({scss, scripts, jekyll, build}, {prefix})
    .addWatcher({
        browserSync: {
            server: upath.resolve(destRoot),
            startPath: '/gulp-build-manager/',
            open: true,
            port: port,
            ui: { port: port + 100 }
            // reloadDebounce: 500
        }
    })
    .addCleaner()
    .addVars({
        clean: [
            destRoot, jekyllTriggerCss, jekyllTriggerJs,
            upath.join(basePath, '{css,js}/**/*.map'),
            upath.join(basePath, 'gulp-build-{css,js}/**/*.map'),
            upath.join(basePath, '.jekyll-metadata'),
        ]
    });
