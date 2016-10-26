module.exports = function (gulp, plugins, config, localConfig) {

    /**
     * Compile typescript
     * - for on build start
     */
    gulp.task('server-typescript', function () {
        return gulp.src([config.BUILD_PATHS.server.src + '*.ts'])
            .pipe(plugins.ts(localConfig.ts, plugins.ts.reporter.nullReporter()))
            .pipe(gulp.dest(config.BUILD_PATHS.server.dist));
    });

    /**
     * Compile babel
     * - for on build start
     */
    gulp.task('server-babel', function () {
        return gulp.src([config.BUILD_PATHS.server.src + '*.js'])
            .pipe(plugins.babel(localConfig.babel))
            .pipe(gulp.dest(config.BUILD_PATHS.server.dist));
    });

};