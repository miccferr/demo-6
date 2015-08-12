'use strict';

/*==========  INITIALIZATION STUFF  ==========*/

var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    nodemon = require('gulp-nodemon'),
    jade = require('gulp-jade'),
    jshint = require('gulp-jshint'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    browserify = require('browserify'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    watchify = require('watchify'),
    gutil = require('gulp-util'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps');

// Gulp plumber error handler
var onError = function(err) {
    console.log(err);
}


/*==========  TASKS  ==========*/


// Default
gulp.task('default', ['browserify', 'browser-sync', 'watch'], function() {});

// Watch
gulp.task('watch', function() {
    gulp.watch('views/*.jade').on('change', browserSync.reload);
    // monitor js folder
    gulp.watch('public/javascripts/**/*.js', ['jshint']).on('change', browserSync.reload);
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
    return gulp.src('public/javascripts/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});


// browserify
// from http://stackoverflow.com/questions/24190351/using-gulp-browserify-for-my-react-js-modules-im-getting-require-is-not-define
gulp.task('browserify', function() {
    var bundler = browserify({
        entries: ['./public/javascripts/my-script.js'], // Only need initial file, browserify finds the deps        
        debug: true, // Gives us sourcemapping
        cache: {},
        packageCache: {},
        fullPaths: true // Requirement of watchify
    });
    var watcher = watchify(bundler);

    return watcher
        .on('update', function() { // When any files update
            var updateStart = Date.now();
            console.log('Updating!');
            watcher.bundle() // Create new bundle that uses the cache for high performance
            .pipe(source('main.js'))
            // This is where you add uglifying etc.
            .pipe(gulp.dest('./build/'));
            console.log('Updated!', (Date.now() - updateStart) + 'ms');
        })
        .bundle() // Create the initial bundle when starting the task
        .pipe(source('main.js'))
        .pipe(gulp.dest('./public/javascripts/'));
});

// // I added this so that you see how to run two watch tasks
// gulp.task('css', function() {
//     gulp.watch('styles/**/*.css', function() {
//         return gulp.src('styles/**/*.css')
//             .pipe(concat('main.css'))
//             .pipe(gulp.dest('build/'));
//     });
// });
// // Just running the two tasks
// gulp.task('default', ['browserify', 'css']);