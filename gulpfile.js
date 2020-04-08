const gbm = require('./lib');
const upath = require('upath');
const fs = require('fs');

gbm.utils.setNpmOptions({autoInstall: true})

// load docs config
const docs = require('./docs/gbmconfig');
gbm.addProject(docs);

// const selector = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

//--- load examples config
fs.readdirSync('./examples').forEach((name) => {
    // if (!selector.includes(parseInt(name))) return;
    const dirPath = './examples/' + name;
    if (fs.statSync(dirPath)) {
        let exConfig = upath.join(dirPath, 'gbmconfig.js');
        if (fs.existsSync(exConfig)) gbm.addProject(exConfig);
    }
});

const cleanToPrepare = {
    buildName: '@clean-to-prepare',
    builder: rtb => rtb.clean(),
    clean: docs.vars.clean,
    triggers: '@ex-clean-all'
}

gbm.addTrigger('@build-all', /@build$/)
    .addCleaner('@clean-all')
    .addTrigger('@ex-build-all', /^\d.*@build$/)
    .addTrigger('@ex-clean-all', /^\d.*@clean$/)
    .addBuildItem(cleanToPrepare)
    .addTrigger('default', ['@clean-all', '@build-all'], true)
    // .addTrigger('@watch-all', /@watch$/)
    // .addWatcher('@watch', {
    //     browserSync: {
    //         server: './docs/_site',
    //         ui: { port: 3100 },
    //         port: 3101,
    //     },
    //     reloadOnChange: false
    // })
    .resolve();
