'use strict';

/*==========  INITIALIZATION STUFF  ==========*/

var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    nodemon = require('gulp-nodemon'),
    jade = require('gulp-jade'),
    jshint = require('gulp-jshint'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber');

// Gulp plumber error handler
var onError = function(err) {
    console.log(err);
}


/*==========  TASKS  ==========*/


// Default
gulp.task('default', ['browser-sync', 'watch'], function() {});

// Watch
gulp.task('watch', function() {
    gulp.watch('views/*.jade').on('change', browserSync.reload);
    // monitor js folder
    gulp.watch('public/javascript/**/*.js', ['jshint']).on('change', browserSync.reload);
    // monitro css folder + html files
    gulp.watch(['public/stylesheets/**/*.css']).on('change', browserSync.reload);
});


// Reload Client (Browser-Sync)
gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init(null, {
        // local node app
        proxy: "http://localhost:3000",
        files: ["public/**/*.*"],
        browser: "google chrome",
        port: 7000
    });
});

// Reload Server (nodemon)
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

// jshint
gulp.task('jshint', function() {
    return gulp.src('public/javascript/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

// templates JADE
gulp.task('templates', function() {
    return gulp.src('views/*.jade')
        .pipe(jade({
            pretty: true
        }))
        .on('error', gutil.log)
        .pipe(gulp.dest('dist/'))
});