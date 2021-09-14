<!-- markdownlint-disable MD004 -->

# Changelog

## [Unreleased]

## 19.2.62 (2021-09-14)

### CircularGauge

#### Bug Fixes

- `#I340597` - Tooltip template will now render properly when the Circular Gauge size is smaller than the template's width.

## 19.2.57 (2021-08-24)

### CircularGauge

#### Bug Fixes

- `#F168138` - When the axis' maximum and minimum values are the same, the axis will not be rendered.

## 19.2.49 (2021-07-27)

### CircularGauge

#### Bug Fixes

- `#I334929` - When the `moveToCenter` property is enabled, the Circular Gauge will now be in the centre, with a `startAngle` of **241** to **269** and an `endAngle` of **150**.

## 19.2.47 (2021-07-13)

### CircularGauge

#### Bug Fixes

- `#I333600` - No script errors are thrown when the same start and end values are set in the range using the `setRangeValue()` method.

## 19.2.46 (2021-07-06)

### CircularGauge

#### Bug Fixes

- `#I333600` - No script errors are thrown when the same start and end values are set in the range using the `setRangeValue()` method.
- `#I333600` - When the `start` and `end` values of the range are set to the same value, the range's path will be correct now.

## 19.1.58 (2021-04-27)

### CircularGauge

#### Bug Fixes

- `#324756` - If numeric content is set, the text style of the annotation content will now be applied correctly.

## 19.1.55 (2021-04-06)

### CircularGauge

#### Bug Fixes

- `#319856` - The axis with same start and end angle will now render properly.

## 19.1.54 (2021-03-30)

### CircularGauge

#### New Features

- `#290958` - When `startValue` and `endValue`properties are not set, the linear gradient will follow the circular path in the ranges.

## 18.4.35 (2021-01-19)

### CircularGauge

#### Bug Fixes

- `#293761` - The range with different start and end width will now render properly.

## 18.4.34 (2021-01-12)

### CircularGauge

#### Bug Fixes

- `#308123` - Circular gauge will now render properly when angles are set.

## 18.3.51 (2020-11-24)

### CircularGauge

#### Bug Fixes

- Circular gauge will now be destroyed properly.

## 18.3.50 (2020-11-17)

### CircularGauge

#### Bug Fixes

- The script error will not be thrown now when the circular gauge is resized.

## 18.3.44 (2020-10-27)

### CircularGauge

#### New Features

- `#292493` - `allowMargin` property is exposed to reduce the white space around the circular gauge.

#### Bug Fixes

- `#298451` - Width of the circular gauge will now set properly during responsiveness.

## 18.3.35 (2020-10-01)

### CircularGauge

#### Bug Fixes

- `#289787` - Animation of the pointer will now work properly when the axis is in the anticlockwise direction.

## 18.2.44 (2020-07-07)

### CircularGauge

#### New Features

- The gradient color support for the ranges and the pointers is now available in the circular gauge.

## 18.1.36-beta (2020-03-19)

### CircularGauge

#### Bug Fixes

- `#256184` - The unwanted div element appended in the DOM is removed now.

## 17.3.9-beta (2019-09-20)

### CircularGauge

#### New Features

- `#I218689` - An option has been provided to hide a label when it intersects with other labels.
- `#I229216` - Tooltip support has been provided for circular gauge annotation.
- `#I238868` - Tooltip support has been provided for circular gauge ranges.
- `#I210142` - Legend support has been provided for circular gauge ranges.

## 17.2.36 (2019-07-24)

### CircularGauge

#### Bug Fixes

- `#I241842` - The issue with providing the content "a" in the string template when having anchor tag in an application has been fixed.

## 17.2.34 (2019-07-11)

### CircularGauge

#### Bug Fixes

- `#I238300` - The issue with animation in circular gauge and flickering has been resolved.

## 17.1.50 (2019-06-04)

### CircularGauge

#### Bug Fixes

- `#I237023` - The issue with pointer animation on setting more than 80% of the pointer radius has been fixed.

## 17.1.48 (2019-05-21)

### CircularGauge

#### Bug Fixes

- `#I236468` - When drag the range bar pointer, the console error thrown is resolved now.

## 17.1.44 (2019-05-07)

### CircularGauge

#### Bug Fixes

- `#I234531` - The issue with rendering circular gauge when setting cancel argument to true in the "axisLabelRender" event has been fixed.

## 17.1.43 (2019-04-30)

### CircularGauge

#### Bug Fixes

- `#I234082` - Circular gauge tooltip is not shown in IE browser issue has been fixed.
- `#I234174` - Tooltip content width and adding a border to control container alignment issues have been fixed

## 16.4.54 (2019-02-19)

### CircularGauge

#### Bug Fixes

- Now, the gauge is rendered properly even in small size when it is moved to the center position.

## 16.4.53 (2019-02-13)

### CircularGauge

#### Bug Fixes

- Now, the range bar pointer can be dragged properly.

## 17.1.1-beta (2019-01-29)

### CircularGauge

#### New Features

- Support has been provided to round off the axis label values and tooltip text.

- Support has been provided to display the last label even if it is not in the visible range.

- An event has been provided to get or set the Circular Gauge radius dynamically.

- Provided support to assign percentage values for pointer width, ranges width and axis line width.

#### Bug Fixes

- Pointer drag in circular gauge is working fine now in touch devices.

## 16.4.47 (2019-01-16)

### CircularGauge

#### Bug Fixes

- Now, the annotation is rendered properly with multiple div elements.

## 16.4.45 (2019-01-02)

### CircularGauge

#### Bug Fixes

- When drag the range bar pointer, the console error thrown resolved now.

## 16.4.40-beta (2018-12-10)

### CircularGauge

#### New Features

- Support has been added to set gap between the ranges.
- Support has been added to calculate the radius of the gauge based on the start and end angles.

## 16.3.33 (2018-11-20)

### CircularGauge

#### Bug Fixes

- Issue with range bar pointer tooltip is resolved now.

## 16.3.32 (2018-11-13)

### CircularGauge

#### Bug Fixes

- Tooltip is rendering properly without flickering, while the circular gauge is rendered in small space.

## 16.3.30 (2018-11-01)

### CircularGauge

#### New Features

- Provided the support to tooltip rendering at mouse position for range bar pointer.

## 16.3.30 (2018-11-01)

### CircularGauge

#### New Features

- Provided support to calculate the radius of the gauge, based on the start and end angles.

#### Bug Fixes

- The range bar pointer is rendering properly now, when the axis minimum and pointer values are same.

## 16.3.17 (2018-09-12)

### CircularGauge

#### Breaking Changes

- The circular gauge tooltip has been replaced with `EJ2 SVG Tooltip`, so now it is mandatory to include `ej2-svg-base.umd.min.js` in system.js configuration if you are using system.js module loader. Update the system.js configuration while using this version and above.

## 16.2.41 (2018-06-25)

### CircularGauge

#### Bug Fixes

- Provided one way binding support for Axes properties in Angular platform.

## 16.1.24 (2018-02-22)

### Common

#### Breaking Changes

- Changed the Angular component directive prefix as `ejs-[ComponentName]`.

#### New Features

- High contrast theme support.

## 15.4.27-preview (2018-01-30)

### CircularGauge

#### Bug Fixes

 • Provided ranges startWidth and endWidth percentage support.

## 15.4.23-preview (2017-12-27)

### Common

#### New Features

• Added typing file for ES5 global scripts (dist/global/index.d.ts)

#### Breaking Changes

• Modified the module bundle file name for ES6 bundling

## 15.4.17-preview (2017-11-13)

### CircularGauge

Circular Gauge component is ideal to visualize numeric values over a circular scale. The elements
of the gauge  that are pointer, pointer cap, axis, ticks, labels, and annotation can be easily
customized.

* **Ranges** - Supports for highlighting the range values in the gauge scale.
* **Axis** - Supports to render multiple axis in the gauge.
* **Pointers** - Supports to add multiple pointers to the gauge (RangeBar, Needle, Marker, and Image).
* **Annotation** - Supports to add custom elements to the gauge by using annotation.
* **Animation** - Supports animation for the pointer.
* **Custom Label** - Supports the addition of custom label text in the required location of the gauge.
* **User Interaction** - Supports interactive features like tooltip and pointer drag and drop.
