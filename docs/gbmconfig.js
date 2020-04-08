/**
 *  Documentation for Gulp Build Manager
 */

const gbm = require('../lib');
const upath = require('upath');

const projectName = upath.basename(__dirname);   // set template name to parent directory name
const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, '_assets');
const destRoot = upath.join(basePath, 'gulp-build-manager');
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
    src: [upath.join(srcRoot, 'scss/**/*.scss')],
    dest: upath.join(basePath, 'css'),
    buildOptions: {
        lint: true,
        minifyOnly: true,
        sourceMap: sourceMap
    },
    flushStream: true,
    postBuild: (rtb) => rtb.exec('echo', ['>', jekyllTriggerCss]),
    clean: [upath.join(basePath, 'css')],
}

const scripts = {
    buildName: 'scripts',
    builder: 'GTypeScriptBuilder',
    preBuild: () => gbm.utils.npmInstall('shnam7/wicle'),
    src: [upath.join(srcRoot, 'scripts/**/*.ts')],
    dest: upath.join(basePath, 'js'),
    flushStream: true,
    postBuild: (rtb) => rtb.sync().copy([{
        src: ['node_modules/wicle/dist/js/wicle.min.js'], dest: upath.join(basePath, 'js')
    }]).exec('echo', ['>', jekyllTriggerJs]).async(),

    buildOptions: {
        minifyOnly: true,
        tsConfig: upath.join(basePath, "tsconfig.json"),
        sourceMap: sourceMap,
    },
    clean: [upath.join(basePath, 'js')]
};

const jekyll = {
    buildName: 'jekyll',
    builder: {
        command: 'jekyll',
        args: [
            'build',
            '-s ' + upath.join(basePath, ''), // source path
            '-d ' + destRoot, // destination path
            '--safe', // github runs in safe mode foe security reason. Custom plugins are not supported.
            // '--baseurl http://localhost/gulp-build-manager:' + port, // root folder relative to local server,
            '--incremental'
        ],
        // options: { shell: true }
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
    reloadOnChange: false
};

module.exports = gbm.createProject({scss, scripts, jekyll}, {prefix})
    .addBuildItem({
        buildName: '@build',
        dependencies: [
            gbm.parallel(scss.buildName, scripts.buildName),
            jekyll.buildName
        ]
    })
    .addWatcher('@watch', {
        browserSync: {
            server: upath.resolve(basePath),
            open: true,
            port: port,
            ui: { port: port + 100 }
            // reloadDebounce: 500
        }
    })
    .addCleaner()
    .addVars({clean: [
        destRoot, jekyllTriggerCss, jekyllTriggerJs,
        upath.join(basePath, '{css,js}/**/*.map'),
        upath.join(basePath, 'gulp-build-{css,js}/**/*.map'),
        upath.join(basePath, '.jekyll-metadata'),
    ]});
