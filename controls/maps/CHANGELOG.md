<!-- markdownlint-disable MD010 -->

<!-- markdownlint-disable MD030 -->

<!-- markdownlint-disable MD004 -->

# Changelog

## [Unreleased]

## 17.2.40 (2019-08-06)

### Maps

#### Bug Fixes

- `#I243271` - The issue with changing text in our component when the text argument is changed in the datalabelRendering event has been fixed.
- `#I243499` - The issue with arrow option in the navigation line has been fixed.
- `#I238404` - The issue with bubble color and size when using point type shape data has been fixed.

## 17.2.39 (2019-07-30)

### Maps

#### Bug Fixes

- `#I240804` - The issue with dynamically updating the zoom factor along with the initial case of the zoom factor  has been fixed.

- `#I240836` - The issue with border that was not applied for marker highlight and selection has been fixed.

## 17.2.36 (2019-07-24)

### Maps

#### Bug Fixes

- `#I240833` - Some labels disappear when you change "colorMapping" and refresh the map issue has been fixed
- `I240804` - The issue with dynamically updating the zoom factor has been fixed
- `I241873` - The issue with zooming the map component with a single click has been fixed

## 17.2.35 (2019-07-17)

### Maps

#### Bug Fixes

- `#I240835` - Highlight border thickness on the shape is huge when hovering on the legend item, it does not set as we given in code issue has been fixed
- `#I240836` - Marker highlight and selection settings do not make a difference issue has been fixed
- `#I240834` - Interactive legend is not working while changing data source issue has been fixed.

## 17.2.34 (2019-07-11)

### Maps

#### Bug Fixes

- `#F143717` - Zooming toolbar position misalign problem that occurs when there are multiple elements in DOM has been fixed
- `#I238404` - The issue that occurs when rendering bubble for point type Shape Data has been fixed
- `#I238839` - The console error that occurs when mouse leaves from the maps Shapes with legend hide option has been resolved

## 17.2.28-beta (2019-06-27)

### Maps

#### New Features

- `#I227277` - Support has been provided to get geo location when clicking on maps.
- `#I217458` - Support has been provided to hide and cluster a marker when it intersects with other markers.

## 17.1.51 (2019-06-11)

### Maps

#### Bug Fixes

- `#I237116` - The issue with default highlight and selection fill color has been resolved.

## 17.1.50 (2019-06-04)

### Maps

#### Bug Fixes

- `#I237138` - The issue with maintaining zoom factor when the mouse wheel and pinch zoom on maps with call "refresh()" method has been fixed.
- `#I237041` - The issue with the re-rendering of the second sub-layer on zoom or panning has been resolved.

### Maps

#### Bug Fixes

- `#I237041` - The issue in the sublayers are not re-rendered when zooming or panning is fixed.

## 17.1.48 (2019-05-21)

### Maps

#### New Features

- `#I233127` - The issue with recalculating the data labels when zooming the maps has been fixed.

## 17.1.44 (2019-05-07)

### Maps

#### Bug Fixes

- `#I234578` - The issue with rendering data label and tooltip when the layers type is set to 'Sublayer' has been fixed.
- `#I234578` - The issue with returning wrong highlight opacity to shapes in maps when highlighting the legend has been fixed.

## 17.1.43 (2019-04-30)

### Maps

#### Bug Fixes

- `#F143717` - The div containing the maps component overlaps the div with inputs above it issue has                 been fixed
- `#I233127` - The issue with the last interacted scaling is not maintained when refreshing the browser
             with the 'enablePersistence' API as true has been fixed.

## 17.1.42 (2019-04-23)

### Maps

#### Bug Fixes

- `#I233129` – The issue in data label rendering, if you resize the map by setting the "intersectionAction" property to 'hide' has been fixed.
- `#I233127` - When selecting the new shape, the border for old shape is not removed issue has been fixed.
- `#I233127` – The issue of border width changing, when zooming the map has been fixed.

## 17.1.41 (2019-04-16)

### Maps

#### Bug Fixes

- `#F143717` - The issue "When setting high zoom factor to OpenStreetMap, sub layer is not placed properly" has been fixed".

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