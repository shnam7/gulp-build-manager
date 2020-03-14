// Sample

const gbm = require('../../lib');
const upath = require('upath');

const projectName = upath.basename(__dirname);
const prefix = projectName + ':';
const basePath = upath.relative(process.cwd(), __dirname);

class MyBuilder extends gbm.builders.GBuilder {
    constructor() { super() }
    build() {
        console.log('MyBuilder loaded. default operation will be bypassed. Bye!');
    }
}

class MyCSSBuilder extends gbm.builders.GCSSBuilder {
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


module.exports = gbm.createProject({customFunction, customBuilder, myBuilder, myCSSBuilder}, {
        prefix,
        customBuilderDirs: upath.join(basePath, 'custom-builders')
    })
    .addTrigger('@build', /.*/)
