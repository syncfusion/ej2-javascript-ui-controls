Gulp JSHint XML File Reporter
=============================
[![Build Status](https://travis-ci.org/lourenzo/gulp-jshint-xml-file-reporter.svg)](https://travis-ci.org/lourenzo/gulp-jshint-xml-file-reporter)

Information
-----------

<table>
    <tr>
        <td>Package</td>
        <td>gulp-jshint-xml-file-reporter</td>
    </tr>
    <tr>
        <td>Description</td>
        <td>
            A JSHint reporter to be used by `gulp-jshint` that will provide a jslint.xml file that can be used by CI tools as jenkins.
        </td>
    </tr>
    <tr>
        <td>Node Version</td>
        <td>>= 0.4</td>
    </tr>
</table>

Install
-------

`npm install gulp-jshint-xml-file-reporter --save-dev`


Usage
-----

```javascript
var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    jshintXMLReporter = require('gulp-jshint-xml-file-reporter');

gulp.task('lint', function () {
    return gulp.src('./**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(jshintXMLReporter))
        .on('end', jshintXMLReporter.writeFile({
            format: 'checkstyle',
            filePath: './jshint.xml'
        }));
});
```

Options
-------

```javascript
{
    format: String // (checkstyle | jslint | junit) - defaults to checkstyle
    filePath: String // Path to write a file - defaults to jshint.xml
    alwaysReport: Boolean // Will write a report file even if there are
                          // no failing tests - defaults to false
}
```

Release History
---------------
- 2015-03-13    `0.5.0` - Added option to generate empty files
- 2015-02-23    `0.4.0` - Renamed jslint_xml formater to jslint
- 2015-02-23    `0.3.4` - Added error messaging to warn the user when an emitter does not exist
- 2015-02-11    `0.3.3` - Added JUnit Emitter


Inspired by:
------------

* [Gulp JSHint File Reporter](https://github.com/spenceralger/gulp-jshint-file-reporter)
* [JSHint's jslint_xml reporter](https://github.com/jshint/jshint/blob/master/src/reporters/jslint_xml.js)
* [JSHint checkstyle reporter](https://github.com/mila-labs/jshint-checkstyle-file-reporter)

