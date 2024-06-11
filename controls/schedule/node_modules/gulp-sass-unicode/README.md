# gulp-sass-unicode
> Replace 'content' unicode after sass compile

## Usage

First, install `gulp-sass-unicode` as a development dependency:

```shell
npm install --save-dev gulp-sass-unicode
```

Then, add it to your `gulpfile.js`:

```javascript
var sass = require('gulp-sass');
var sassUnicode = require('gulp-sass-unicode');

gulp.task('sass2css', function(){
  gulp.src(['style.scss'])
    .pipe(sass())
    .pipe(sassUnicode())
    .pipe(gulp.dest( "css/" ));
});
```

## What it does?

For example, we have ``style.scss``:

```css
$testContent: "\f26e";

#test{
  content:  $testContent;
}
```

And gulp task:
```javascript
var sass = require('gulp-sass');

gulp.task('SimpleSASS', function(){
  gulp.src(['style.scss'])
    .pipe(sass())
    .pipe(gulp.dest( "css/" ));
});
```
After run gulp task ``SimpleSASS``, in file ``css/style.css`` will be next:
```css
@charset "UTF-8";
#test {
  content: "";
}
```
But, if we add ``gulp-sass-unicode`` (see "Usage"), file ``css/style.css`` will have this:
```css
@charset "UTF-8";
#test {
  content: "\f26e";
}
```