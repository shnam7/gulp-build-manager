/**
 *  Documentation for Gulp Build Manager
 *
 */

const gbm = require('../lib');
const upath = require('upath');

const projectName = upath.basename(__dirname);   // set template name to parent directory name
const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, '_site');
const prefix = projectName + ':';
const sourceMap = true;
const jsTriggerFile = upath.join(basePath, '.js-triggered');
const cssTriggerFile = upath.join(basePath, '.css-triggered');

const docs = {
    scss: {
        buildName: prefix + 'scss',
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
            return gbm.utils.exec('echo', ['>>', cssTriggerFile]);
        },
        clean: [upath.join(basePath, 'css'), cssTriggerFile],
    },

    scripts: {
        buildName: prefix + 'scripts',
        builder: 'GTypeScriptBuilder',
        src: [upath.join(srcRoot, 'scripts/**/*.ts')],
        dest: upath.join(basePath, 'js'),
        flushStream: true,
        postBuild: (rtb) => {
            rtb.copy([{ src: ['node_modules/wicle/dist/js/wicle.min.js'], dest: upath.join(basePath, 'js') }])
            // return promise to be sure copy operation is done before the task finishes
            return gbm.utils.exec('echo', ['>>', jsTriggerFile]);
        },
        buildOptions: {
            minifyOnly: true,
            tsConfig: upath.join(basePath, "tsconfig.json"),
                sourceMap: sourceMap,
            },
        clean: [upath.join(basePath, 'js'), jsTriggerFile]
    },

    jekyll: {
        buildName: prefix + 'jekyll',
        // builder: 'GJekyllBuilder',
        builder: {
            command: 'jekyll',
            args: [
                'build',
                '-s ' + upath.join(basePath, ''),   // source path
                '-d ' + destRoot,                   // destination path
                '--safe',       // github runs in safe mode foe security reason. Custom plugins are not supported.
                '--baseurl http://localhost:3000',  // root folder relative to local server,
                '--incremental'
            ],
            // options: { shell: true }
        },
        flushStream: true,

        // src: upath.join(basePath, ''),
        // dest: destRoot,
        // moduleOptions: {
        //     jekyll: {
        //         command: 'build',
        //         args: [
        //             '--safe',       // github runs in safe mode foe security reason. Custom plugins are not supported.
        //             '--baseurl http://localhost:3000',  // root folder relative to local server,
        //             '--incremental'
        //         ]
        //     }
        // },
        watch: {
            watched: [
                upath.join(basePath, '**/*.{yml,html,md}'),
                upath.join(basePath, '.*-triggered'),
                '!' + upath.join(basePath, '{js,css}'),
                '!' + upath.join(basePath, '{.jekyll-metadata,gbmconfig.js,gulpfile.js}'),

                // TODO glob exclude not working correctly for watcher: gulp issue #2192
                // '!' + upath.join(srcRoot, '{assets,assets/**/*}'),
                // '!' + upath.join(srcRoot, '{_site,_site/**/*}'),
                // '!' + upath.join(srcRoot, '{.jekyll-metadata,gbmconfig.js,gulpfile.js}'),
                // upath.join(srcRoot, '**/*'),
            ]
        },
        clean: [destRoot, upath.join(basePath, '.jekyll-metadata')],
    },

    get build() {
        return [gbm.parallel(this.scss, this.scripts), this.jekyll]
    },

    destRoot: destRoot
};

module.exports = docs;
