PNGjs-Image
===========

JavaScript-based PNG image encoder, decoder, and manipulator

[![Build Status](https://img.shields.io/travis/yahoo/pngjs-image.svg)](http://travis-ci.org/yahoo/pngjs-image)
[![Coveralls Coverage](https://img.shields.io/coveralls/yahoo/pngjs-image.svg)](https://coveralls.io/r/yahoo/pngjs-image)
[![Code Climate Grade](https://img.shields.io/codeclimate/github/yahoo/pngjs-image.svg)](https://codeclimate.com/github/yahoo/pngjs-image)

[![NPM version](https://badge.fury.io/js/pngjs-image.svg)](https://www.npmjs.com/package/pngjs-image)
[![NPM License](https://img.shields.io/npm/l/pngjs-image.svg)](https://www.npmjs.com/package/pngjs-image)

[![NPM](https://nodei.co/npm/pngjs-image.png?downloads=true&stars=true)](https://www.npmjs.com/package/pngjs-image)
[![NPM](https://nodei.co/npm-dl/pngjs-image.png?months=3&height=2)](https://www.npmjs.com/package/pngjs-image)

[![Coverage Report](https://img.shields.io/badge/Coverage_Report-Available-blue.svg)](http://yahoo.github.io/pngjs-image/coverage/lcov-report/)
[![API Documentation](https://img.shields.io/badge/API_Documentation-Available-blue.svg)](http://yahoo.github.io/pngjs-image/docs/)

[![Gitter Support](https://img.shields.io/badge/Support-Gitter_IM-yellow.svg)](https://gitter.im/preceptorjs/support)

**Table of Contents**
* [Installation](#installation)
* [Usage](#usage)
    * [Static-Methods](#static-methods)
    * [Instance-Methods](#instance-methods)
        * [Pixel manipulation](#pixel-manipulation)
        * [Pixel conversion](#pixel-conversion)
    * [Filters](#filters)
* [API-Documentation](#api-documentation)
* [Tests](#tests)
* [Third-party libraries](#third-party-libraries)
* [License](#license)


##Installation

Install this module with the following command:
```shell
npm install pngjs-image
```

Add the module to your ```package.json``` dependencies:
```shell
npm install --save pngjs-image
```
Add the module to your ```package.json``` dev-dependencies:
```shell
npm install --save-dev pngjs-image
```

Require the module in your source-code:
```javascript
var PNGImage = require('pngjs-image');
```

##Usage

**Example:** Creating a new image
```javascript
var image = PNGImage.createImage(100, 300);

// Get width and height
console.log(image.getWidth());
console.log(image.getHeight());

// Set a pixel at (20, 30) with red, having an alpha value of 100 (half-transparent)
image.setAt(20, 30, { red:255, green:0, blue:0, alpha:100 });

// Get index of coordinate in the image buffer
var index = image.getIndex(20, 30);

// Print the red color value
console.log(image.getRed(index));

// Get low level image object with buffer from the 'pngjs' package
var pngjs = image.getImage();

image.writeImage('path/to/file', function (err) {
    if (err) throw err;
    console.log('Written to the file');
});
```

**Example:** Loading an image
```javascript
PNGImage.readImage('path/to/file', function (err, image) {
    if (err) throw err;

    // Get width and height
    console.log(image.getWidth());
    console.log(image.getHeight());

    // Set a pixel at (20, 30) with red, having an alpha value of 100 (half-transparent)
    image.setAt(20, 30, { red:255, green:0, blue:0, alpha:100 });
});
```

**Example:** Loading an image from an url
```javascript
PNGImage.readImage('https://s.yimg.com/rz/l/yahoo_en-US_f_p_142x37_2x.png', function (err, image) {
    if (err) throw err;

    // The image is in the 'image' variable if everything went well
});
```

###Static-Methods
* ```<PNGImage> = PNGImage.addFilter(key, fn)``` Adds the ```fn``` filter with identifier ```key``` to the filter-list
* ```<PNGImage> = PNGImage.createImage(width, height)``` Creates an image with the given size
* ```<PNGImage> = PNGImage.copyImage(image)``` Copies an image into a new container
* ```PNGImage.readImage(path, fn)``` Loads an image from the file or url, calling the ```fn``` function when done
* ```PNGImage.loadImage(blob, fn)``` Loads an image from memory, calling the ```fn``` function when done

###Instance-Methods
* ```<pngjs> = image.getImage()``` Gets the ```pngjs``` instance
* ```<Buffer> = image.getBlob()``` Gets the data as a buffer object
* ```<int> = image.getWidth()``` Gets the width of the image
* ```<int> = image.getHeight()``` Gets the height of the image
* ```image.clip(x, y, width, height)``` Clips the current image; the dimensions have to be smaller than the original image
* ```image.fillRect(x, y, width, height, color)``` Fills the rectangle with the supplied color
* ```image.applyFilters(filters, returnResult)``` Applies a list of filters to the image
* ```<int> = image.getIndex(x, y)``` Converts the x and y coordinates to the sequential index of the image buffer
* ```image.writeImage(path, fn)``` Writes the image to the filesystem and calling the ```fn``` function when done
* ```image.toBlob(fn)``` Exports data to a buffer and calling the ```fn``` function when done

####Pixel manipulation
* ```<uint32> = image.getAtIndex(idx)``` Gets complete 32-bit pixel at index ```idx```
* ```<uint32> = image.getAt(x, y)``` Gets complete 32-bit pixel at the x and y coordinate
* ```<uint32> = image.getPixel(x, y)``` Gets complete 32-bit pixel at the x and y coordinate
* ```image.setAtIndex(idx, color)``` Sets a specific color at the index. A color left-off will not be modified.
* ```image.setAt(x, y, color)``` Sets a specific color at the x and y coordinate. A color left-off will not be modified.
* ```image.setPixel(x, y, color)``` Sets a specific color at the x and y coordinate. A color left-off will not be modified.
* ```<uint32> = image.getColorAtIndex(idx)``` Gets the color components of the pixel at index ```idx```
* ```<uint32> = image.getColor(x, y)``` Gets the color components of the pixel at the x and y coordinate
* ```<uint8> = image.getRed(idx)``` Gets the red intensity at an index
* ```image.setRed(idx, value, opacity)``` Sets the red intensity at an index
* ```<uint8> = image.getGreen(idx)``` Gets the green intensity at an index
* ```image.setGreen(idx, value, opacity)``` Sets the green intensity at an index
* ```<uint8> = image.getBlue(idx)``` Gets the blue intensity at an index
* ```image.setBlue(idx, value, opacity)``` Sets the blue intensity at an index
* ```<uint8> = image.getAlpha(idx)``` Gets the alpha intensity at an index
* ```image.setAlpha(idx, value, opacity)``` Sets the alpha intensity at an index

####Pixel conversion
* ```<uint32> = image.getBlurPixelAt(idx, funcName)``` Gets the blurred color of a pixel at index ```idx```
* ```<uint32> = image.getYIQAtIndex(idx)``` Gets the YIQ-value of a pixel at index ```idx```
* ```<uint32> = image.getYIQ(x, y)``` Gets the YIQ-value of a pixel at the x and y coordinate
* ```<uint32> = image.getLumaAtIndex(idx)``` Gets the luma of a pixel at index ```idx```
* ```<uint32> = image.getLuma(x, y)``` Gets the luma of a pixel at the x and y coordinate
* ```<uint32> = image.getSepiaAtIndex(idx)``` Gets the sepia-color of a pixel at index ```idx```
* ```<uint32> = image.getSepia(x, y)``` Gets the sepia-color of a pixel at the x and y coordinate
* ```<uint32> = image.getLuminosityAtIndex(idx)``` Gets the luminosity of a pixel at index ```idx```
* ```<uint32> = image.getLuminosity(x, y)``` Gets the luminosity of a pixel at the x and y coordinate
* ```<uint32> = image.getLightnessAtIndex(idx)``` Gets the lightness of a pixel at index ```idx```
* ```<uint32> = image.getLightness(x, y)``` Gets the lightness of a pixel at the x and y coordinate
* ```<uint32> = image.getGrayScaleAtIndex(idx)``` Gets the grayscale-value of a pixel at index ```idx```
* ```<uint32> = image.getGrayScale(x, y)``` Gets the grayscale-value of a pixel at the x and y coordinate

###Filters
Following filters can be applied to an image:
* blur
* grayScale
* lightness
* luma
* luminosity
* sepia

##API-Documentation

Generate the documentation with following command:
```shell
npm run docs
```
The documentation will be generated in the ```docs``` folder of the module root.

##Tests

Run the tests with the following command:
```shell
npm run test
```
The code-coverage will be written to the ```coverage``` folder in the module root.

##Third-party libraries

The following third-party libraries are used by this module:

###Dependencies
* pako: https://github.com/nodeca/pako
* pngjs: https://github.com/niegowski/node-pngjs
* stream-buffers: https://github.com/samcday/node-stream-buffer
* underscore: http://underscorejs.org
* request: https://github.com/request/request

###Dev-Dependencies
* chai: http://chaijs.com
* coveralls: https://github.com/cainus/node-coveralls
* codeclimate-test-reporter: https://github.com/codeclimate/javascript-test-reporter
* istanbul: https://github.com/gotwarlost/istanbul
* mocha: https://github.com/visionmedia/mocha
* sinon: http://sinonjs.org
* sinon-chai: https://github.com/domenic/sinon-chai
* yuidocjs: https://github.com/yui/yuidoc

##License

The MIT License

Copyright 2014-2015 Yahoo Inc.
