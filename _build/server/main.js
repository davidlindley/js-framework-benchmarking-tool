module.exports = function (gulp, plugins, config) {
    var localConfig = {
      ts: {
        module: 'commonJS',
        sourceMap: false
      },
      babel : {
        comments: false
      }
    }

    require('./build')(gulp, plugins, config, localConfig);
    require('./watchers')(gulp, plugins, config, localConfig);

    /**
     * Exposed final task
     */
    gulp.task('buildServer', function(cb) {
      plugins.utils.log.build('buildServer start');
      return plugins.runSequence('server-typescript', 'server-babel', 'server-typescript-babel-watcher', cb);
    });
};
