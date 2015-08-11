'use strict';

/*==========  VARIABLES  ==========*/

var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    nodemon = require('gulp-nodemon'),
    jade = require('gulp-jade');


/*==========  TASKS  ==========*/


gulp.task('default', ['browser-sync', 'watch'], function() {});

gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init(null, {
        // local node app
        proxy: "http://localhost:3000",
        files: ["public/**/*.*"],
        browser: "google chrome",
        port: 7000
    });
});

gulp.task('nodemon', function(cb) {
    var started = false;
    return nodemon({
        script: 'app.js'
    }).on('start', function() {
        // to avoid nodemon being started multiple times 
        if (!started) {
            cb();
            started = true;
        }
    });
});

gulp.task('watch', function() {
    gulp.watch('views/*.jade').on('change', browserSync.reload);
});






/* Build */

// templates JADE
gulp.task('templates', function() {
    return gulp.src('views/*.jade')
        .pipe(jade({
            pretty: true
        }))
        .on('error', gutil.log)
        .pipe(gulp.dest('dist/'))
});