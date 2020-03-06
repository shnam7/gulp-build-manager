// Sample

const gbm = require('../../lib');
const upath = require('upath');

const projectName = upath.basename(__dirname);
const prefix = projectName + ':';

const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, '_build');

// build configurations
const coffee = {
    buildName: 'coffee',
    builder: 'GCoffeeScriptBuilder',
    src: [upath.join(srcRoot, 'coffee/**/*.coffee')],
    dest: (file) => file.base,
    flushStream: true,
    buildOptions: {
        lint: true,
        sourceMap: true,
        // minify: true
    }
};

const babel = {
    buildName: 'babel',
    builder: 'GJavaScriptBuilder',
    src: [upath.join(srcRoot, 'es6/**/*.es6')],
    dest: (file) => file.base,
    flushStream: true,
    buildOptions: {
        babel: true,
        // TODO gulp-eslint seems to have bug on dependencies
        // lint: true,
        sourceMap: true,
        // minify: true
    },
    moduleOptions: {
        eslint: {
            parserOptions: {
                ecmaVersion: 6
            },
            rules: {
                strict: 1
            }
        }
    }
};

const javaScript = {
    buildName: 'javaScript',
    builder: 'GJavaScriptBuilder',
    src: [upath.join(srcRoot, '{coffee,es6,js}/**/*.js')],
    order: ['sample1.js'],
    dest: upath.join(destRoot, 'js'),
    outFile: 'sample.js',
    dependencies: gbm.parallel(prefix+coffee.buildName, prefix+babel.buildName),
    buildOptions: {
        minify: true,
        // minifyOnly: true,
        sourceMap: true,
        outFileOnly: true // default value of outFileOnly is true
    },
};

const typeScript = {
    buildName: 'typeScript',
    builder: 'GTypeScriptBuilder',
    src: [upath.join(srcRoot, 'ts/**/*.ts')],
    // dest: (file) => file.base,
    dest: upath.resolve(destRoot, 'js'),
    outFile: 'sample-ts.js',
    buildOptions: {
        // lint: true,
        // printConfig: true,
        minifyOnly: true,
        sourceMap: true,
        // You can specify tsconfig.json file here. To create a default one, run 'tsc -init'
        // tsConfig: upath.join(srcRoot, 'ts/tsconfig.json')
    },
    moduleOptions: {
        // this will override the tsConfig settings in buildOptions
        typescript: {
            "target": "es5",
            // "module": "none",
            "noImplicitAny": true,
            "noEmitOnError": true,
            "declaration": true,
            "lib": ['DOM', 'ES6', 'DOM.Iterable', 'ScriptHost']
        },
        tslint: {
            configuration: {
                "extends": "tslint:recommended"
            }
        },
        // uglifyES: {
        // // mangle: false,
        // ecma: 6
        // }
    },
}

const scripts = { coffee, babel, javaScript, typeScript };

module.exports = gbm.createProject(scripts, {prefix})
    .addTrigger('@build', [javaScript.buildName, typeScript.buildName])
    .addCleaner('@clean', {
        clean: [destRoot, upath.join(srcRoot, '{coffee,es6,ts}/**/*.{js,map}')]
    })
