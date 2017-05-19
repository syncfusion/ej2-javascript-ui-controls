'use strict';

var gulp = require('gulp');

/**
 * Build ts and scss files
 */
gulp.task('build', ['scripts', 'styles']);

/**
 * Compile ts files
 */
gulp.task('scripts', function() {
    var ts = require('gulp-typescript');
    var tsProject = ts.createProject('tsconfig.json', { typescript: require('typescript') });

    var tsResult = gulp.src(['./**/*.ts', '!./node_modules/**/*.ts'], { base: '.' })
        .pipe(tsProject());
    tsResult.js.pipe(gulp.dest('./'));
});

/**
 * Compile scss files
 */
gulp.task('styles', function() {
    var sass = require('gulp-sass');
    return gulp.src(['./**/*.scss', '!./node_modules/**/*.scss'], { base: './' })
        .pipe(sass({
            outputStyle: 'expanded',
            includePaths: './node_modules/@syncfusion/'
        }))
        .pipe(gulp.dest('.'));
});