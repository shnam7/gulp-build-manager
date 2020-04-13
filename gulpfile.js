const gbm = require('./lib');
const upath = require('upath');
const fs = require('fs');

// gbm.utils.setNpmOptions({autoInstall: true})

//--- examples
// const selector = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
fs.readdirSync('./examples').forEach((name) => {
    // if (!selector.includes(parseInt(name))) return;
    const dirPath = './examples/' + name;
    if (fs.statSync(dirPath)) {
        let exConfig = upath.join(dirPath, 'gbmconfig.js');
        if (fs.existsSync(exConfig)) gbm.addProject(exConfig);
    }
});


//--- docs
const docs = require('./docs/gbmconfig');
gbm.addProject(docs);


//--- main
const cleanToPrepare = {
    buildName: '@clean-to-prepare',
    builder: rtb => rtb.clean(),
    clean: docs.vars.clean,
    triggers: '@ex-clean-all'
}

const buildAll = { buildName: '@build-all', triggers: gbm.getBuildNames(/@build$/) };
const cleanAll = { buildName: '@clean-all', triggers: gbm.getBuildNames(/@clean$/) };
const exBuildAll = { buildName: '@ex-build-all', triggers: gbm.getBuildNames(/^\d.*@build$/) };
const exCleanAll = { buildName: '@ex-clean-all', triggers: gbm.getBuildNames(/^\d.*@clean$/) };

const main = gbm.createProject({buildAll, cleanAll, exBuildAll, exCleanAll, cleanToPrepare})
gbm.addProject(main);
