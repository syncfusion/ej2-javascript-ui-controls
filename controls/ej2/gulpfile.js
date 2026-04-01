'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const ts = require('gulp-typescript');

/**
 * Compile TypeScript files
 */
function scripts() {
    const tsProject = ts.createProject('tsconfig.json', {
        typescript: require('typescript')
    });

    const tsResult = gulp
        .src([
            './**/*.ts',
            './**/*.tsx',
            '!./node_modules/**/*.ts',
            '!./node_modules/**/*.tsx'
        ], { base: '.' })
            .pipe(tsProject());
            return tsResult.js.pipe(gulp.dest('./'));
        }

    /**
     * Compile SCSS files
     */
    function styles() {
        return gulp
            .src([
                './**/*.scss',
                '!./node_modules/**/*.scss'
            ], { base: './' })
            .pipe(
                sass({
                    outputStyle: 'expanded',
                    includePaths: './node_modules/@syncfusion/'
                    }).on('error', sass.logError)
                )
            .pipe(gulp.dest('.'));
        }

    /**
    * Build task
    */
    const build = gulp.series(scripts, styles);
    exports.scripts = scripts;
    exports.styles = styles;
    exports.build = build;
    exports.default = build;
