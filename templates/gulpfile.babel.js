/**
 * Gulpfile
 *
 */

'use strict';
process.chdir(__dirname);

import gbm from 'gulp-build-manager';
gbm.loadBuilders('./gulp/gbmConfig.js');
