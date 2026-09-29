# Babar

## CLI bar charts for node.js

Babar is a simple node.js library to draw bar charts in your console.

![Sample](img/sample.png)

While it isn't an advanced charting library, it can be useful to get a rought idea of:

* whether some data is random or not
* whether some data is linear, exponential, etc ...

### Features:

* easy to use
* lightweight (~100 lines of code)
* color output
* ASCII output
* automatically bucketizes values (currently only averages values in a bucket)
* MIT license

### Limitations:

* limited options
* only bar charts
* only one data set per graph
* limited accuracy
* only numerical labels
* only linear axes

## Installation

```bash
npm install babar
```

## Usage

Babar exposes a function whose signature expects at least an array of points, where a point is an array of two values `[x, y]`. It returns a string representation of the data which can be output to your console.

```js
var babar = require('babar');
console.log(babar([[0, 1], [1, 5], [2, 5], [3, 1], [4, 6]]));
```

While it does its best to render the data automatically, you can also pass along some options.

```js
var babar = require('babar');

console.log(babar([[0, 1], [1, 5], [2, 5], [3, 1], [4, 6]], {
  color: 'green',
  width: 40,
  height: 10,
  maxY: 10,
  yFractions: 1
}));
```

## Options

* **caption**: specify a caption to display over the bar chart
* **color="cyan"**: specify a color ('yellow', 'cyan', 'white', 'magenta', 'green', 'red', 'grey', 'blue', or 'ascii')
* **grid="black"**: specify a color ('yellow', 'cyan', 'white', 'magenta', 'green', 'red', 'grey', 'blue')
* **width=80**: output will fit in specified width
* **height=15**: output will fit in specified height
* **xFractions**: number of fractions for x labels, does its best by default
* **yFractions**: number of fractions for y labels, does its best by default
* **minX**: minimum x value for x axle
* **maxX**: maximum x value for x axle
* **minY**: minimum y value for y axle (negative values not supported yet)
* **maxY**: maximum y value for y axle

## License

(The MIT License)

Copyright (c) 2013 Stephan Florquin

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
