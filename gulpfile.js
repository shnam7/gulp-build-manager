const gbm = require('./lib');
const upath = require('upath');
const fs = require('fs');

// load docs config
gbm.addProject('docs/gbmconfig');

// const selector = [1] // ,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

//--- load examples config
fs.readdirSync('./examples').forEach((name) => {
    // if (!selector.includes(parseInt(name))) return;
    const dirPath = './examples/' + name;
    if (fs.statSync(dirPath)) {
        let exConfig = upath.join(dirPath, 'gbmconfig.js');
        if (fs.existsSync(exConfig)) gbm.addProject(exConfig);
    }
});

gbm
    .addTrigger('@build-all', /@build$/)
    .addCleaner('@clean-all')
    // .addTrigger('@watch-all', /@watch$/)
    // .addWatcher('@watch', {
    //     browserSync: {
    //         server: './docs/_site',
    //         ui: { port: 3100 },
    //         port: 3101,
    //     },
    //     reloadOnChange: false
    // })
    .addTrigger('@ex-build-all', /^\d.*@build$/)
    .addTrigger('@ex-clean-all', /^\d.*@clean$/)
    .addTrigger('default', '@build-all')
    .resolve();


// console.log('size=', gbm.size, ', buildNames=', gbm.buildNames);
