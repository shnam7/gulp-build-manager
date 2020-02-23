// Sample

const gbm = require('../../lib');
const upath = require('upath');

// set base directory to project root
process.chdir('../../');
const basePath = upath.relative(process.cwd(), __dirname);

class MyBuilder extends gbm.GBuilder {
    constructor() { super() }
    build() {
        console.log('MyBuilder loaded. default operation will be bypassed. Bye!');
    }
}

class MyCSSBuilder extends gbm.GCSSBuilder {
    src() {
        // print input files
        return super.src().debug({ title: 'MyCSSBuilder:' })
    }
}

const customFunction = {
    buildName: 'customFunction',
    builder: (rtb) => {
        console.log('Custom builder using function(): Hello!!!', rtb.conf.buildName);
    }
};

const customBuilder = {
    buildName: 'customBuilder',
    builder: 'GCustomBuilder'
};

const myBuilder = {
    buildName: 'myBuilder',
    builder: new MyBuilder(),
};

const myCSSBuilder = {
    buildName: 'myCSSBuilder',
    builder: new MyCSSBuilder(),
    src: upath.join(basePath, '*.scss'),
    dest: (file) => file.base,
    clean: [upath.join(basePath, "sample.css")]
};


// create gbmConfig object
gbm({
    customBuilderDir: upath.join(basePath, 'custom-builders'),
    systemBuilds: {
        build: [customFunction, customBuilder, myBuilder, myCSSBuilder],
        clean: ["__dummy"], // dummy to create '@close' task to make main gulpfile not to fail with error
        default: ['customFunction', 'customBuilder', 'myBuilder']
    }
});
