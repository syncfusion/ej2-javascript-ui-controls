<!-- markdownlint-disable MD010 -->

<!-- markdownlint-disable MD030 -->

<!-- markdownlint-disable MD004 -->

# Changelog

## [Unreleased]

## 19.1.57 (2021-04-20)

### Maps

#### Bug Fixes

- `#318561` - When the `height` property is set to a percentage value, Maps can now render with proper height of the parent element.

## 19.1.56 (2021-04-13)

### Maps

#### New Features

- `#315251` - The `opacity` property for `border` in `shapeSettings` is exposed to provide opacity for the border of the shapes.

#### Bug Fixes

- `#F163539` - The data labels will now render properly when the value of `labelPath` of `dataLabelSettings` is different from the value of `shapePropertyPath` and `shapeDataPath`.

## 19.1.54 (2021-03-30)

### Maps

#### Bug Fixes

- `#312465` - When the `zoomFactor` property is set as 0 in the tile maps, it now renders properly.
- `#311273` - The `imageUrlValuePath` property now correctly renders markers as images.
- `#312865` - Markers will now render properly when they are added dynamically in the click event with "Normal" geometry type maps.
- `#317398` - `shapeSelection` method will now work properly with multi-layers on the Maps.

## 18.4.39 (2021-01-28)

### Maps

#### New Features

- `#306094` - `borderWidthValuePath` and `borderColorValuePath` properties are exposed to set border width and color to individual shapes using data source values.

#### Bug Fixes

- `#307853` - The property in the JSON for the maps shape data can now be displayed in the tooltip template.

## 18.4.30 (2020-12-17)

### Maps

#### Bug Fixes

- `#302270` - The position of the marker cluster will now render properly when the Map control is positioned in an absolute location.

## 18.3.51 (2020-11-24)

### Maps

#### Bug Fixes

- `#301355` - The balloon marker will now select properly with `initialMarkerSelection`.

## 18.3.44 (2020-10-27)

### Maps

#### Bug Fixes

- `#298697` - The font style of legend and data labels will be now set properly.

## 18.3.42 (2020-10-20)

### Maps

#### Bug Fixes

- `#292757` - `doubleClick` event will now be triggered properly.

## 18.3.40 (2020-10-13)

### Maps

#### Bug Fixes

- `#292757` - The multiple tile maps in a single page will now work properly.

## 18.3.35 (2020-10-01)

### Maps

#### New Features

`#291448` - A property `isShapeSelected` is exposed in the event arguments of the click event to specify whether the map shape is selected or not.

#### Bug Fixes

- `#F157226` - Marker clusters will now render properly when the markers are added dynamically to the maps.
- `#289864` - Hyperlinks added in the tooltip template will now be clickable in the click action.
- `#289034` - Panning will now work properly on mobile devices.
- `#287918` - Markers will now render properly when the animation duration is greater than 0.
- `#285727` - Outline for the shapes will no longer appear when clicking on it.

## 18.2.47 (2020-07-28)

### Maps

#### Bug Fixes

- `#285727` - Outline for the shapes will no longer appear when clicking on it.

## 18.2.44 (2020-07-07)

### Maps

#### New Features

- The data manager support for bubble and marker data source is now available.
- `Google` enum value is provided in `ShapeLayerType` to render the Google maps in the Maps control.
- `#280380` - `isResized` argument is exposed in the `loaded` event argument for indicating that the component is resized.

#### Bug Fixes

- `#278468` - The script errors will not be thrown when rendering the GeoJSON file with line string geometry in Maps control.
- `#280380` - The center position property will be maintained when the zooming operation is done after the reset zoom.

## 17.4.39 (2019-12-17)

### Maps

#### New Features

- `#I244108`, `#I240060`, `#I247767`, `#I250088` - Provided support to zoom the maps initially, based on the marker’s location.

- `#I248021` - Provided support to cluster and expand markers with the same latitude and longitude values.

- `#I253516` - Provided clustering support for marker templates.

- `#I255189` - Improved the `markerClusterClick` event to get the hidden cluster collection details.

- `#I242130` - Provided support to select or deselect the shapes dynamically and on initial rendering.

- `#I248172` - Provided support to show tooltip on tap/click.

- `F146103`, `F147309` - Provided support to bind the shapes and colors to the markers from the data source.

## 17.3.21 (2019-10-30)

### Maps

#### New Features

- Improved the marker cluster appearance for duplicate markers.

## 17.3.14 (2019-10-03)

### Maps

#### Bug Fixes

- `F147309` - Issue in adding sub layer in the 'OpenStreetMap' has been resolved.

## 17.3.9-beta (2019-09-20)

### Maps

#### New Features

- The toggle option has been provided for legend. So, if you toggle the legend, the given color will be changed to the corresponding shape item.

## 17.2.41 (2019-08-14)

### Maps

#### Bug Fixes

- `#244108` - The issue with legend border that does not disappear when hover over the legend item has been fixed.
- The issue with tooltip was not working in Internet Explorer 11 browser has been fixed.

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

- `#I240833` - Some labels disappear when you change "colorMapping" and refresh the map issue has been fixed.
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

- Shape selection is now working fine with touch events.

## 16.2.45 (2018-07-17)

### Maps

#### Bug Fixes

- Marker click event is now working fine with OSM layer.

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