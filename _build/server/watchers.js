module.exports = function (gulp, plugins, config, localConfig) {
  /**
   * Compile typescript & babel
   * - for on watch
   */
  gulp.task('server-typescript-babel-watcher', function () {
    return gulp.watch([config.BUILD_PATHS.server.src + '*.ts'], function (file) {
      gulp.src(file.path)
        .pipe(plugins.wait(500))
        .pipe(plugins.ts(localConfig.ts, plugins.ts.reporter.nullReporter()))
        .pipe(plugins.babel(localConfig.babel))
        .pipe(plugins.wait(500))
        // bug fix for saving a file in wrong location !
        .pipe(gulp.dest(function (file) {
            return file.base;
        }));
    })
  });
};
