---
layout: docs
---

# GTypeScruptBuilder
CSS builder. sass/scss/less and postcss are suported. You can use postcss together with sass/scss/less.

### Builder specific Options
  - *conf.buildOptions.sourceMap* (<i>type:boolean, default:false</i>)
    If set to true, sourceMap files are generated.
  - *conf.buildOptions.declarationeMap* (<i>type:boolean, default:false</i>)
    If set to true, sourceMap for declaration files are generated.
  - *conf.buildOptions.lint* (<i>type:boolean, default:false</i>)
    If set to true, linter is activated.
  - *conf.buildOptions.minify* (<i>type:boolean, default:false</i>)
    If set to true, *.min.js files are generated.
  - *conf.buildOptions.minifyOnly* (<i>type:boolean, default:false</i>)
    If set to true, *.min.js files are generated but non-minified files are not created.
  - *conf.buildOptions.babel* (<i>type:boolean, default:false</i>)
    If set to true, babel is enabled so that you can use es6 features.
  - *conf.buildOptions.printConfig* (<i>type:boolean, default:false</i>)
    If set to true, evaluated TypeScript options(tsconfig) will be printed.

#### Notes
  - If conf.outFile is set, it will override the outFile setting of tsconfig.json
  - If conf.outFile and conf.dest is set, conf.dest will override the outDir setting of tsconfig.json
  - buildOptions.outFileOnly option is not supported. TypeScript compiler always generates outFile only, and if non-concatenated each individual files need to be generated, create another build configuration without outFile option.


### Example
```js
const typeScript = {
    buildName: 'typeScript',
    builder: 'GTypeScriptBuilder',
    src: [upath.join(srcRoot, 'scripts/ts/**/!(*.d).ts')],

    // use order property to set outFile orders
    order: ['*ts-2.ts'],
    dest: (file) => file.base,
    outFile: upath.join(destRoot, 'js/sample-ts.js'),
    buildOptions: {
        sourceMap: true,
        minify: true,
        // You can specify tsconfig.json file here. To create a default one, run 'tsc -init'
        tsConfig: upath.join(srcRoot, 'scripts/tsconfig.json'),
        printConfig: true
    },
    moduleOptions: {
        // this will override the tsConfig settings in buildOptions
        typescript: {
            "outFile": "sample-ts.js",
            "outDir": upath.resolve(destRoot, 'js'),
            "declarationDir": upath.resolve(destRoot, '@types'),
            "target": "es5",
            "module": "none",
            "noImplicitAny": true,
            "noEmitOnError": true
        }
    },
};
```
