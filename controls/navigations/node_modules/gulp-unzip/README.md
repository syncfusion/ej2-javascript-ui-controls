[![travis](https://travis-ci.org/terrierscript/gulp-unzip.svg)](https://travis-ci.org/terrierscript/gulp-unzip)
![dependencies](https://img.shields.io/david/terrierscript/gulp-unzip.svg)
![devDependencies](https://img.shields.io/david/dev/terrierscript/gulp-unzip.svg)
![Downloads per Week NPM](https://img.shields.io/npm/dw/gulp-unzip.svg)
![Open PRs](https://img.shields.io/github/issues-pr/terrierscript/gulp-unzip.svg)
![Open Issues](https://img.shields.io/github/issues-raw/terrierscript/gulp-unzip.svg)


# gulp-unzip
> gulp plugin for unzip file.

### Usage

```bash
npm install gulp-unzip --save
```

```js
var unzip = require('gulp-unzip')
gulp.task('filter_sample', function(){
  gulp.src("./download/bootstrap-3.1.1-dist.zip")
    .pipe(unzip())
    .pipe(gulp.dest('./tmp'))
})
```

### Options

#### filter

You can provide a `filter` option. It should be a function that gets an `entry` as an argument and returns `true` or `false`.

```js
var concat = require('gulp-concat')
var unzip = require('gulp-unzip')
var minimatch = require('minimatch')
gulp.task('filter_sample', function(){
  gulp.src("./download/bootstrap-3.1.1-dist.zip")
    .pipe(unzip({
      filter : function(entry){
        return minimatch(entry.path, "**/*.min.css")
      }
    }))
    .pipe(concat("bootstrap.css"))
    .pipe(gulp.dest('./tmp'))
})
```

#### keepEmpty

You can provide `true` or `false` in `keepEmpty` for whether you want to extract empty files from the archive or not. Defaults to `false`.

```js
gulp.task('filter_sample', function(){
  gulp.src("./download/bootstrap-3.1.1-dist.zip")
    .pipe(unzip({ keepEmpty : true }))
    //...
})
```

### Contributors

If you want to contribute to the project, please check de [Contribution Guidelines](CONTRIBUTING.md)

**Author**
- [terrierscript (@terrierscript)](https://github.com/terrierscript)

**Maintainers**
- [Ulises Gascón (@ulisesGascon)](https://github.com/ulisesGascon)

**Contributors**
- [Joey Cozza (@joeycozza)](https://github.com/joeycozza)
- [Joe Pettersson (@Joe8Bit)](https://github.com/Joe8Bit)
- [Erik Vold (@erikvold)](https://github.com/erikvold)
- [hami (@hami-jp)](https://github.com/hami-jp)
- [Selwyn (@Selwyn)](https://github.com/Siilwyn)
- [João Moreno (@joaomoreno)](https://github.com/joaomoreno)
- [Evan Oxfeld (@EvanOxfeld)](https://github.com/EvanOxfeld)
