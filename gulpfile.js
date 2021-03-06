var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require('browserify');
var babelify = require('babelify');
var tildeImporter = require('node-sass-tilde-importer');
var browserSync = require('browser-sync');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');


// keep a count of the times a task refires
var scriptsCount = 0;
var dependencies = [];

gulp.task('sass', function () {
    gulp.src('./style/style.scss')
        .pipe(sass({
            includePaths: ['node_modules'],
            importer: tildeImporter
        }).on('error', sass.logError))
        .pipe(gulp.dest('./'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('scripts', function() {
    bundleApp(false);
});

gulp.task('browser-sync', function() {
    browserSync.init([".**/*.php", "./*.css", "assets/js/*.js"], {
        proxy: "applicant-website.test"
    });
});

gulp.task('default', ['sass', 'browser-sync', 'scripts'], function () {
    gulp.watch("style/*.scss", ['sass']);
    gulp.watch("style/*/*.scss", ['sass']);
    gulp.watch("style/*/*/*.scss", ['sass']);
    gulp.watch("assets/js/*.js", ['scripts']);
});

function bundleApp(isProduction) {
    scriptsCount++;
    // Browserify will bundle all our js files together in to one and will let
    // us use modules in the front end.
    var appBundler = browserify({
        entries: './assets/js/main.js',
        debug: true
    })

    // If it's not for production, a separate vendors.js file will be created
    // the first time gulp is run so that we don't have to rebundle things like
    // react everytime there's a change in the js file
    if (!isProduction && scriptsCount === 1){
        // create vendors.js for dev environment.
        browserify({
            require: dependencies,
            debug: true
        })
            .bundle()
            .on('error', gutil.log)
            .pipe(source('vendors.js'))
            .pipe(gulp.dest('./dist/js/'));
    }
    if (!isProduction){
        // make the dependencies external so they dont get bundled by the
        // app bundler. Dependencies are already bundled in vendor.js for
        // development environments.
        dependencies.forEach(function(dep){
            appBundler.external(dep);
        })
    }

    appBundler
    // transform ES6 and JSX to ES5 with babelify
        .transform("babelify", {presets: ["es2015"]})
        .bundle()
        .on('error',gutil.log)
        .pipe(source('main.js'))
        .pipe(gulp.dest('./dist/js/'));
}

