var gulp            = require('gulp');
var plugins         = {};
plugins.utils       = require('./_build/utils/utils');
plugins.gutil       = require('gulp-util');
plugins.chalk       = require('chalk');
plugins.runSequence = require('run-sequence');
plugins.ts          = require('gulp-typescript');
plugins.babel       = require('gulp-babel');
plugins.wait        = require('gulp-wait');

var config = {
    BUILD_PATHS : {
        server : {
            src  : './src/server/**/',
            dist : './src/server/'
        },
        vue : {
            src  : './src/client-vue/src/app/**/',
            dist : './src/client-vue/src/app/'
        }
    }
};

/**
 * Require diff build types
 */
require('./_build/server/main.js')(gulp, plugins, config);
require('./_build/client-angular/main.js')(gulp, plugins, config);
require('./_build/client-js/main.js')(gulp, plugins, config);

/**
 * Main build task, default
 */
gulp.task('default', function(cb) {
    plugins.gutil.log(plugins.chalk.black.bgWhite.bold('-----------------------------------------------------'));
    plugins.gutil.log(plugins.chalk.black.bgWhite.bold('-                                                    '));
    plugins.gutil.log(plugins.chalk.black.bgWhite.bold('-----------------------------------------------------'));
    return plugins.runSequence('buildServerWatch', cb); // 'buildClientCtrl', 'buildClientNg', 'buildClientRt', 'buildServer',
});

gulp.task('server-build', function(cb) {
    plugins.gutil.log(plugins.chalk.black.bgWhite.bold('-----------------------------------------------------'));
    plugins.gutil.log(plugins.chalk.black.bgWhite.bold('-                                                    '));
    plugins.gutil.log(plugins.chalk.black.bgWhite.bold('-----------------------------------------------------'));
    return plugins.runSequence('buildServer', cb); // 'buildClientCtrl', 'buildClientNg', 'buildClientRt', 'buildServer',
});
