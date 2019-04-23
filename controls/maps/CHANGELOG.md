<!-- markdownlint-disable MD010 -->

<!-- markdownlint-disable MD030 -->

<!-- markdownlint-disable MD004 -->

# Changelog

## [Unreleased]

## 17.1.42 (2019-04-23)

### Maps

#### Bug Fixes

- #I233129 – The issue in data label rendering, if you resize the map by setting the "intersectionAction" property to 'hide' has been fixed.
- #I233127 - When selecting the new shape, the border for old shape is not removed issue has been fixed.
- #I233127 – The issue of border width changing, when zooming the map has been fixed.

## 17.1.41 (2019-04-16)

### Maps

#### Bug Fixes

- #F143717 - The issue "When setting high zoom factor to OpenStreetMap, sub layer is not placed properly" has been fixed".

## 17.1.32-beta (2019-03-13)

### Maps

#### Bug Fixes

- Now, the border style is applied properly to the shapes when performing selection.

## 16.4.55 (2019-02-27)

### Maps

#### Bug Fixes

- Changed the OSM and Bing maps URL from http to https.

## 16.4.53 (2019-02-13)

### Maps

#### Bug Fixes

- Padding issue for OSM type layers resolved now.

## 16.4.40-beta (2018-12-10)

### Maps

#### New Features

- Support has been added for desaturation color mapping.
- Support has been added to hide specific legend items and bind legend text from data source.
- Support has been added for highlighting or selecting the legend items along with shapes.
- Support has been added to specify multiple fields in the data source for **shapePropertyPath**.
- Events has been added for zoom-in and zoom-out.

## 16.3.33 (2018-11-20)

### Maps

#### Bug Fixes

- Now map is rendering properly in universal applications
- Now panning works properly without freezing

## 16.3.22 (2018-09-25)

### Maps

#### Bug Fixes

- Now the data labels are rendering properly with numeric values.

## 16.3.17 (2018-09-12)

### Maps

#### Breaking Changes

- The maps tooltip has been replaced with `EJ2 SVG Tooltip`, so now it is mandatory to include `ej2-svg-base.umd.min.js` in system.js configuration if you are using system.js module loader. Update the system.js configuration while using this version and above.

#### Bug Fixes

- Tooltip is now working properly for marker in OSM map.

## 16.2.49 (2018-08-21)

### Maps

#### Bug Fixes

- Shape selection is now working fine with touch events

## 16.2.45 (2018-07-17)

### Maps

#### Bug Fixes

- Marker click event is now working fine with OSM layer

## 16.2.44 (2018-07-10)

### Maps

#### Bug Fixes

- Bing map type is changed as AerialWithLabels and now it is rendering properly with labels.

## 16.2.41 (2018-06-25)

### Maps

#### New Features

- Support has been added for animating the shapes on zooming.
- Support has been added to trim the maps title, when it exceeds the available width.
- Support had been provided for printing and exporting the maps.
- Support has been provided for printing.

## 16.1.24 (2018-02-22)

### Maps

The Maps control is used to visualize the geographical data. It is used to represent the statistical data of a particular geographical area on Earth, with user interactivity and provides various customizing options. All the map elements are rendered using Scalable Vector Graphics (SVG).

- **Layers** - Map is maintained through layers and it can accommodate one or more layers.
- **GeoJSON Data Input** - Supports GeoJSON data, which allows you to plot your own shapes in the maps.
- **Map Providers** - Supports map providers such as Bing and OpenStreetMap that can be added to any layers.
- **Projection** - Supports 6 types of map projections.
- **Marker** - Supports 10 types of marker shapes and also takes custom HTML element.
- **Bubbles** - Supports 2 types of bubbles such as Circle and Square.
- **Legend** - Supports legend which is useful in providing additional information about shapes, bubbles and markers with paging and customization options.
- **Data Labels** - Supports data label to provide additional information about the shapes.
- **Navigation Lines** - Lines can be rendered between various points in map.
- **Annotations** - Supports placing any HTML element on desired location in the map.
- **User interaction** - Supports interactive features like zooming, panning, tooltip, highlight, selection and interactive legend.