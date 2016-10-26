var chalk = require('chalk');
var gutil = require('gulp-util');
var utils = {};

utils.log = {
    build: function (msg) {
        gutil.log(chalk.yellow.bold('----------------------------------------'));
        gutil.log(chalk.bgYellow.black('build >') + ' ' + chalk.yellow.bold(msg));
        gutil.log(chalk.yellow.bold('----------------------------------------'));
    }
};

module.exports = utils;