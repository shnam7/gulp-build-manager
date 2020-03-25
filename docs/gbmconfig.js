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
const jekyllTrigger = upath.join(basePath, '.jekyll-trigger');  // flag to trigger jekyll watcher
const port = 4000;

const scss = {
    buildName: 'scss',
    builder: 'GCSSBuilder',
    src: [upath.join(srcRoot, 'scss/**/*.scss')],
    dest: upath.join(basePath, 'css'),
    buildOptions: {
        lint: true,
        minifyOnly: true,
        sourceMap: sourceMap
    },
    flushStream: true,
    moduleOptions: {
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
    },
    postBuild: () => {
        // return promise to be sure copy operation is done before the task finishes
        return gbm.utils.exec('echo', ['>' + jekyllTrigger]);
    },
    clean: [upath.join(basePath, 'css')],
}

const scripts = {
    buildName: 'scripts',
    builder: 'GTypeScriptBuilder',
    src: [upath.join(srcRoot, 'scripts/**/*.ts')],
    dest: upath.join(basePath, 'js'),
    flushStream: true,
    postBuild: (rtb) => {
        rtb.copy([{ src: ['node_modules/wicle/dist/js/wicle.min.js'], dest: upath.join(basePath, 'js') }])
        return gbm.utils.exec('echo', ['>', jekyllTrigger]);
    },
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
        jekyllTrigger,
        upath.join(basePath, '**/*.{yml,html,md}'),
        `!(${upath.join(basePath, '{gulp-build-manager,gulp-build-manager/**/*}')})`,
        `!(${upath.join(basePath, '{js,js/**/*}')})`,
        `!(${upath.join(basePath, '{css,css/**/*}')})`,
        `!(${upath.join(basePath, '{.jekyll-metadata,gbmconfig.js,gulpfile.js}')})`,
    ],
    clean: [destRoot, upath.join(basePath, '.jekyll-metadata'), jekyllTrigger],
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
        destRoot,
        jekyllTrigger,
        upath.join(basePath, '{css,js}/**/*.map'),
        upath.join(basePath, 'gulp-build-{css,js}/**/*.map'),
        upath.join(basePath, '.jekyll-metadata'),
    ]});
