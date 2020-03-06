// Sample

const gbm = require('../../lib');
const upath = require('upath');

const projectName = upath.basename(__dirname);
const prefix = projectName + ':';

const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, '_build');

const javaScript = {
    buildName: 'javaScript',
    builder: 'GJavaScriptBuilder',
    src: [upath.join(srcRoot, 'scripts/js/**/*.js')],

    // use order property to set outFile orders
    order: ['*main.js'],
    dest: upath.join(destRoot, 'js'),
    outFile: 'sample.js',
    buildOptions: {
        // lint: true,
        babel: true,
        minify: true,
        sourceMap: true
    },
    // moduleOptions: {
    // eslint: {
    // // "extends": "eslint:recommended",
    // // "rules": {
    // // "strict": 1,
    // // },
    // "parserOptions": {
    // "ecmaVersion": 6,
    // }
    // }
    // },
    clean: [destRoot],
};

module.exports = gbm.createProject(javaScript, {prefix})
    .addTrigger('@build', [javaScript.buildName])
    .addCleaner();
