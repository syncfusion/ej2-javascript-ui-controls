<!-- markdownlint-disable MD010 -->

<!-- markdownlint-disable MD030 -->

<!-- markdownlint-disable MD004 -->

# Changelog

## [Unreleased]

## 16.3.32 (2018-11-15)

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