/**
 *  Documentation for Gulp Build Manager
 *
 */

const gbm = require('../lib');
const upath = require('upath');

const projectName = upath.basename(__dirname);   // set template name to parent directory name
const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, '_assets');
const destRoot = upath.join(basePath, '_site');
const prefix = projectName + ':';
const sourceMap = true;
const jekyllTrigger = upath.join(basePath, '.jekyll-triggered');

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
        postBuild: (builder) => {
            // return promise to be sure copy operation is done before the task finishes
            return gbm.GPlugin.exec(builder, 'echo', ['>', jekyllTrigger]);
        },
        clean: [upath.join(basePath, 'css')],
    },

    scripts: {
        buildName: prefix + 'scripts',
        builder: 'GTypeScriptBuilder',
        src: [upath.join(srcRoot, 'scripts/**/*.ts')],
        dest: upath.join(basePath, 'js'),
        copy: [{ src: ['node_modules/wicle/dist/js/wicle.min.js'], dest: upath.join(basePath, 'js') }],
        flushStream: true,
        buildOptions: {
            minifyOnly: true,
            tsConfig: upath.join(basePath, "tsconfig.json"),
            sourceMap: sourceMap,
        },
        flushStream: true,
        postBuild: (builder) => {
            // return promise to be sure copy operation is done before the task finishes
            return gbm.GPlugin.exec(builder, 'echo', ['>', jekyllTrigger]);
        },
        clean: [upath.join(basePath, 'js')]
    },

    jekyll: {
        buildName: prefix + 'jekyll',
        builder: 'GJekyllBuilder',
        src: upath.join(basePath, ''),
        dest: destRoot,
        flushStream: true,
        moduleOptions: {
            jekyll: {
                command: 'build',
                args: [
                    '--safe',       // github runs in safe mode foe security reason. Custom plugins are not supported.
                    '--baseurl http://localhost:3000',  // root folder relative to local server,
                    '--incremental'
                ]
            }
        },
        watch: {
            watched: [
                jekyllTrigger,
                upath.join(basePath, '**/*.{yml,html,md}'),
                `!(${upath.join(basePath, '{_site,_site/**/*}')})`,
                `!(${upath.join(basePath, '{js,js/**/*}')})`,
                `!(${upath.join(basePath, '{css,css/**/*}')})`,
                `!(${upath.join(basePath, '{.jekyll-metadata,gbmconfig.js,gulpfile.js}')})`,
            ]
        },
        clean: [destRoot, upath.join(basePath, '.jekyll-metadata'), jekyllTrigger],
    },

    get build() {
        return [gbm.parallel(this.scss, this.scripts), this.jekyll]
    },

    destRoot: destRoot
};

module.exports = docs;
