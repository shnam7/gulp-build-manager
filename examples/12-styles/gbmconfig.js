// Sample

const gbm = require('../../lib');
const upath = require('upath');

const projectName = upath.basename(__dirname);
const prefix = projectName + ':';

const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, '_build');

const postcssPlugins = [
    require('postcss-preset-env'),
    require('postcss-utilities'),
    require('lost'),
    // require('cssnano')(), // additional optimization
    // require('postcss-combine-duplicated-selectors')(), // specific optimization
];


const app = {
    copyHtml: {
        buildName: 'copyHtml',
        builder: 'GBuilder',
        src: upath.join(srcRoot, '*.html'),
        dest: destRoot
    },

    sass: {
        buildName: 'sass',
        builder: 'GCSSBuilder',
        src: [upath.join(srcRoot, 'scss/**/*.scss')],
        dest: upath.join(destRoot, 'css'),
        buildOptions: {
            sourceType: 'scss',
            sourceMap: true,
            lint: true,
            minify: true,
            postcss: true
        },
        moduleOptions: {
            sass: {
                includePaths: [
                    'assets/scss'
                ]
            },
            postcss: {
                plugins: postcssPlugins
            },
            stylelint: {
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
        },
        flushStream: true,
    },

    less: {
        buildName: 'less',
        builder: 'GCSSBuilder',
        src: [upath.join(srcRoot, 'less/**/*.less')],
        dest: upath.join(destRoot, 'css'),
        buildOptions: {
            sourceType: 'less',
            sourceMap: true,
            lint: true,
            minify: true,
            autoprefixer: false,
            // postcss: true
        },
        moduleOptions: {
            // sass: {
            // includePaths: [
            // 'assets/scss'
            // ]
            // },
            postcss: {
                plugins: postcssPlugins
            }
        },
        flushStream: true,
    },

    postcss: {
        buildName: 'postcss',
        builder: 'GCSSBuilder',
        src: [upath.join(srcRoot, 'postcss/**/*.pcss')],
        dest: upath.join(destRoot, 'css'),
        buildOptions: {
            lint: true,
            sourceMap: true,
            minify: true,
            postcss: true
        },
        moduleOptions: {
            postcss: {
                plugins: postcssPlugins
            },
        },
        flushStream: true,
    },

    rtl: {
        buildName: 'rtl',
        builder: 'GRTLCSSBuilder',
        src: [upath.join(destRoot, 'css/*.css'), "!**/*-rtl.css"],
        dest: upath.join(destRoot, 'css'),
        moduleOptions: {
            // if no rename option is set, default is {suffix: '-rtl'}
            rename: {
                suffix: '---rtl'
            }
        },
    },
}

module.exports = gbm.createProject(app, {prefix})
    .addBuildItem({
        buildName: '@build',
        dependencies: [
            gbm.parallel(app.copyHtml.buildName, app.sass.buildName, app.less.buildName, app.postcss.buildName),
            app.rtl.buildName
        ],
        clean: [destRoot]
    })
    .addWatcher('@watch', {
        browserSync: { server: upath.resolve(destRoot) }
    })
    .addCleaner();
