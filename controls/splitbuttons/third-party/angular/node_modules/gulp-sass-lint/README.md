# Gulp Sass Lint [![npm version](https://badge.fury.io/js/gulp-sass-lint.svg)](http://badge.fury.io/js/gulp-sass-lint)

[Gulp](http://gulpjs.com/) plugin for [Sass Lint](https://github.com/sasstools/sass-lint).

## Install

```
npm install gulp-sass-lint --save-dev
```

## Usage

`gulpfile.js`

```javascript
'use strict';

var gulp = require('gulp'),
    sassLint = require('gulp-sass-lint');

gulp.task('default', function () {
  return gulp.src('sass/**/*.s+(a|c)ss')
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
});
```

## API

### sassLint(options)

You can pass an object of options to configure gulp-sass-lint to your specific projects needs the options are listed below.

#### options.options

You can find out more about the specific SassLint options from the [SassLint Documentation](https://github.com/sasstools/sass-lint/tree/develop/docs/options)

```javascript
{
  options: {
    formatter: 'stylish',
    'merge-default-rules': false
  }
}
```

By default SassLint includes it's own configuration file, if you provide one it attempts to merge everything except for the files section below. If you pass options directly into the plugin they take precedence. The order can be visualised below with the SassLint config being the base.

`options > config file > SassLint default included config`

You can disable this behaviour by setting `merge-default-rules` to false within the `options.options` object that you pass to `gulp-sass-lint` or you can include it in your config file options that you can pass into `gulp-sass-lint` with `options.configFile`.

More info and examples can be found within the SassLint [docs](https://github.com/sasstools/sass-lint/blob/master/docs/options/merge-default-rules.md)

#### options.files


Type: `Object`

Within the files object you can specify a glob pattern as a string or an array of glob pattern for both the `include` and `ignore` options. Please note that your include option will currently be ignored as you should be passing the glob patterns / file paths to be linted directly to gulp `gulp.src('sass/**/*.s+(a|c)ss')`. The ignore option however will still be respected if you'd rather specify them in your config rather than in the `gulp.src` method.

```javascript
{
  files: {
    include: '**/*.scss', // This will be ignored by gulp-sass-lint
    ignore: 'test/**/*.scss' // This will still be respected and read
  }
}
```

#### options.rules

Type: `Object`

You can define which rules you would like to use here and set a severity too. For more information see how to [configure](https://github.com/sasstools/sass-lint/tree/master#rules) and also the SassLint [rules](https://github.com/sasstools/sass-lint/tree/master/docs/rules)

```javascript
{
  rules: {
    'no-ids': 0, // Severity 0 (disabled)
    'no-mergeable-selectors': 1, // Severity 1 (warning)
    'hex-length': [
      2, // Severity 2 (error)
      {
        'style': 'long'
      }
    ]
  }
}
```

#### options.configFile

You can pass the path to a custom config file via the `configFile` option. The path will be relative to where you're running gulp from.

```javascript
{
  configFile: 'app/config/.my-config.yml'
}
```

### Example

The following highlights all of the above options in use

```javascript

'use strict';

var gulp = require('gulp'),
    sassLint = require('gulp-sass-lint');

gulp.task('default', function () {
  return gulp.src('sass/**/*.s+(a|c)ss')
    .pipe(sassLint({
      options: {
        formatter: 'stylish',
        'merge-default-rules': false
      },
      files: {ignore: '**/*.scss'},
      rules: {
        'no-ids': 1,
        'no-mergeable-selectors': 0
      },
      configFile: 'config/other/.sass-lint.yml'
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
});

```
---

### sassLint.format(writable)

Formats the results dependent on your config file or the options you provided to the sassLint task above. The default format is `stylish` but you can choose any of the others that SassLint provides, see the [docs](https://github.com/sasstools/sass-lint/blob/master/docs/options/formatter.md).

You can also choose to output to a file from within the options you provide or your config file. See the [output-file docs](https://github.com/sasstools/sass-lint/blob/master/docs/options/output-file.md)

```javascript
gulp.task('lint_sass_jenkins', function () {
    var file = fs.createWriteStream('reports/lint_sass.xml');
    var stream = gulp.src('public/sass/**/*.scss')
        .pipe(sassLint({
            options: {
                configFile: '.sass-lint.yml',
                formatter: 'checkstyle'
            }
        }))
        .pipe(sassLint.format(file));
    stream.on('finish', function() {
        file.end();
    });
    return stream;
});
```

---

### sassLint.failOnError()

Fails the task and emits a gulp error when all files have been linted if an error has been detected (rules set to severity 2).
