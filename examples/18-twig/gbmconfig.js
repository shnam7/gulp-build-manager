// Sample

const gbm = require('../../lib');
const upath = require('upath');

const projectName = upath.basename(__dirname);
const prefix = projectName + ':';

const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, '_build');
const port = 5000;


const exConfig = {
    scss: {
        buildName: 'scss',
        builder: 'GCSSBuilder',
        src: upath.join(srcRoot, 'scss/**/*.scss'),
        dest: upath.join(destRoot, 'css'),
        buildOptions: {
            postcss: true,
            minifyOnly: true
        }
    },

    scripts: {
        buildName: 'scripts',
        builder: 'GTypeScriptBuilder',
        src: upath.join(srcRoot, 'scripts/**/*.ts'),
        dest: upath.join(destRoot, 'js'),
        buildOptions: {
            minifyOnly: true,
            tsConfig: upath.join(basePath, 'tsconfig.json')
        }
    },

    twig: {
        buildName: 'twig',
        builder: 'GTwigBuilder',

        src: [upath.join(srcRoot, 'pages/**/*.twig')],
        dest: upath.join(destRoot, ''),
        buildOptions: {
            minify: true,
            prettify: true
        },
        moduleOptions: {
            twig: {
                base: upath.join(srcRoot, 'templates'),

                // data can be a glob string or array of strings or data object
                // To use live reload on changes in data, yml or json file should be used
                data: upath.join(srcRoot, 'data/**/*.{yml,yaml,json}'),
                //   {
                //   site: {
                //     name: 'Gulp Build Manager Sample - Twig',
                //     charset: 'UTF-8',
                //     url:'.'
                //   }
                // },
                extend: require('twig-markdown'),
                functions: [
                    {
                        name: "nameOfFunction",
                        func: function (args) {
                            return "the function";
                        }
                    }
                ],
                filters: [
                    {
                        name: "nameOfFilter",
                        func: function (args) {
                            return "the filter";
                        }
                    }
                ]
            },
            htmlPrettify: { indent_char: ' ', indent_size: 2 },
            htmlmin: {
                collapseWhitespace: true,
            }
        },
        addWatch: [ // include sub directories to detect changes of the file which are not in src list.
            upath.join(srcRoot, 'templates/**/*.twig'),
            upath.join(srcRoot, 'markdown/**/*.md'),
            upath.join(srcRoot, 'data/**/*.{yml,yaml,json}')
        ]
    },
};

module.exports = gbm.createProject(exConfig, {prefix})
    .addTrigger('@build', gbm.buildNamesOf(exConfig))
    .addWatcher('@watch', {
        browserSync: {
            server: upath.resolve(destRoot),
            port: port + parseInt(prefix),
            ui: { port: port + 100 + parseInt(prefix) }
        }
    })
    .addCleaner('@clean', { clean: destRoot });
