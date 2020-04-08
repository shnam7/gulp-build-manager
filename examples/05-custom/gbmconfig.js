// Sample

const gbm = require('../../lib');
const upath = require('upath');

const projectName = upath.basename(__dirname);
const prefix = projectName + ':';
const basePath = upath.relative(process.cwd(), __dirname);

//--- custom extension
gbm.RTB.registerExtension('hello', (options={}) => (rtb, ...args) => {
    console.log(`Hello, this is custom extension. buildName=${rtb.buildName}`, options.msg)
    console.log(args);
});

const customExt = {
    buildName: 'custom-ext',
    builder: rtb => rtb
        .chain(rtb.ext.hello({msg: 'Hi~~'}), 'arg1', 'arg2')
        .chain((rtb) => console.log(`custom function #1, buildName=${rtb.buildName}`))
        .chain(() => console.log('custom function #2')),

    postbuild: rtb => console.log(rtb.buildName + ` executed.`),
};


//--- custom builders
class CustomBuilder extends gbm.builders.GBuilder {
    constructor() { super() }
    build() {
        console.log(`CustomBuilder is building '${this.buildName}'`);
    }
}

const customBuilder = {
    buildName: 'custom-builder',
    builder: new CustomBuilder(),
};


//--- custom builder xtending built-in CSS builder
class CustomCSSBuilder extends gbm.builders.GCSSBuilder {
    src() {
        // print input files by overloading src() function
        return super.src().debug({ title: 'MyCSSBuilder:' })
    }
}

const customCSSBuilder = {
    buildName: 'custom-css-builder',
    builder: new CustomCSSBuilder(),
    src: upath.join(basePath, '*.scss'),
    dest: (file) => file.base,
    clean: [upath.join(basePath, "sample.css")]
};


//--- custom function builder
const customFunctionBuilder = {
    buildName: 'custom-function-builder',
    builder: (rtb) => console.log(rtb.buildName + ' is executed.')
};


//--- imported custom builder: customBuildDirs
const customBuilderDirs = [upath.join(basePath, 'custom-builders')];
const importedCustomBuilder = {
    buildName: 'imported-custom-builder',
    builder: 'ImportedCustomBuilder'
};

const buildList = { customExt, customBuilder, customCSSBuilder, customFunctionBuilder, importedCustomBuilder }
module.exports = gbm.createProject(buildList, {prefix,customBuilderDirs})
    .addTrigger('@build', /.*/, true)
