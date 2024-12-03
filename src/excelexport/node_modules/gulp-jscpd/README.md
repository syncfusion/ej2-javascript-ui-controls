gulp-jscpd
====================

[![Maintenance Status][status-image]][status-url] [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][deps-image]][deps-url] [![Coverage Status][coverage-image]][coverage-url] [![Code Climate][climate-image]][climate-url]

> Gulp plugin for the copy/paste detector [jscpd](https://github.com/kucherenko/jscpd).

![](http://i.imgur.com/koeLzYb.png)

# Installation

    $ npm install gulp-jscpd

# Usage

```javascript
var gulp  = require('gulp');
var jscpd = require('gulp-jscpd');

gulp.task('jscpd', function() {
  return gulp.src('**/*.js')
    .pipe(jscpd({
      'min-lines': 10,
      verbose    : true
    }));
});
```

## Options

### min-lines

Type: `Number`

Min size of duplication in code lines, default to `5`.

### min-tokens

Type: `Number`

Min size of duplication in code tokens, default to `70`.

### reporter

Type: `String`

Reporter name or path to the [custom reporter](https://github.com/kucherenko/jscpd#reporters), default to `xml`.

### languages

Type: `Array`

List of languages which scan for duplicates, default to `['javascript', 'typescript', 'jsx', 'haxe', 'coffeescript', 'ruby', 'php', 'python', 'css', 'java', 'csharp', 'go', 'clike', 'htmlmixed']`.

### output

Type: `String`

Path to report XML file, default to `null` (no report file).

### verbose

Type: `Boolean`

Show full info about copies, default to `false`.

### debug

Type: `Boolean`

Show debug information (options list and selected files), default to `false`.

### silent

Type: `Boolean`

Don't print a report summary, default to `false`.

### failOnError

Type: `Boolean`

Don't throw an error in case of duplicated occurrences (useful for CI), default to `true`.

# Tests

Run tests using mocha

    $ npm test

# Code Coverage

Output a code coverage report in coverage.html

    $ npm run coverage

# Code Style

Check the code style with JSCS

    $ npm run checkstyle

# License

gulp-jscpd is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).

[npm-url]: https://npmjs.org/package/gulp-jscpd
[npm-image]: http://img.shields.io/npm/v/gulp-jscpd.svg?style=flat

[travis-url]: https://travis-ci.org/yannickcr/gulp-jscpd
[travis-image]: http://img.shields.io/travis/yannickcr/gulp-jscpd/master.svg?style=flat

[deps-url]: https://gemnasium.com/yannickcr/gulp-jscpd
[deps-image]: http://img.shields.io/gemnasium/yannickcr/gulp-jscpd.svg?style=flat

[coverage-url]: https://coveralls.io/r/yannickcr/gulp-jscpd?branch=master
[coverage-image]: http://img.shields.io/coveralls/yannickcr/gulp-jscpd/master.svg?style=flat

[climate-url]: https://codeclimate.com/github/yannickcr/gulp-jscpd
[climate-image]: http://img.shields.io/codeclimate/github/yannickcr/gulp-jscpd.svg?style=flat

[status-url]: https://github.com/yannickcr/gulp-jscpd/pulse
[status-image]: http://img.shields.io/badge/status-maintained-brightgreen.svg?style=flat
