# Changelog

## [Unreleased]

## 27.1.50 (2024-09-24)

### Chart

- `#I631309` - Now, the spline range area chart will handle null values properly.

### Accumulation Chart

- `#I630866` - Now, the group separator will work for both the tooltip x-point and the legend text.

## 27.1.48 (2024-09-18)

### Chart

#### Features

- `#I539415`- Provided support for smooth data transitions with animation effects when sorting data in the chart.
- `#I539415`- Provided support for smooth animation transitions when zooming the chart.
- Added support to disable risers in the step line series for enhanced customization.

### Accumulation chart

#### Features

- `#I539415`- Provided support for animations when adding, removing, or updating data for series, data labels, and legends.
- Added support for rounded corners in pie, donut, pyramid, and funnel charts.
- Provided pattern support for data points in accumulation charts.

## 26.2.13 (2024-09-10)

### Chart

#### Bug Fixes

- `#F194171` - Now, the first and last points are rendered properly in the bar chart when using the category axis.

## 26.2.12 (2024-09-03)

### Chart

#### Bug Fixes

- `#I624097` - Now, the pareto chart will render properly when specifying the axis name in the pareto series.

## 26.2.11 (2024-08-27)

### Chart

#### Bug Fixes

- `#I621966` - Now the step is applied properly from left and right of the points in the range step area.
- `#I623859` - Now the maximum range for waterfall series is calculated properly.

## 26.2.9 (2024-08-13)

### Chart

#### Bug Fixes

- `#I617528` - Now the data labels are visible only for the available range.
- `#I618989` - Selection zooming and panning now function properly on the date-time category axis.
  
### Accumulation Chart

#### Bug Fixes

- `#I618245` - Now resizing works properly in accumulation, even when the tooltip is enabled.

### StockChart

#### Bug Fixes

- `#F191596` - Spline rendering now correctly handles zero data values.

## 26.2.8 (2024-08-06)

### Chart

#### Bug Fixes

- `#I615273` - Now, the tooltip will render properly when a string is used as the y-value.

## 26.2.5 (2024-07-26)

### Chart

#### Bug Fixes

- `#I612449` - The secondary axis labels will render properly with scrollbar on the secondary axis.

### RangeNavigator

#### Bug Fixes

- `#I613716` - Now, the series is rendered properly when the y-values are the same.

## 26.2.4 (2024-07-24)

### Chart

#### Bug Fixes

- `#I605096` - Now, the data label color is correct when setting the position to `Auto`.

### Accumulation Chart

#### Bug Fixes

- `#I609990` - Now, the data label tooltip will adjust automatically when it goes outside the chart bounds.

## 26.1.42 (2024-07-16)

### Chart

#### Bug Fixes

- `#I605430` - The chart height fits the container even when scaling is applied.

### 3DCircularChart

#### Bug Fixes

- `#I608643` - Now, the legend highlighting works properly for the 3D Circular chart.

## 26.1.41 (2024-07-09)

### Chart

#### Bug Fixes

- `#I604359` - The y-axis label is now proper when setting the minimum value on a date-time axis.
- `#I607015` - The marker will not get cut off when enabling the scrollbar.

#### Features

- `#I546800` - Enhanced the appearance of connector lines in the waterfall chart for better visual clarity.

## 26.1.40 (2024-07-02)

### Chart

#### Bug Fixes

- `#I604532` - Removed exclamation mark from comments in the chart source.

## 26.1.39 (2024-06-25)

### Chart

#### Bug Fixes

- `#I599108` - Now, the chart updates properly when rendered in the Firefox browser.
- `#I597246` - The chart with a zero data label is now rendered when setting the position as `Top`.

### Accumulation Chart

#### Bug Fixes

- `#I595618` - User interaction now works properly in the nested doughnut chart.

### Sparkline

#### Bug Fixes

- `#I601193` - The fill property in Sparkline now works properly.

## 26.1.38 (2024-06-19)

### Chart

#### Bug Fixes

- `#I594639` - Now, the range navigator and the chart are rendered with the same width.
- `#I598543` - Now, the chart area scrolling works properly when enabling the trackball in mobile mode.
- `#F188458` - Now, the page remains in the same position when adding or removing a series in chart.

## 26.1.35 (2024-06-11)

### Accumulation Chart

#### Bug Fixes

- `#I590334` - Now, the pie legend highlight works properly.
- `#I590334` - Now, the legend highlight will work properly even disabling selection in the pie chart.

### Chart

#### Bug Fixes

- `#I591823` - Now, the legend doesn't gets overlapped when resizing the pie chart to minimal size.

#### Features

- `#I539415` - Provided support for animations when adding, removing, or updating data for all chart types, ranging from line charts to financial charts.
- `#I539415` - Provided smooth transition support for axis elements like gridlines, tick lines, and labels when data is updated in the chart.
- `#I539415` - Provided smooth transition support for annotations when data is updated in the chart.
- Improved the animation of stacking series when clicking on the legend.
- Provided highlight support for chart series when clicking on the legend.
- Users can now access point information based on the pointer coordinates during chart mouse events and use this information to add or remove points on the chart.

## 25.2.6 (2024-05-28)

### Chart

#### Bug Fixes

- `#I592273` - An empty tooltip will no longer be displayed when the cancel argument is enabled in the shared tooltip event.

## 25.2.5 (2024-05-21)

### Accumulation Chart

#### Bug Fixes

- `#I580553` - Accessibility issues are resolved, and now the score has become stable.

### Chart

#### Bug Fixes

- `#I581265` - Now, the Stacking Bar chart has been exported as a CSV file, and the CSV contains the appropriate data.

## 25.2.4 (2024-05-14)

### Chart

#### Bug Fixes

- `#I585297` - Tooltips in polar and radar series now render properly without console errors.
- `#I532022` - Now, axis labels will render properly without any cutting off.
- `#I585033` - Now, datetime annotations render properly.

## 25.2.3 (2024-05-08)

### Accumulation Chart

#### Bug Fixes

- `#I574491` - The right click function now works properly in the accumulation chart with the external mouse on the mac.

### Chart

#### Bug Fixes

- `#I581265` - Now, the bar chart has been exported as a CSV file, and the CSV contains the appropriate data.

## 25.1.42 (2024-04-30)

### Accumulation Chart

#### Bug Fixes

- `#I579773` - Now, the center label remains center even when adjusting the start and end angles.
- `#I577505` - Now, the radius specified by the mapping will render properly in the accumulation chart.

## 25.1.41 (2024-04-23)

### Chart

#### Bug Fixes

- `#I577538` - When resizing the chart, the maximum value does not change.
- `#I578863` - Now the chart exports properly in portrait orientation.
- `#I579386` - Now the legend renders properly using the add series method in canvas.
- `#I577327` - Now the DateTimeCategory series is visible when clicking on the legend.

## 25.1.40 (2024-04-16)

### Chart

#### Bug Fixes

- `#I574804` - Now, the title is wrapped properly when it exits the chart in wrap mode.
- `#I573884` - Now, all legend items with the same value in point mode will render properly.

## 25.1.39 (2024-04-09)

### Chart

#### Bug Fixes

- `#I571372` - The first axis label does not shift to the left when using `edgelabelplacement` as `shift`.
- `#I571107` - When the chart is resized, the console error will no longer be thrown.

## 25.1.38 (2024-04-02)

### Chart

#### Bug Fixes

- `#I532022` - Now, the datalabel position is properly set when the position property is set to `Auto`.

## 25.1.37 (2024-03-26)

### AccumulationChart

#### Bug Fixes

- `#I564804` - Now, the `textWrap` property in the legend is working properly.

### Chart

#### Bug Fixes

- `#I528508` - The tooltip template div is now added based on the series count, and it renders properly.
- `#I563227` - Now, datalabel does not take the y value in place of a null value, and it renders properly.
- `#I562333` - Now, annotations are rendered corresponding to their series point while enabling the `isIndexed` property
- `#I566633` - Now, the first axis label is properly displayed on the x-axis.

## 25.1.35 (2024-03-15)

### Chart

#### Features

- `#I528518` - Now, it is possible to specify the dasharray for all types of striplines border, including vertical, horizontal, and segmented, in the chart.

### 3DCircularChart

The 3D Circular Chart provides a graphical representation of data in three dimensions, with each slice's size indicating its proportion relative to the entire dataset. Unlike traditional 2D charts, 3D charts add depth to visualization, providing a better understanding of data patterns.

- **Series**: The 3D Circular Chart can plot pie and donut types.
- **Data binding**: Bind the 3D Circular Chart component with an array of JSON objects or a data manager. In addition to chart series, data labels and tooltips can also be bound to the data.
- **Data labels**: Annotate points with labels to improve the readability of data.
- **Legends**: Provide additional information about points in a customizable and interactive legend.
- **User interaction**: Add interactive features such as tooltips, rotation, tilt, data point highlight and selection.
- **Print and Export**: Print a 3D Circular Chart directly from the browser and export it in JPEG and PNG formats.
- **RTL**: The right-to-left mode aligns tooltips, legends, and data in the 3D Circular Chart component from right to left.

## 24.2.9 (2024-03-05)

### Chart

#### Bug Fixes

- `#I558392` - Now the line color of the Pareto chart is stable when toggling the legend.
- `#I558247` - Now sorting is working in the Pareto chart.
- `#I557017` - Now the column is rendered properly when a corner radius is used.

## 24.2.8 (2024-02-27)

### Chart

#### Bug Fixes

- `#T553171` - Now the center label is aligned properly when increasing the font size.
- `#I548552` - The y-axis now dynamically changes based on the current visible points when zooming.

## 24.2.7 (2024-02-20)

### Chart

#### Bug Fixes

- `#I549266` - The Hilo open-close chart data points shape is now rendering properly.

### StockChart

#### Bug Fixes

- `#I554213` - The dropdown font style has now been changed according to the selected theme.

## 24.2.5 (2024-02-13)

### StockChart

#### Bug Fixes

- `#I549996` - Now, the stock chart axis labels render properly.

## 24.2.4 (2024-02-06)

### Chart

#### Features

- `#I528067` - Now, right-to-left scrolling is functioning correctly in the charts.

#### Bug Fixes

- `#I539074` - Now, the stacking column renders properly even when the series is sorted based on the series name.
- `#I541484` - Now, the decimal point is displayed in the y-axis label when the language setting on Google is set to French.
- `#I546219` - Now, the `visible` property in the series is working properly when updated dynamically.

### BulletChart

#### Bug Fixes

- `#I544771` - Now, the `textAlignment` property in the `dataLabel` is working properly.

## 24.1.47 (2024-01-23)

### AccumulationChart

#### Bug Fixes

- `#I539550` - Now, the `enableSmartLabels` property in the accumulation chart is functioning correctly.

### Chart

#### Bug Fixes

- `#I541520` - Now, the `startFromZero` property in the chart is working properly.

## 24.1.46 (2024-01-17)

### Chart

#### Bug Fixes

- `#I537751` - Now, the `enableZoom` property in the `scrollbarSettings` is working properly.
- `#I535723` - Now, the showTooltip is working properly on mobile devices.
- `#I528752` - Now, the chart values update properly during the resized event when integrating the EJ2 JS chart in a Blazor application.

## 24.1.45 (2024-01-09)

### AccumulationChart

#### Bug Fixes

- `#I533625` - Now, the `textAlignment` property in the `titleStyle` of the accumulation chart is functioning correctly.

### Chart

#### Bug Fixes

- `#I536934` - Now, the `category` axis label renders properly when the x-value is provided as an empty string.

## 24.1.44 (2024-01-03)

### Chart

#### Bug Fixes

- `#I521819` - Improved the accuracy of the normal distribution in the histogram series.
- `#I528067` - Removed the multilevel label if all series are not visible.
- `#I185777` - Fixed the marker size issue in the scatter chart during initial loading.
- `#I185904` - Resolved the issue with the shared tooltip when disabling `showNearestPoint`.
- `#I532475` - Fixed the console error in Mozilla Firefox when zooming the bubble chart.

## 24.1.43 (2023-12-27)

### Chart

#### Bug Fixes

- `#I527182` - Now, the chart element ID is generated properly.
- `#I527898` - Now, the `interval` for the DateTimeCategory is working properly.
- `#I528674` - Now, scroll bar positioned properly.
- `#I528865` - Resolved the console error related to trendlines when using two sets of data with a polynomial type.

## 24.1.41 (2023-12-18)

### Chart

#### Features

- `#I489636`, `#F185569` - Provided support to align the axis title to the near, far, and center of the chart area.
- `#I482069`, `#I510188`, `#I511613` - Provided support to position the tooltip at a fixed location within the chart.

#### Bug Fixes

- `#F185567` - The data label now renders properly for the waterfall chart.
- `#I185614` - The 100% stacking bar is now rendered properly even when the data value is 0.

### BulletChart

#### Features

- `#I495253` - Provided support to apply different colors to value and target bars in the bullet chart.

### 3DChart

A 3D chart is a graphical representation of data in three dimensions, showcasing relationships and trends among variables. Unlike traditional 2D charts, 3D charts add depth to the visualization, allowing for a more immersive and comprehensive understanding of data patterns.

- **Series** - The 3D chart can plot over six chart types, including column, bar, stacking column, stacking bar, 100% stacked column, and 100% stacked bar.
- **Data Binding** - Bind the 3D chart component with an array of JSON objects or a DataManager. In addition to chart series, data labels, and tooltips can also be bound to your data.
- **Data Labels** - Support data labels to annotate points with labels to improve the readability of data.
- **Axis Types** - Able to plot different data types such as numbers, datetime, logarithmic, and string.
- **Axis Features** - Supports multiple axes, inverted axes, multiple panes, opposed positions, and smart labels.
- **Legend** - Supports a legend to provide additional information about a series with customization options.
- **Animation** - The 3D chart series will be animated when rendering and refreshing the chart widget.
- **User Interaction** - Supports interactive features such as tooltips and data point selection.
- **Export** - Supports printing the 3D chart directly from the browser and exporting the chart in both JPEG and PNG formats.
- **RTL** - Provides a full-fledged right-to-left mode that aligns the axis, tooltip, legend, and data in the 3D chart component from right to left.
- **Appearance** - Colors for the 3D charts are picked by the built-in theme, but each element of the 3D chart can be customized with simple configuration options.
- **Accessibility** - Designed to be accessible to users with disabilities, with features such as WAI-ARIA standard compliance and keyboard navigation to ensure that the 3D chart can be effectively used with assistive technologies such as screen readers.

## 23.2.7 (2023-12-05)

### Chart

#### Bug Fixes

- `#I522567` - The chart `height` has now been updated properly.
- `#I523917` - Now, the marker renders properly when animating the series after changing data through the period selector.

### StockChart

#### Bug Fixes

- `#I522065` - Now, the series `border` is working properly.
- `#I523535` - Now, stock event renders properly.

## 23.2.6 (2023-11-28)

### Chart

#### Bug Fixes

- `#I520071` - Now, `cluster` selection is working properly in the scatter series.
- `#I522808` - Fixed console error that was thrown when using the name property in the axis for a polar chart.
- `#I523059` - Now, the period selector's selected index is highlighted properly whenever we resize the screen.

## 23.2.5 (2023-11-23)

### AccumulationChart

#### Bug Fixes

- `#I519546` - Now, the pie chart data label renders properly when the data point is zero.

### Chart

#### Bug Fixes

- `#I520467` - The combination of multiple types of trendlines is now rendering properly.
- `#I519877` - Now, `StackingGroup` is working properly along with `columnWidthInPixel`.
- `#I519877` - Now, `ColumnSpacing` is working properly along with `columnWidthInPixel`.

## 23.2.4 (2023-11-20)

### Chart

#### Bug Fixes

- `#I504772` - It is now possible to cancel zooming using the scrollbar through the 'scrollChanged' event.

#### Features

- `#I494809` - Now steps can be applied to the line from the center, as well as from the left and right of the points.
- `#I505867` - Enhanced the rendering of scatter series with a large number of data points.

## 23.1.44 (2023-11-07)

### Chart

#### Bug Fixes

- `#I495717` - Now the pdf-export module is not included by default.

## 23.1.43 (2023-10-31)

### Chart

#### Bug Fixes

- `#F184961` - The enable RTL property is now working correctly in polar chart.
- `#I512713` - Now the chart series type can be updated using react hooks.

## 23.1.42 (2023-10-24)

### Chart

#### Bug Fixes

- `#I510832` - Multiple trendlines for line type series are now functioning correctly.
- `#I511821` - Now the data label is rendering properly in canvas mode.

### StockChart

#### Bug Fixes

- `#I510304` - Now, the data was updated properly in the stock chart when trying to update it using useEffect.

## 23.1.41 (2023-10-17)

### RangeNavigator

#### Bug Fixes

- `#I502356` - Fixed the console error that throws when we resize the range navigator.

## 23.1.40 (2023-10-10)

### Chart

#### Bug Fixes

- `#I499384` - Now the chart series is getting focused properly after legend click.

## 23.1.39 (2023-10-04)

### Chart

#### Bug Fixes

- `#I498233` - Now the `binInterval` is properly updating on dynamic change.
- `#I504772` - Now, limit the zooming level in the chart through the onZooming event.
- `#I501725` - Subtitle is now rendering properly based on the chart width.

### AccumulationChart

#### Bug Fixes

- `#I503999` - Now, the legend in the shape of a `Cross` renders properly.

## 23.1.38 (2023-09-26)

### Chart

#### Bug Fixes

- `#I498152` - Fixed the issue of pane collapse when zooming in the chart.
- `#I498070` - Now, the tooltip is displaying properly for all series when the shared tooltip is enabled.
- `#I478252` - Updated legend aria-label based on the visibility of the series.
- `#I499382` - Changed the color of the tab bar line based on the theme.
- `#I499384` - Chart points are now focusing properly when navigating using arrow keys.
- `#I498673` - Now the primary axes are displaying properly when rendering series using secondary axes.
- `#I500178` - Fixed a issue where a console error was being thrown when trying to zoom in the Pareto chart during selection.
- `#I482650` - Fixed issue where the height of the chart would increase when the axis was hidden.

### AccumulationChart

#### Bug Fixes

- `#F184357` - Funnel chart is now rendering properly when all the data points value is zero.
- `#I498982` - Data labels are now displaying properly after legend click.

## 23.1.36 (2023-09-15)

### Chart

#### Features

- `#I462095` - Provided support for using column or bar charts to display data in the form of cylindrical-shaped items.
- `#I395116` - Provided support for synchronizing tooltips, zooming and panning, cross-hairs, highlights, and selection features across numerous charts.
- `#I420935` - Provided support for exporting chart data to Excel in a table format.
- `#I489636` - It is now possible to add a background and border to the chart title and subtitle.
- `#F182191` - Provided support to hide the nearest data in tooltip when having multiple axis.
- `#I294830` - Enhanced PDF export feature facilitates exporting charts from the web page onto multiple pages within a PDF document.

### StockChart

#### Features

- `#I253147` - Provided support for exporting chart data to Excel in a table format.
- New axis type `DateTimeCategory` is now available to show only business days.

## 22.2.12 (2023-09-05)

### Chart

#### Bug Fixes

- `#F184251` - Fixed an issue in axis label position when label position set to inside for bar series.

## 22.2.11 (2023-08-29)

### Accumulation chart

#### Bug Fixes

- `#I494139` - The tab index is now properly displayed in the accumulation chart.

### Chart

#### Bug Fixes

- `#F46287` - Fixed an issue where the tooltip was not rendered when the chart id was a numeric value.
- `#I478252` - The legend aria label has been changed based on the legend click.
- `#I492750` - Fixed an issue where the zoom factor and zoom position were not applied after scrolling the chart.

## 22.2.10 (2023-08-22)

### Accumulation chart

#### Bug Fixes

- `#I490028` - Fixed an issue where the `centerLabel` text was not being displayed in bold formatting.

### Sparkline

#### Bug Fixes

- `#F45948` - Fixed issue with sparkline pie not displaying properly when having single point.
- `#F45935` - Fixed an issue where the chart gets vanished when data updated after resizing the chart.

## 22.2.9 (2023-08-15)

### Accumulation chart

#### Bug Fixes

- `#I486337` - Fixed an issue where the console error thrown when disabling the animation.
- `#I486337` - Now the destroy method is properly working in accumulation chart.

### Chart

#### Bug Fixes

- `#I487053` - Now, `startFromZero` is functioning correctly in stackingColumn.

## 22.2.8 (2023-08-08)

### Chart

#### Bug Fixes

- `#I483107` - Data editing is now working properly, along with the zoom property.
- `#I484578` - The trendline is now rendered for the polynomial type in datetime.
- `#I485511` - Fixed an issue where the trackball was not rendered properly in canvas mode.

## 22.2.7 (2023-08-02)

### Chart

#### Bug Fixes

- `#I479445` - Now, the legend opacity is working properly in the chart.
- `#F183350` - Fixed an issue where the multicolored area was not working properly in canvas mode.
- `#I481085` - The issue where the Legend gets cut off when `enablePages` is set to false has been resolved.
- `#I481219` - Now, SelectedDataIndexes are properly updated when it is cleared on button click.
- `#I482650` - Now the chart is proper when refreshed after zooming in and out.

## 22.2.5 (2023-07-27)

### Chart

#### Bug Fixes

- `#I477552` - Fixed an issue where the column was overlapping with the axis line.
- `#I477506` - Fixed an issue where the trendline was not changing when updating its properties.
- `#I475454` - Now UseGroupingSeparator is working in accumulation tooltip.
- `#F183277` - Fixed an issue where range color mapping was not working when using two series.
- `#I479131` - Fixed the issue of data label cropping when setting the value as the minimum.
- `#I479171` - Fixed an issue where the range values of the scroll bar were not proper.
- `#I471081` - Now, stripline is proper when the width is changed.

## 22.1.39 (2023-07-18)

### Chart

#### Bug Fixes

- `#I474743` - Fixed issue where chart type did not change when updated using the "type" attribute.
- `#I473789` - Fixed an issue where the chart was not getting rendered in PhantomJS.
- `#I473845` - Resolved an issue where axis labels were not rendering correctly during export and initial render.
- `#I478252` - Improved the accessibility of the legend.
- `#I478253` - Updated the accessibility text in the chart container.
- `#I481747` - Now, the double axis labels are correct when the culture is set to 'it'.

## 22.1.38 (2023-07-11)

### Chart

#### Bug Fixes

- `#I475437` - Resolved issue where crosshair intersection point was not properly displayed.
- `#I463171` - Resolved issue where column width was not properly displayed.

## 22.1.37 (2023-07-04)

### Chart

#### Bug Fixes

- `#I464403` - Fixed an issue where the dash array in segmented stripline was not working properly.
- `#I473748` - Fixed issue where the chart was not being rendered when a null value was given as the series name.
- `#I474198` - Fixed an issue where the x axis label was not displayed correctly.
- `#I474198` - Fixed an issue where the first label was getting cut off when the edgeLabelPlacement was set to 'shift'.

## 22.1.36 (2023-06-28)

### Chart

#### Bug Fixes

- `#F182477` - Resolved the issue where the X axis displayed all values even when an interval of 1 and only one data point was provided.
- `#I471069` - Fixed an issue where multiple axes were not displaying properly when using large records of data.
- `#I461357` - Fixed issue with selection not working when using zoom settings.

## 22.1.34 (2023-06-21)

### Chart

#### New Features

- `#I461049` - Provided support to display a zoom toolbar for the chart on initial load, which allows user to zoom in on the chart.
- `#I439527` - Provided support for a cross-shaped marker to the data points in the chart.
- `#I283789` - Provided support to position the chart title to the left, right, or bottom of the chart.
- `#I286744` - It is now possible to customize the axis scroll bar by changing its color and height, and disable zooming in the scrollbar.
- `#I386094` - Improved the axis label placement after line break.
- `#I428708` - Provided distinct markers shape for each series in the chart.
- `#I404448` - It is now possible to customize the Pareto axis and line in terms of marker, width, dash array, and color.

#### Breaking Changes

- To differentiate between marker shapes in the `ChartShape` enumeration, the existing Cross shape has been replaced with Plus, while a new enumeration, Cross, has been added for the cross shape.
- The font family for chart elements such as the title, axis labels, data labels, legend, tooltip, etc., has been changed based on the theme in the 2023 Volume 2 release.

| Theme | Previous Font Family| New Font Family |
| -------- | -------- | -------- |
| Material | Segoe UI | Roboto |
| Bootstrap 5 | Segoe UI | Helvetica  |
| Bootstrap 4 | Segoe UI | Helvetica |
| Bootstrap | Segoe UI | Helvetica  |
| TailWind | Segoe UI | Inter|

#### Bug Fixes

- `#I467459` - The legend is now rendering properly when resizing the chart.
- `#F182605` - The multicolored line series chart is now rendering properly while using `isInversed` in the primary Y-axis.
- `#I467459` - Now, the axis labels are rotating properly in the canvas mode.

### Stock Chart

#### Breaking Changes

- By default, the series type and trendline dropdowns have been removed from the stock chart period selector. However, you can still add them to the list upon request or as needed. This modification provides a cleaner interface and reduces clutter in the stock chart period selector.
- By default, the tooltip for the range selector in the stock chart has been removed. Instead, the tooltip will now appear only when you move the slider.
- The print option has been removed from the period selector because it is already available in the export dropdown. This modification provides a cleaner interface and reduces clutter in the stock chart's period selector.
- The font family for stock chart elements such as the title, axis labels, data labels, legend, tooltip, etc., has been changed based on the theme in the 2023 Volume 2 release.

| Theme | Previous Font Family| New Font Family |
| -------- | -------- | -------- |
| Material | Segoe UI | Roboto |
| Bootstrap 5 | Segoe UI | Helvetica  |
| Bootstrap 4 | Segoe UI | Helvetica |
| Bootstrap | Segoe UI | Helvetica  |
| TailWind | Segoe UI | Inter|

### Accumulation chart

#### Breaking Changes

- The font family for accumulation chart elements such as the title, data labels, legend, tooltip, etc., has been changed based on the theme in the 2023 Volume 2 release.

| Theme | Previous Font Family| New Font Family |
| -------- | -------- | -------- |
| Material | Segoe UI | Roboto |
| Bootstrap 5 | Segoe UI | Helvetica  |
| Bootstrap 4 | Segoe UI | Helvetica |
| Bootstrap | Segoe UI | Helvetica  |
| TailWind | Segoe UI | Inter|

### Bullet Chart

#### Breaking Changes

- The font family for bullet chart elements such as the title, labels, legend, tooltip, etc., has been changed based on the theme in the 2023 Volume 2 release.

| Theme | Previous Font Family| New Font Family |
| -------- | -------- | -------- |
| Material | Segoe UI | Roboto |
| Bootstrap 5 | Segoe UI | Helvetica  |
| Bootstrap 4 | Segoe UI | Helvetica |
| Bootstrap | Segoe UI | Helvetica  |
| TailWind | Segoe UI | Inter|

### RangeNavigator

#### Breaking Changes

- The font family for range navigator elements such as the axis labels, tooltip, etc., has been changed based on the theme in the 2023 Volume 2 release.

| Theme | Previous Font Family| New Font Family |
| -------- | -------- | -------- |
| Material | Segoe UI | Roboto |
| Bootstrap 5 | Segoe UI | Helvetica  |
| Bootstrap 4 | Segoe UI | Helvetica |
| Bootstrap | Segoe UI | Helvetica  |
| TailWind | Segoe UI | Inter|

### Sparkline

#### Breaking Changes

- The font family for sparkline elements such as the data labels, tooltip, etc., has been changed based on the theme in the 2023 Volume 2 release.

| Theme | Previous Font Family| New Font Family |
| -------- | -------- | -------- |
| Material | Segoe UI | Roboto |
| Bootstrap 5 | Segoe UI | Helvetica  |
| Bootstrap 4 | Segoe UI | Helvetica |
| Bootstrap | Segoe UI | Helvetica  |
| TailWind | Segoe UI | Inter|

### Smith Chart

#### Breaking Changes

- The font family for smith chart elements such as the title, data labels, legend, tooltip, etc., has been changed based on the theme in the 2023 Volume 2 release.

| Theme | Previous Font Family| New Font Family |
| -------- | -------- | -------- |
| Material | Segoe UI | Roboto |
| Bootstrap 5 | Segoe UI | Helvetica  |
| Bootstrap 4 | Segoe UI | Helvetica |
| Bootstrap | Segoe UI | Helvetica  |
| TailWind | Segoe UI | Inter|

## 21.2.10 (2023-06-13)

### Chart

#### Bug Fixes

`#I451537` - Spline is now proper for negative points without specify the range.

## 21.2.9 (2023-06-06)

### Chart

#### Bug Fixes

- `#F182216` - Fixed the issue where the data label was hidden.
- `#I464403` - Fixed an issue where strip line text was getting cut off when it was too long.

## 21.2.8 (2023-05-30)

### Chart

#### Bug Fixes

- `#F181551` - The tooltip now displays the percentage of each stacking group.
- `#F182191` - Now, tooltip values are displayed correctly when no data is given for the data point in a series.
- `#I461357` - Now, zooming and selection are working properly when using both at the same time.
- `#I452148` - The issue of the y-axis label overlap has been fixed.
- `#I464813` - Fixed MinorGridLine to be visible even when the width is not set for MajorTickLine.
- `#I463171` - Fixed issue where column width was not being set properly.
- `#I462090` - Fixed an issue where startFromAxis was not working correctly for stripLine.

## 21.2.6 (2023-05-23)

### Chart

#### Bug Fixes

- `#F182033` - The marker is now proper while zooming the chart.

## 21.2.5 (2023-05-16)

### Chart

#### Bug Fixes

- `#F181976` - Now the tooltip is proper when using two axes in a chart.
- `#I451537` - Now, the axis label value is correct when an interval is not given.
- `#I451537` - Fixed an issue where the axis label was not displaying correctly.
- `#I451537` - Now, the secondary axis label will be correctly displayed without an interval.
- `#I452395` - Fixed an issue where the y-axis axis label was displaying double values.
- `#I452390` - Fixed the issue where the axis label was being trimmed despite the shift given to the edgeLabelPlacement.

## 21.2.4 (2023-05-09)

### Chart

#### Bug Fixes

- `#I457088` - Fixed the console error thrown on clicking on the legend.
- `#I459170` - Now the accumulation data label is visible when using a template.

## 21.2.3 (2023-05-03)

### Chart

#### Bug Fixes

- `#I452421` - Fixed an issue where a dotted line was showing up for line charts while exporting through PhantomJS.
- `#I451960` - Resolved an issue where the datalabel border was getting added while exporting using PhantomJS.
- `#I452091` - Resolved an issue where line charts were not being rendered while exporting using PhantomJS.
- `#I455206` - Fixed an issue where the DataLabel was not visible despite there being enough space to display it.
- `#I452148` - `MultipleRows` in labelIntersectAction property is now working properly.
- `#I456533` - Fixed an issue where the tick line was visible even if there was no axis label for it.
- `#F181431` - Fixed the issue where chart width was not changing on print.

#### New Features

- `#I451521` - Provided support for dashArray in series border for Pie chart.
- `#I360879` - Provided support to disable marker explode in shared tooltip.

## 21.1.41 (2023-04-18)

### Chart

#### Bug Fixes

- `#I451521` - Now, the border is proper in the funnel and pyramid series.
- `#I453698` - Cross shape marker now displays correctly in Scatter Series.
- `#I439673` - The `enableTextWrap` property of the tooltip is now working properly in the pie chart.
- `#I452390` - Fixed the issue where the axis label was not properly visible.
- `#I447639` - Tooltip format now displays properly when using the axis label format.
- `#I453698` - The legend shape now reflects the marker shape in scatter series.

## 21.1.39 (2023-04-11)

### Chart

#### Bug Fixes

- `#I451537` - Now, the column chart rectangle is properly rendering for OnTicks.
- `#I452148` - The chart now renders correctly even when the x value is set to an empty string in the data source.

## 21.1.38 (2023-04-04)

### Chart

#### Bug Fixes

- `#I449076` - Data labels are now displayed properly in the HiloOpenClose chart.
- `#I444669` - Line width of the series is now updating properly while using useState method.
- `#I444557` - Legend is now rendering properly on the top position without overlapping with axis label.

## 21.1.35 (2023-03-23)

### Chart

#### Bug Fixes

- `#I445049` - The axis title and secondary axis are now rendering properly.
- `#I447639` - `Usegroupingseparator` is now supported for bubble size.
- `#I445330` - The legend toggle now works properly when used along with highlight.

## 21.1.35 (2023-03-23)

### Chart

#### New Features

- `#I320485` - Provided support to place a label at the center of the pie and donut charts.
- `#I416444` - Provided support for a new chart type called range step area which is used to display the difference between minimum and maximum values over a certain time period.
- `#I396453`, `#I314160` - Provided support to customize the height and color of the error bar of each data point.

#### Bug Fixes

- `#I444557` - Resolved the issue where the legend and the chart were overlapping.
- `#I431278` - Resolved issue with overlapping chart and data label when rotation is enabled.

## 20.4.54 (2023-03-14)

### Chart

#### Bug Fixes

- `#F180863` - Resolved the issue where the page was reloading automatically.

## 20.4.53 (2023-03-07)

### Chart

#### Bug Fixes

- `#I441035` - Fixed issue with page becoming unresponsive when zooming chart too quickly.

## 20.4.52 (2023-02-28)

### Chart

#### Bug Fixes

- `#F180554` - Fixed console error thrown when using the destroy method.
- `#I437308` - Resolved accessibility issues in chart.
- `#I436273` - Fixed issue with chart going out when zooming without clip rect in path.

## 20.4.51 (2023-02-21)

### Chart

#### Bug Fixes

- `#F180050` - Tooltip text and markers are now properly aligned when text is removed from the tooltip.
- `#I401851` - The issue of axis title and axis label overlap has been fixed.
- `#I436272` - Disabled the marker explode for marker image.
- `#I429808` - The axis labels getting cut off when rotating the labels has been fixed.
- `#I437507` - `PointDoubleClick` event is not triggered in chart issue has been fixed.

## 20.4.49 (2023-02-07)

### Chart

#### Bug Fixes

- `#I430549` - The axis labels getting cut off when rotating the labels has been fixed.
- `#F180163` - Removed the chart focus element when changing to the next page.
- `#I432239` - Now, the chartDoubleClick event is triggered when used in conjunction with the chartMouseClick event.

## 20.4.48 (2023-02-01)

### Chart

#### New Features

- `#I423603` - Provided support to remove points with no data from shared tooltip.

#### Bug Fixes

- `#I428396` - Now, when using the overflow property, multilevel labels are wrapped based on the maximumTextWidth.
- `#I430286` - Now the period selectors are updating properly with respect to the range selector.
- `#I426849` - Resolved the console error in the tooltip when the data for the series is empty.

## 20.4.44 (2023-01-18)

### Chart

#### Bug Fixes

- `#I426511` - Chart cut off when the parent container width is less than the chart width has been fixed.
- `#I427185` - The DateTimeCategory axis now correctly sorts data.

## 20.4.43 (2023-01-10)

### Chart

#### Bug Fixes

- `#I426642` - Now accumulation chart keyboard focus element is removed from DOM properly after destroying the component.
- `#I426112` - Now UseGroupingSeparator is working in data label.
- `#I426849` - Tooltip and crosshair are now working properly for the missed data.

### RangeNavigator

#### Bug Fixes

- `#I426389` - Changed event triggered unnecessarily when clicking daterangepicker issue has been fixed.

## 20.4.42 (2023-01-04)

### Chart

#### Bug Fixes

- `#F179514` - Now the alignment of text is proper in the header of the tooltip and crosshair tooltip text.
- `#I401851` - Axis title overlaps with axis labels issue has been fixed.

### RangeNavigator

#### Bug Fixes

- `#I413509` - Now period selectors are updating properly for the range selector changes.

## 20.4.40 (2022-12-28)

### Chart

#### Bug Fixes

- `#I423644` - Now axis label is aligned properly when minimum value is high.
- `#I423606` - Trendline is now proper for zero values,
- `#I424547` - Now zooming the multi colored line is working properly.

## 20.4.38 (2022-12-21)

### Chart

#### New Features

- `#I346292`, `#I347892` - Provided support to wrap data labels in the accumulation charts.
- `#I401851` - Provided support to rotate the axis title from 0 to 360 degree.
- Provided support for dashed legends for dashed line series.

#### Bug Fixes

- `#I420456` - Now cancel argument in legend click event working properly.
- `#I423376` - Console error thrown when rendering the tooltip in trendlines has been fixed.
- `#I422475` - Accumulation chart height is now proper with respect to its parent container.

### Bullet Chart

#### Bug Fixes

- `#I422321` - Now label alignment property is working properly in bullet chart.

## 20.3.60 (2022-12-06)

### Chart

#### Bug Fixes

- `#I421349` - Now chart axis is removed properly on dynamic update.
- `#I421251` - Now Pie chart render When set the width to less than 20% for the parent div.
- `#I421251` - Pie chart gets crashed when setting the datalabel issue has been fixed.

### RangeNavigator

#### Bug Fixes

- `#I413509` - Now period selectors are updating properly for the range selector changes.

## 20.3.58 (2022-11-22)

### Chart

#### Bug Fixes

- `#I412377` - Now axis labels are placed inside the chart properly.
- `#I412377` - Margin gets added when adding the axes dynamically issue has been fixed .
- `#F178666` - Now the data point aria label is proper.

### Stock Chart

#### Bug Fixes

- `#I418512` - Console error when specifying `labelRotation` for stockchart issue has been fixed.

## 20.3.57 (2022-11-15)

### Chart

#### Bug Fixes

- `#I415271` - Now technical indicator visible property working properly .
- `#I412377` - Space is not removed when removing the axis has been fixed .
- `#I415516` - Chart height is not proper issue has been fixed .

## 20.3.56 (2022-11-08)

### Chart

#### Bug Fixes

- `#I388725` - Multilevel label border cut off issue has been fixed.

## 20.3.52 (2022-10-26)

### Chart

#### Bug Fixes

- `#I412377` - Axis labels are now rendering properly inside the chart.
- `#F171844` - Console error while using shared tooltip has been fixed.

## 20.3.50 (2022-10-18)

### Chart

#### Bug Fixes

- `#F178096` - Chart axis range is now calculated properly after zooming the chart.

### Bullet Chart

#### Bug Fixes

- `#F177357` - Data label gets cropped in Bullet Chart has been fixed.

## 20.3.49 (2022-10-11)

### Chart

#### Bug Fixes

- `#I383934` - Now shared tooltip is rendering properly for all points.

### Sparkline

#### Bug Fixes

- `#F177692` - Sparkline component is not rendered in React Next app issue has been fixed.

## 20.3.48 (2022-10-05)

### Chart

#### Bug Fixes

- `#I409365` - Now canvas chart is working proper on legend click.

### Bullet Chart

#### Bug Fixes

- `#I400763` - Now Bulletchart axis labels are aligned properly for all fontsize.

## 20.3.47 (2022-09-29)

### Chart

#### New Features

- Provided border support for area chart types like Area, Step Area, Spline Area, Stacked Area and 100% Stacked Area.
- `#I298760` - It is now possible to format data labels in the chart, and it supports all global formats.
- `#I379807` - A toolbar for zooming and panning has been added to the chart on load.
- `#I386960` - Provided support to customize the space between legend items in the chart.
- `#I387973` - Provided legend click event for the accumulation chart.

## 20.2.50 (2022-09-20)

### Chart

#### Bug Fixes

- `#I404375` - Now alignment of the data label is working properly.
- `#F177357` - Now interval for axis is calculating properly for zoomed data.

## 20.2.49 (2022-09-13)

### Chart

#### Bug Fixes

- `#I398960` - Now chart axis scrollbar is working properly.
- `#I399859` - Pie chart subtitle is overlapped with datalabel issue has been fixed.

### Stock Chart

#### Bug Fixes

- `#I401042` - Now label stlye is applying properly for stock chart axis labels.

## 20.2.48 (2022-09-06)

### Chart

#### Bug Fixes

- `#I400391` - X axis start label is now shifted when y axis is in opposed position.
- `#I400062` - Now the axis lines are displayed properly after the scrollbar.

### Bullet Chart

#### Bug Fixes

- `#I400762` - Bullet Chart target height is now render properly.
- `#I400763` - Bullet chart axis labels are now center aligned, when changing value height.

## 20.2.46 (2022-08-30)

### Chart

#### Bug Fixes

- `#I399799` - Console error thrown in stock chart issue has been fixed.
- `#I390359` - Now chart is rendered properly in all pixel resolution.

## 20.2.45 (2022-08-23)

### Chart

#### Bug Fixes

- `#I397378` - Legend toggle visibility displays diagonal line in chart issue has been fixed.
- `#I396922` - Axis ranges are now refreshing properly after data point dragging.
- `#I397935` - Axis are now rendering properly after legend toggle.

## 20.2.44 (2022-08-16)

### Chart

#### Bug Fixes

- `#I395538` - Shared tooltip template is not shown for two series has been fixed.

## 20.2.43 (2022-08-08)

### Chart

#### Bug Fixes

- `#I393292` - Accumulation chart tooltip marker issue has been fixed.

## 20.2.40 (2022-07-26)

### Chart

#### Bug Fixes

- `#I391172` - Browser clashes while performing pinch zooming has been fixed.
- `#I383951` - Chart zooming is not working after zoom reset in mobile mode has been fixed.
- `#I392310` - Console error When performing range selection in hidden series has been fixed.

## 20.2.38 (2022-07-12)

### Chart

#### Bug Fixes

- `#I381436` - Data label is hidden in stacked bar series has been fixed.
- `#F175532` - Waterfall sum indexes are now rendering properly.
- `#I387394` - Marker position changes while displaying tooltip for rangearea issue has been fixed.
- `#I387391` - Horizontal and vertical line marker shapes are now rendering properly.

## 20.2.36 (2022-06-30)

### Chart

#### New Features

- `#I362746` - Provided keyboard navigation support for interactive elements on the chart.
- `#I353728` - Provided highlight and select support for the range and point color mapping.

## 20.1.59 (2022-06-07)

### Chart

#### Bug Fixes

- `#I379535` - Background issue in PDF export has been fixed.
- `#I379093` - Draggable arrow for stacked series is removed.
- `#I381436` - Data label is hidden in stacked bar series has been fixed.
- `#I379549` - Add series using DataManager makes a request to the server for multiple times issue is fixed.

## 20.1.57 (2022-05-24)

### Chart

#### Bug Fixes

- `#I378097` - `zooomComplete` event is now properly triggered for device.

## 20.1.56 (2022-05-17)

### Chart

#### Bug Fixes

- `#I378119` - PlotOffsetBottom not working fine issue has been fixed.

## 20.1.55 (2022-05-12)

### Chart

#### New Features

- `#I360879` - Provided support to disable the marker explode without tooltip and highlight mode.

## 20.1.52 (2022-05-04)

### Chart

#### Bug Fixes

- `#I375071` - Now axis labels is rendering properly with label rotation.

## 20.1.51 (2022-04-26)

### Chart

#### Bug Fixes

- `#I375071` - Now axis labels is rendering properly with label rotation.

## 20.1.50 (2022-04-19)

### Chart

#### Bug Fixes

- `#I372766` - Now axis labels rendered properly when resizing.
- Now tooltip is rendered properly when RTL is enabled.

## 20.1.48 (2022-04-12)

### Chart

#### Bug Fixes

- `#I369936` - Console error when setting the legend mode as `Point` has been resolved.
- `#I371101` - Now data labels will be rendered without overlapping.
- `#I366649` - Polar Radar not rendered in canvas mode issue has been fixed.
- `#I369616` - Spline curve break when zoom in issue has been fixed.

## 20.1.47 (2022-04-04)

### Chart

#### New Features

- `#I320275` - Wrap support provided for the legend text that overflows the container.

#### Bug Fixes

- `#I365536` - Crosshair tooltip is now proper when transform is applied.

## 19.4.54 (2022-03-01)

### Chart

#### Bug Fixes

- `#I362757` - Histogram points position is not equivalent to axis range issue has been resolved.

## 19.4.53 (2022-02-22)

### Chart

#### Bug Fixes

- `I365536` - Crosshair is now proper when scaling is applied.

### RangeNavigator

#### Bug Fixes

- `#I365442` - Issue in Changed event has been fixed.

## 19.4.50 (2022-02-08)

### Chart

#### Bug Fixes

- `#F171373` - Sum indexes is now working for the Waterfall chart.
- `#I363094` - Labelformat is now applied properly for the datalabel.
- `#I362757` - Histogram points position is not equivalent to axis range issue has been resolved.

## 19.4.47 (2022-01-25)

### Chart

#### Bug Fixes

- `#I362517` - Secondary axis is now rendering properly based on series visibility.
- `#I171844` - Console error issue fixed while using sharedTooltipRender event.
- `#I362117` - Hours format in range navigator is changed to 24 hours.

## 19.4.43 (2022-01-18)

### Chart

#### Bug Fixes

- `#I361065` - Rotated y axis labels are positioned properly now.
- `#I361317` - Shared tooltip template far away from cursor has fixed.

## 19.4.42 (2022-01-11)

### Chart

#### Bug Fixes

- `#I360775` - In the chart PDF export, a console error was fixed.

## 19.4.41 (2022-01-04)

### Chart

#### Bug Fixes

- `#I359390` - Axis label color is properly applied through `axisLabelRender` event.
- `#F165023` - Highlight is working fine in IE browser.

## 19.4.40 (2021-12-28)

### Chart

#### Bug Fixes

- `#I357152` - Legend highlight and selection is now working properly.

## 19.4.38 (2021-12-17)

### Chart

#### New Features

- `#I271263`,`#I344376` - Provided grouping support for the column and bar chart based on categories.
- `#F163374` - Provided color support to the highlighted point.
- `#I342748` - Fixed width support have been provided for chart area.
- `#I280225`, `#I340912` - Provided support to rotate y-axis labels to a given angle.
- `#I345716` - Provided support to reverse the rendering order of the legend items in a chart.
- Right to Left(RTL) feature added for all chart elements like legend, tooltip, data label, title, etc.

#### Bug Fixes

- `#I346999` - Data labels are now working properly while legend click.
- `#I349146` - Range area and scatter series working fine on canvas mode.

## 19.3.55 (2021-11-23)

### Chart

#### Bug Fixes

- Tooltip is now working fine in react library for mobile device.
- `#I347059` - Data label is now rendering properly for stacking column.
- `#F170296` - Datalabels are now removed for empty datasource on dynamic update.

## 19.3.54 (2021-11-17)

### Chart

#### Bug Fixes

- `#I346999` - Data label connector line is now working properly for value zero.
- `#I347279` - Marker color is now working properly for `MulticoloredLine` series type.

## 19.3.53 (2021-11-12)

### Chart

#### Bug Fixes

- `#I346472`- Selection and highlight color is not proper when using pointColorMapping is fixed.
- `#I346183` - StackingArea not rendering properly in huge data has been fixed.

## 19.3.48 (2021-11-02)

### Chart

#### Bug Fixes

- `#I346066` - Pie chart datalabels are now rendering properly while disabling the legend dynamically.

## 19.3.46 (2021-10-19)

### Chart

#### Bug Fixes

- `#I345054` - Chart with shared tooltip and huge data throws console error issue is fixed.

## 19.3.45 (2021-10-12)

### Chart

#### Bug Fixes

- `#I339050` - Resolved CSP issues in the chart while using inline styles.

- Data point highlight is now properly working while enabling the tooltip.

## 19.3.44 (2021-10-05)

### Chart

#### Bug Fixes

- `#I342789` - Tooltip fade out duration works properly on mobile device.
- `#F168868` - `OnZooming` event is now triggering properly.
- `#I339227` - Logarithmic axis range is working fine even value "0" is given.
- `#F169237` - Spline curve is not proper for null values is fixed.

## 19.3.43 (2021-09-30)

### Chart

#### New Features

- `#328985, #327703` - Provide pixel support for data points in rectangular chart types such as bar, range column, and column.

## 19.2.62 (2021-09-14)

### Chart

#### Bug Fixes

- `#I341014`, `#I341412` - Histogram chart rendering fine while using negative points.
- `#I340071` - Chart zooming is proper now when the axis is inversed.
- `#I341644` - Unwired the resize event for accumulation chart.

## 19.2.60 (2021-09-07)

### Chart

#### Bug Fixes

- `#I340525` - Data labels are rendering fine when the background is specified for the chart.

## 19.2.59 (2021-08-31)

### Chart

- `#I340170` - Resolved console error thrown on mouse move after removing the chart.
- Accumulation chart explode is now working properly.
- `339227` - Logarithmic axis is now working fine for data value below 1.

## 19.2.57 (2021-08-24)

### Chart

#### Bug Fixes

- `#337302` - Browser responsive issue while zooming the chart has been fixed.

## 19.2.56 (2021-08-17)

### Chart

#### Bug Fixes

- `#337487` - Query selector issue fixed for container ID.

## 19.2.55 (2021-08-11)

### Chart

#### New Features

- `#335166` - Provide Fade out support for chart tooltip on touch.

## 19.2.51 (2021-08-03)

### Chart

#### Bug Fixes

- `#337240` - Stripline working properly on canvas mode.

### Accumulation chart

#### Bug Fixes

- `#335684` - Data label positioning properly for pie chart.

## 19.2.49 (2021-07-27)

### Chart

#### Bug Fixes

- `#335336` - Chart series is now rendeirng properly while zooming in canvas mode.
- `#330763` - Tooltip template is now working fine without cropping.

### Accumulation chart

#### Bug Fixes

- `#335151` - Console error while selecting point after cancelling a tooltip has been fixed.

## 19.2.47 (2021-07-13)

### Sparkline

#### Bug Fixes

- Resolved the console script exception while mouseover on the Sparkline.

### Chart

#### Bug Fixes

- `#333145` - Point selection is now working properly, when specifying the selection on load.
- `#334269` - Range area series is now rendering properly in stock chart.

## 19.2.46 (2021-07-06)

### Chart

#### Bug Fixes

- `#332577` - `StepArea` gets truncated while using canvas mode issue has been fixed.

## 19.2.44 (2021-06-30)

### Chart

#### Bug Fixes

- `#331558` - Zooming working fine when the pan element not shown in toolbar.

#### New Features

- The "Spline Range Area" interactive chart series is now available.

### Stock Chart

#### New Features

- The legend feature has been added to the stock chart.

## 19.1.69 (2021-06-15)

### Chart

#### Bug Fixes

- `#329311` - Legend text is now rendering properly with ampersand symbol.

## 19.1.67 (2021-06-08)

### Chart

#### Bug Fixes

- `#F165670` - Marker Explode is now rendered properly with image.
- `#328528` - Histogram is rendering properly when the `binInterval` value is 0.
- `#328780` - `multiLevelLabelClick` event is now triggering in canvas mode.

## 19.1.65 (2021-05-25)

### Chart

#### Bug Fixes

- `#328528` - Histogram is rendering properly when the `binInterval` value is 0.

### Stock Chart

#### Bug Fixes

- `#F165171` - Tooltip for column in stock chart is working properly now.

## 19.1.64 (2021-05-19)

### Chart

#### Bug Fixes

- `#326473` - Print is now working properly with strip line dash array.

## 19.1.63 (2021-05-13)

### Chart

#### Bug Fixes

- `#325456` - Highlight and selection issue has been fixed for multiple charts.
- `#F165060` - Accumulation chart with data label is now rendering properly inside the dashboard layout.

#### New Features

- `#288255` - Improved logarithmic axis to show value less than 1.

## 19.1.59 (2021-05-04)

### Chart

#### Bug Fixes

- `#308029` - Console error thrown while using special character in the chart container ID issue has fixed.
- `#F164708` - The white space in the legend icon issue has been fixed.
- Accumulation chart refresh method removes inner HTML elements issue has been fixed.
- `#325193` - Rotating data label is now working properly

#### New Features

- `#289399` - Provided support to reverse the legend shape and text.

## 19.1.58 (2021-04-27)

### Accumulation chart

#### Bug Fixes

- `#323707` - Console error thrown while using various radius pie chart inside dashboard layout issue is fixed.

## 19.1.57 (2021-04-20)

### Chart

#### Bug Fixes

- `#F163318` - Need to skip data not available in shared tooltip issue fixed.

## 19.1.56 (2021-04-13)

### Chart

#### Bug Fixes

- `#I319735` - Axis label line break support doesn't work in canvas mode issue fixed.
- `#I319693` - Multilevel labels not working in canvas mode for y axis issue fixed.

### Chart

#### Bug Fixes

- `#310867` - 100% Stacking area is now working properly on browser resize.
- `#318354` - Scrollbar issue for bar type series is resolved.
- `#319835` - Normal distribution line in histogram series is rendering properly.

### Bullet chart

#### Bug Fixes

- `#318856` - Label for the negative data is now rendering properly.

## 19.1.54 (2021-03-30)

### Chart

#### New Features

- Range color mapping feature added.

#### Bug Fixes

- `#313827` - Fixed stripline fails issue on canvas mode.
- `#304737` - Remove child of null console error thrown while using canvas mode issue has been fixed.
- `#314894` - Stripline is not working in datetime for core platform issue fixed.
- `#F162046` - Dynamic indicator change using useState issue resolved.

## 18.4.46 (2021-03-02)

### Chart

#### Bug Fixes

- `#156827` - Axis line break label alignment issue has been fixed.

## 18.4.44 (2021-02-23)

### Chart

#### New Features

- `#253348` - Icon support for legend space has been provided.

## 18.4.43 (2021-02-16)

### Chart

#### Bug Fixes

- `#308967` - Chart horizontal strip line position changes issue has been fixed.
- `#21006` - Render fail using point color mapping if datasource array is empty issue fixed.

#### New Features

- `#281265` - Support for spacing between axis labels & axis title and padding for legend container implemented

### Accumulation chart

#### Bug Fixes

- `#308019` - Accumulation chart data labels are rendering over the chart issue has been fixed.
- `#308020` - The labels to each slice of the pie chart are not reactive issue has been fixed.

### RangeNavigator

#### Bug Fixes

- `#311116` - Disable range selector is not working issue has been fixed.

## 18.4.42 (2021-02-09)

### Chart

#### New Features

- `#292925, #311306` - Provided the support for chart trackball tooltip template.

#### Bug Fixes

- `#305550` - Dragging issue fixed on multi selection in chart.

## 18.4.41 (2021-02-02)

### Accumulation chart

#### Bug Fixes

- `#297039` - Fixed the data labels are overlapped issue in accumulation chart.

## 18.4.39 (2021-01-28)

### Chart

#### Bug Fixes

- `#308150` - Fixed the data label issue for label instersect action.
- `#307320` - Data label Template hides on hovering over the marker issue has been fixed.

## 18.4.35 (2021-01-19)

### Chart

#### Bug Fixes

- `#307141` - Issue fixed in Y axis range interval.

### Stock Chart

#### Bug Fixes

- `#306698` - Visible property in series is not working properly for stock chart issue fixed.

## 18.4.34 (2021-01-12)

### Chart

#### Bug Fixes

- `#293532` - Chart gets crash while using small values issue fixed.

## 18.4.30 (2020-12-17)

### Chart

#### Bug Fixes

- `#293532` - Chart gets crash while using small values issue fixed.
- `#300644` - Data label template console error in canvas mode issue fixed.

### RangeNavigator

#### Bug Fixes

- `#160214` - Range navigator cursor style issue fixed.

## 18.3.52 (2020-12-01)

### RangeNavigator

#### Bug Fixes

- `#294999` - Range navigator rendering properly for `Date` type.
- `#297551` - Text Wrap support added for chart axis title.

## 18.3.51 (2020-11-24)

### Chart

#### Bug Fixes

- `#295143` - Mouse wheel zooming issue has been fixed.
- `#299281` - Parent element `CSS` override issue has been fixed.
- `#291907, #296201, #296570` - Tooltip position support added.
- `#298154` - Update the color dynamically on pie chart has been fixed.
- `#298291` - The label issue of sum index value has been fixed.
- `#300936` - Histogram not rendering properly on duplicate data has been fixed.
- `#300428` - `visibleRange` value has been added in `zoomComplete` event.
- `#296739` - In multi color line type, segment values are not applied for multiple series issue fixed.

## 18.3.50 (2020-11-17)

### Chart

#### Bug Fixes

- `#295905` - Corner radius is not proper for value zero issue has been fixed.
- `#296280` - Chart legend is not hidden while visible property is set as false in button click issue has been fixed.
- `#285055` - Lazy load in the Chart is not working properly issue fixed.
- `#157667` - point click is not working for low values in column chart issue has been fixed.

## 18.3.48 (2020-11-11)

### Chart

#### Bug Fixes

- `#292894` - Chart axis title overlaps when `labelPadding` is provided for axis labels issue has been fixed.
- `#290869` - Axis label rotation issue has been fixed.
- `#299015` - Script error on hovering the chart in animation issue has been fixed.

## 18.3.47 (2020-11-05)

### Chart

#### Bug Fixes

- `#295143` - Scrollbar `zoomFactor` and `zoomPosition` related issue has been fixed.
- `#293312` - Waterfall series not working properly for 0 values issue has been fixed.
- `#296989` - PageX and PageY arguments are not available in pie pointClick event issue fixed.
- `#278146` - Scrollbar is not working properly for live data issue has been fixed.
- `#292251, 291578, 292855` - Chart axis label tooltip is getting cropped issue has been fixed.

## 18.3.44 (2020-10-27)

### Chart

#### Bug Fixes

- `#292116` - Y axis minimum value is wrong for column type chart when range is not set issue has been fixed.
- `#295143` - Initial minor grid line is not rendered while zooming issue has been fixed
- `#296223` - Empty point settings not working for line series in polar chart issue has been fixed.
- `#295866` - Multicolored and histogram chart console exception while providing empty datasource has been fixed.
- `#290990` - Console error when y values are not within specified range issue has been fixed.
- `#292455` - Scatter Series renders out of the chart Area issue fixed.
- `#291578` - Chart axis label tooltip is getting cropped issue has been fixed.

## 18.3.42 (2020-10-20)

### Chart

#### Bug Fixes

- `#280301` - Radar and polar chart tooltip cropping issue has been fixed.
- `#290360` - Scrollbar does not work properly on scrolling for `isInversed` issue has been fixed
- `#292937` - Trendlines not working properly while providing maximum value issue has been fixed.

### Sparkline

#### Bug Fixes

- `#264262` - Sparkline column is not proper when `rangepadding` is Normal issue has been fixed.

## 18.3.35 (2020-10-01)

### Stock Chart

#### Bug Fixes

- `#290529` - Date range picker is not proper when rendering 2 stock charts issue has been fixed.

## 18.2.56 (2020-09-01)

### Chart

#### Bug Fixes

- `#286177` - Place pie data labels based on space available.
- `#290274` - Axis label customization is not proper for double type.
- `#F155030` - DateTime Annotation does not work in ASP.NET Core has been fixed.
- `#F157038` - Empty chart with shared tooltip throws console error has been fixed.

## 18.2.55 (2020-08-25)

### Accumulation chart

#### Bug Fixes

- `#288484` - Accumulation chart class is removed while refreshing the chart issue fixed.

## 18.2.54 (2020-08-18)

### Chart

#### Bug Fixes

- `#287569` - Shared tooltip does not render for multiple line series when there is a single point issue fixed.
- `#285313` - Cancel property in arguments is not working properly on chart Load event issue fixed.
- `#287632` - Point Render event customization not applied for column chart markers issue fixed.

## 18.2.48 (2020-08-04)

### Accumulation chart

#### Bug Fixes

- `#286597` - Tooltip showing out of the chart area issue fixed.
- `#286177` - Pie chart data labels are overlapped when smart labels are enabled issue fixed.

## 18.2.47 (2020-07-28)

### Chart

#### Bug Fixes

- `#284735` - Primary y axis Lograthmic values are not rendering based on the data issue fixed.
- `#285055` - When we scroll to end some of the data is missing issue fixed.

## 18.2.46 (2020-07-21)

### Chart

#### Bug Fixes

- `#285003` - Chart DataSource is not updating when the page has more number of chart issue fixed.
- `#155963` - Added new API showZero to show data labels for value zero.
- `#283698` - point click event is not working in some random cases.

## 18.2.45 (2020-07-14)

- `#278688` - Added sharedTooltipRender event for shared tooltip in blazor.
- `#276213` - Added aria label for accumulation chart title.

### Chart

#### Bug Fixes

- `#155030` - Chart annotation is not working in datetime axis issue fixed.
- `#280301` - Radar and polar chart tooltip cropping issue fixed.
- `#155580` - Chart not rendered properly, when interval type is minutes for DateTime axis issue fixed.

### RangeNavigator

#### Bug Fixes

- `#278655` - Start and end of range slider values are wrongly calculated in `changed` event issue fixed.

### Sparkline

#### Bug Fixes

- `282664` - Dynamic change is not working properly in sparkline issue is fixed.

## 18.2.44 (2020-07-07)

### Chart

#### Bug Fixes

- `#280448` - After changing page layout from LTR to RTL label overlapping issue fixed.
- `#280364` - Stacking area while assigning empty data source console error issue fixed.
- `#281323` - Console error while using DateTime as `primaryYAxis` issue fixed.
- `#281651` - Other zooming actions prevented while scrollbar zooming enabled issue is fixed.

### Accumulation Chart

#### New Features

- Provided smart label placement support that places data labels smartly without overlapping one another in Pie and Doughnut charts.

## 18.1.56 (2020-06-09)

### Chart

#### Bug Fixes

- `#278688` - Shared Tooltip not visible while using tooltip render event issue fixed.
- `#278311` - Y axis labels get overlapped when using single negative point issue fixed.
- `#154576` - Range Selector doesn't match chart data range for one day issue fixed.
- `#279008` - Cluster selection with 0 values for logarithmic type issue fixed.

### Accumulation chart

#### Bug Fixes

- `#279297` - Height in percentage not working properly is fixed now.

## 18.1.55 (2020-06-02)

### Chart

#### Bug Fixes

- `#277354` - Data labels are getting cropped within the Chart issue fixed.
- `#278138` - Track ball hides in `stacking area` chart issue has been fixed.
- `#278485` - DateTime do not work properly if date time values are on the same day issue fixed.
- `#154240` - Point click not working on some scenarios issue has been fixed.

## 18.1.54 (2020-05-26)

### Stock Chart

#### Bug Fixes

- `#262890` - Label position is not working in stock chart primary y axis issue fixed.

### Chart

#### Bug Fixes

- `#273192` - Trendline slopes are not proper as per the datasource issue fixed.
- `#277748` - Chart rendered twice in blazor is now resolved.
- `#273410` - Chart resize issue in blazor has been fixed.

## 18.1.53 (2020-05-19)

### Accumulation chart

#### Bug Fixes

- `#153764` - The size of the doughnuts graphs does not display correctly in the Edge browser issue fixed.
- `#277504` - Explode Index 0 is not working in accumulation chart issue fixed.

### Chart

#### Bug Fixes

- `#273192` - Trendlines are placed behind the series issue has been fixed.
- `#274960` - `pageX` and `pageY` has been added in `pointClick event`.

## 18.1.52 (2020-05-13)

### Accumulation chart

#### Bug Fixes

- `#I273694` - Legend paging issue when legend position in Right side fixed.

## 18.1.48 (2020-05-05)

### Chart

#### Bug Fixes

- `#273192` - Trendlines are short and have the wrong slope direction issue fixed.
- `#267962` - when using react parcel, chart throws console error issue fixed.

## 18.1.45 (2020-04-21)

### Chart

#### Bug Fixes

- `#271540` - Chart zooming maintained while switch chart type from column to polar issue fixed.
- `#270524` - chart is broken when use `dir="rtl"` to the body tag issue fixed.
- `#270548` - While enabling scrollbar half of marker gets hidden issue fixed.
- `#271515` - Column chart is now working fine with column width is zero.

## 18.1.44 (2020-04-14)

### Chart

#### Bug Fixes

- `#269131` - Y Axis labels overlapped with the grid lines issue has been fixed.
- `#268698` - Legend click event argument null issue has been fixed.

### Accumulation chart

#### Bug Fixes

- `#271120` - Data labels are displayed even when its y value is zero issue has been fixed.
- `#152613` - Accumulation chart data label position is not proper when using template issue is fixed.

### Smith Chart

#### Bug Fixes

- `#152336` - Tooltip template issue fixed.
- `#269225` - Provided event support for before rendering of tooltip

### Chart

#### Bug Fixes

- `#255275` - While disabling some series console error occurs issue has been fixed.

## 18.1.43 (2020-04-07)

### Chart

#### Bug Fixes

- `#269627` - Logarithmic scale does not work with small values issue has been fixed.
- `#151645` - Error bar value is not updated dynamically issue has fixed.

### Accumulation chart

#### Bug Fixes

- `#267438` - Export chart in canvas mode issue has been fixed

## 18.1.36-beta (2020-03-19)

### Chart

#### New Features

- Provided support to highlight the data points in chart.
- Provided support for patterns to the selected and highlighted data.

#### Bug Fixes

- `#268306` - Console error thrown while hiding tooltip issue has been fixed.

### Bullet Chart

#### New Features

- Provided support to legend for targets, actual value and ranges in bullet chart.

## 17.4.51 (2020-02-25)

### Chart

#### Bug Fixes

- `#264474` - X axis labels are not rendered in center of tick marks when angle is 270 issue has fixed.
- `#264474` - Console error when angle is provided for x axis and data is assigned on vue mounted method issue has fixed.
- `#264230` - Tooltip doesn't appears after zooming and hovering on same point has fixed.
- `#151604` - Console error throwing when toggle the chart enableCanvas mode has fixed.

### Accumulation chart

#### Bug Fixes

- `263828` - Accumulation chart safari browser animation issue has fixed.

### RangeNavigator

#### Bug Fixes

- `266063` - Changed Event not triggered while releasing the click outside of the control has fixed.

### Sparkline

#### Bug Fixes

- `#264262` - `rangePadding` property is exposed to render the columns in the sparkline charts with proper axis padding.

## 17.4.50 (2020-02-18)

### Chart

#### Bug Fixes

- `#262128` - Legend gets cropped while adding series dynamically issue has fixed.
- `#261471` - Pie annotation template is not center in `blazor` issue fixed.
- `#255275` - Trendline throws console error when legend click issue fixed.
- `#262734` - Stripline date time is not support in asp core issue fixed.

## 17.4.47 (2020-02-05)

### Chart

#### Bug Fixes

- `262642` - Accumulation Chart data manager result getting previous data while using query issue has fixed.
- `147090` - 'clearSeries' Method is added to the Chart for clearing the all series.
- `#149030` - Label Intersect Action does not work for datalabel template issue fixed.
- `#262400` - Tooltip y value is not working when enable the group separator issue fixed.

## 17.4.46 (2020-01-30)

### Chart

#### New Features

- `#260004` - Provided support for polar and radar column spacing.
- `#257784` - Provided support for smart rendering of X-axis rotated labels.
- `#254646` - Provided Before export event support for export in chart.

#### Bug Fixes

- `#260205` - While using animate() method one series is not removed issue is fixed now.
- `#255275` - Console error thrown when changing the trendline type from linear to exponential trendline or                 other types is fixed now.

## 17.4.41 (2020-01-07)

### Stock Chart

#### New Features

- `#257199` - Provided support to enable/disable the Date Range Picker in Stock Chart's period selector.

#### Bug Fixes

- `#257199` - Tooltip stops showing after resizing window issue has fixed.

## 17.4.40 (2019-12-24)

### Chart

#### Bug Fixes

- `#149930` - Chart with DataManager in offline mode makes a request to the server for multiple times issue got fixed.
- Issue in Stacking line series with multiple axes is fixed now.
- `#257935` - Alignment issue in axis labels when rotated at 90 degree is fixed now.

## 17.4.39 (2019-12-17)

### RangeNavigator

#### Bug Fixes

- `#255451` - Label alignment issue in range navigator has been fixed.

### Chart

#### Bug Fixes

- `#256664` - Polar and radar axis labels overlapping with legend issue got fixed.
- `#149497` - Axis labels are invalid when using label format as percentage in stacking 100 percent series types issue got fixed.

### Bullet Chart

Bullet Chart is the variation of bar chart, which displays one or more measures, and compares it to a target value. You can also display the measures in a qualitative range of performance such as poor, satisfactory, or good. All stock elements are rendered by using Scalable Vector Graphics (SVG).

- **Data Binding** - Binds the data with local and remote data source.
- **Animation** - Feature and target bar will be animated when rendering.
- **Tooltip** - Supports tooltip for the feature and target bar.
- **Orientation** - Supports vertical and horizontal rendering.
- **Flow Direction** - Supports to render from right to left.
- **Multiple Target** - Supports multiple targets.
- **Data Labels** - Supports data label to enhance the data.

## 17.3.30 (2019-12-03)

### Chart

#### Bug Fixes

- `#256664` - Polar and radar axis labels overlapping with legend issue fixed.

## 17.3.28 (2019-11-19)

### Chart

#### Bug Fixes

- #252450 - In Polar series, selection did not work while clicking center of the marker which is plotted in the axis line is fixed
- #254803 - While clicking legend corresponding axis of the series will hide now.
- #252450 - Selection applied for marker shadow element is prevented now.
- #255392 - Axis label tooltip not disappeared when the mouse is moved away from chart issue fixed.
- #254710 - Border customization is not applied for legend in scatter chart is fixed.

## 17.3.27 (2019-11-12)

### Chart

#### Bug Fixes

- #250481 - Radar and Polar Chart isClosed not connecting to the first point when the minimum value set for the y axis issue has been fixed.

## 17.3.26 (2019-11-05)

### Chart

#### New Features

- #250563 - Provided support to render background image for chart.

#### Bug Fixes

- #253297 - Cross shape is now working fine in scatter chart.

## 17.3.21 (2019-10-30)

### Chart

#### New Features

- #249556 - Provided smart data label for polar radar chart.
- #249971 - Provided support to trim polar radar axis labels based on available size.

#### Bug Fixes

- #250412 - The axis missing in polar and radar issue is fixed.
- #148064 - Legend color is not working when using point color mapping issue is fixed.
- #252450 - Selection while clicking on marker border issue is fixed.

### Accumulation chart

#### Bug Fixes

- #252357 - 'remove' method is not support in IE 11 issue fixed.

## 17.3.19 (2019-10-22)

### Accumulation chart

#### Bug Fixes

- #148287 - Series DataSource change accumulation chart refresh issue fixed.

### Chart

#### Bug Fixes

- #250074 - Label placement between ticks is not working for radar chart issue fixed.
- #251346 - Radar and polar chart of draw type column and stacked column the values are plotted differently issue fixed

## 17.3.17 (2019-10-15)

### Chart

#### New Features

- #249554 - Provided smart axis label for polar radar chart.
- #239599 - Provided event support for tooltip template.

## 17.3.16 (2019-10-09)

### Accumulation Chart

#### New Features

- #249611 - Provided duration support for hiding the tooltip.

### Chart

#### New Features

- #249611 - Provided duration support for hiding the tooltip.

#### Bug Fixes

- #249730 - Polar chart column series with inversed axis with OnTicks rendering issue fixed.
- #250074 - Radar chart values are wrongly plotted in outside the axis issue fixed.
- #250064 - Radar and Polar Chart of Scatter Type is not rendering when the Value label is enabled issue fixed.
- #250336 - es2015 script error issue has fixed.
- #250081 - Radar and Polar chart when only one data is passed it is appearing as single dot issue fixed.

### Stock Chart

#### Bug Fixes

- `#249956` - Annotation rendering issue has fixed.

## 17.3.14 (2019-10-03)

### Chart

#### New Features

- Trim support have been provided for axis title in chart.
- Axis padding at desired position has been provided.

## 17.3.9-beta (2019-09-20)

### Accumulation Chart

#### New Features

- Border support have been provided for doughnut and pie while hovering.
- Options have been provided to rotate data labels.

### Chart

#### New Features

- Options provided to customize the series tooltip format separately.
- Multi-select options have been provided to allow users to select multiple regions in a chart.
- Lasso select options have been provided to allow users to select a region by drawing freehand shapes.
- Options have been provided to rotate data labels.

## 17.2.48-beta (2019-08-28)

### Chart

#### Bug Fixes

`#243156` - Drag complete returns value in string issue has been fixed.
`#245710` - Lograthmic is not working properly for smaller value issue has been fixed.
`#243156` - Selection is not proper at the edge issue has been fixed.
`#245710` - Y-Axis of Spline chart not adjusting scale to suit dataSource issue has been fixed.

## 17.2.36 (2019-07-24)

### Stock Chart

#### Bug Fixes

The `querySelector of null` console error issue has been fixed.

### RangeNavigator

#### Bug Fixes

The `appendChild of null` console error issue has been fixed.

### Chart

#### Bug Fixes

`#240342` - While scrolling chart's scrollbar Vertical HTML scrollbar goes up issue fixed.

### Accumulation chart

#### Bug Fixes

- #241559 - Console error on doughnut chart when trying to hide a point via legend icon issue fixed.

## 17.2.34 (2019-07-11)

### Accumulation chart

#### Bug Fixes

- #240342 - Accumulation chart print not working proper in IE and Edge browsers issue fixed.

## 17.2.28-beta (2019-06-27)

### Chart

#### New Features

- Canvas rendering mode support provided.
- Overlapping data labels in funnel and pyramid charts will be arranged on both sides of the charts.
- Data Editing support provided for chart series points.
- Multi level label click event added with custom object.

#### Breaking Changes

- sizeType enumeration name changed to SizeType

### Stock Chart

#### Breaking Changes

- sizeType enumeration name changed to SizeType

## 17.1.51 (2019-06-11)

### Chart

#### Bug Fixes

- #144983 - Label style not working in axisLabelRender event for polar and radar series type issue fixed.
- #237811 - Chart rendered with default width in Internet Explorer issue fixed.

## 17.1.49 (2019-05-29)

### Stock Chart

#### Bug Fixes

- #236896 - Provided mouse event in stock charts

## 17.1.47 (2019-05-14)

### Chart

#### New Features

- #233749 - Provided zOrder support for chart series.

## 17.1.43 (2019-04-30)

### Chart

#### Bug Fixes

- #219174 - Multi line axis label is not proper when using multiple rows intersect action issue has been fixed.
- #231943 - Console error throws when using area chart out of the axis range has been fixed.
- #234027 - Chart is not destroying properly while calling destroy method issue fixed.

## 17.1.41 (2019-04-16)

### Chart

#### Bug Fixes

- Support has been provided for multiple export in horizontal mode.

## 17.1.40 (2019-04-09)

### Accumulation chart

#### Bug Fixes

- Now Accumulation chart is refreshing properly on data change.

### Chart

#### Bug Fixes

- Stacking column is not rendered properly when yvalue in string is fixed.
- Zoomposition is not proper, when the axis is inversed is fixed.
- Multiline label alignment is not proper, when breaking the labels into smaller text issue fixed

## 17.1.32-beta (2019-03-13)

### Chart

#### New Features

- Stacking Line series type has been added to the chart.
- 100% Stacking Line series type has been added to the chart.
- Support has been provided to wrap axis labels to multiple lines.
- Chart now supports animation on data updation.

#### Bug Fixes

- Zooming icons are not visible on refreshing chart is fixed.
- Chart not exported to SVG in IE11 is fixed.
- Now the secondary axis is removed after changing the series type from pareto to line.
- Legend color is not changing while changing point color using point render event is fixed.

### Stock Chart

#### New Features

- Stock chart now allows stock events to highlight important dates.

## 17.1.1-beta (2019-01-29)

### Sparkline

#### New Features

- The right-to-left (RTL) rendering support has been provided

## 16.4.48 (2019-01-22)

### Chart

#### Bug Fixes

- Scatter chart's edge position render issue is fixed
- Datalabel did not show properly in Edge browser is fixed
- Trendline not rendering while using NaN as input issue is fixed
- DataSource not refreshed in angular chart has been fixed.

## 16.4.47 (2019-01-16)

### Chart

#### Bug Fixes

- Chart not rendering using remote data without query issue is fixed

## 16.4.45 (2019-01-02)

### Chart

#### Bug Fixes

- Duplicates of scrollbar id in multiple chart is fixed

## 16.4.44 (2018-12-24)

### Stock Chart

#### Bug Fixes

- Console error in tooltip fixed
- Highlight of buttons in period selector is working properly.
- Height of stock chart without period selector, range navigator is working fine

## 16.4.42 (2018-12-14)

### Chart

#### Breaking Changes

- Export functionality has been moved into separate module. To export the chart, inject the `Export` module.

## 16.4.40-beta (2018-12-10)

### Chart

#### New Features

- Support for grid line animation has been provided.
- Support has been provided to load data on-demand.

### Accumulation chart

#### New Features

- The center option has been provided to the accumulation chart.
- Support has been provided for different radius in pie slice.

### Stock Chart

Stock Chart component is used to track and visualize stock price of any company over a specific period using charting and range tools. All stock elements are rendered by using Scalable Vector
Graphics (SVG).

- **Data Binding** - Binds the data with local and remote data source.
- **Chart** - To represent the selected data and its supports candle, hilo, OHLC, line, spline and area type series.
- **Range Selector** - To select the smaller range from a larger collection.
- **Data Types** - Supports three different types of data, namely Numerical, Datetime, and Logarithmic.
- **Animation** - Chart series and slider will be animated when rendering and changing the selected data.
- **Period Selector** - Supports period selector to select data based on predefined periods.
- **Tooltip** - Supports tooltip for the selected data.
- **Export** - Supports to print the chart directly from the browser and exports in both JPEG and PNG format.

## 16.3.33 (2018-11-20)

### Chart

#### New Features

- Margin options are added to legend.

#### Bug Fixes

- Chart is now refreshing on changing the dataSource in series directive.
- Axis label is now rendering properly, when we have the interval in decimals.

## 16.3.32 (2018-11-13)

### Chart

#### Bug Fixes

- Polar area type border closing issue fixed.
- scrollbar inverted axis position issue fixed.

## 16.3.29 (2018-10-31)

### Chart

#### New Features

- Options provided to change the header text in tooltip.

## 16.3.27 (2018-10-23)

### Chart

#### Bug Fixes

- Stroke width for line type legend is now working fine.

## 16.3.24 (2018-10-09)

### Chart

#### Bug Fixes

- Data label template now working properly in angular.

## 16.3.22 (2018-09-25)

### Chart

#### Bug Fixes

- PDF export is now working properly in high resolution.

## 16.3.17 (2018-09-12)

### Chart

#### Bug Fixes

- Chart now working properly in IE11 after legend click.

#### New Features

- The Pareto series type has been added to the chart.
- Support has been added to the segmented, dashed, and recurrence striplines.
- Support has been added to subtitle of the chart.
- Support has been provided to trim the axis label.
- Animation effect has been added to the chart after legend click.
- The date-time label format has been improved.

### Accumulation chart

#### Bug Fixes

- Now, opacity is working properly for the series.

#### New Features

- Animation effect has been added to the accumulation chart after legend click.
- Support has been provided for broken slice to the grouped points.

## 16.2.49 (2018-08-21)

### Chart

#### Bug Fixes

- Changing label color is now working properly in `axisLabelRender` event.

## 16.2.48 (2018-08-14)

### Chart

#### New Features

- Added font argument in `textRender` event to change the font style for datalabel text.

## 16.2.47 (2018-08-07)

### Chart

#### Bug Fixes

- Removed chartmeasuretext element from the DOM.
- Outliers in Box and Whisker series is not rendering on mouse over, when we setting the marker
visibility to false.

## 16.2.46 (2018-07-30)

### Chart

#### New Features

- Added tooltipMappingName API for binding text to tooltip from dataSource.
- Added public property to show total pages enabled in legend pagination.

## 16.2.45 (2018-07-17)

### Chart

#### Bug Fixes

- Axis Label is now rendering properly on rotating, without trimming.
- DashArray is now working properly for connector line.

#### New Features

- Added common API for binding dataSource for all series.

## 16.2.44 (2018-07-10)

### Chart

#### Bug Fixes

- Now column series is rendering properly with single data in datetime axis.

## 16.2.41 (2018-06-25)

### Chart

#### Breaking Changes

- Newly Added Range Navigator component in charts package requires Navigations and Calendars dependency, so its mandatory to include the `ej2-navigations.umd.min.js` and `ej2-calendars.umd.min.js` in system.js configuration if you are using system.js module loader.
- SVG tooltip has been moved as a separate package, so the charts require SVG-base dependency to show the tooltip. so its mandatory to include the `ej2-svg-base.umd.min.js` in system.js configuration if you are using system.js module loader.

#### Bug Fixes

- Now, tooltip is working properly when the container for chart is initialized without ID.
- The performance issue with loading 800 series in chart has been fixed.
- Loaded event is now triggering after legend click.

#### New Features

- Histogram series type has been added to chart.
- Scrollbar feature has been added to zoom and pan the chart.

### Accumulation Chart

#### Breaking Changes

- Newly Added Range Navigator component in charts package requires Navigations and Calendars dependency, so its mandatory to include the `ej2-navigations.umd.min.js` and `ej2-calendars.umd.min.js` in system.js configuration if you are using system.js module loader.
- SVG tooltip has been moved as a separate package, so the charts require SVG-base dependency to show the tooltip. so its mandatory to include the `ej2-svg-base.umd.min.js` in system.js configuration if you are using system.js module loader.

#### New Features

- Support has been provided to group the pie slice based on count.

### RangeNavigator

The range navigator provides an intuitive interface for selecting a smaller range from a larger collection. It is commonly used in financial dashboards to filter a date range for which the data needs to be visualized. This control easily combines with other controls such as Chart, Data Grid, etc., to create rich and powerful dashboards.

- **Data Binding** - Binds the data with local and remote data source.
- **Chart** - To represent the data in RangeNavigator and its supports line, step line and area type series.
- **Slider** - To handle the selected data in RangeNavigator.
- **Data Types** - Supports three different types of data, namely Numerical, Datetime, and Logarithmic.
- **Animation** - Chart series and slider will be animated when rendering and changing the selected data.
- **Period Selector** - Supports period selector to select data based on predefined periods.
- **Light Weight** - Supports light weight RN to navigate through the data based on range.
- **Tooltip** - Supports tooltip for the selected data.
- **Export** - Supports to print the range navigator directly from the browser and exports the range navigator in both JPEG and PNG format.

### Sparkline

Sparklines are easy to interpret and also it conveys much more information to the user by visualizing the data in a small amount of space.

- **Types** - Sparklines had five type of series. Line, Area, Column and WinLoss and Pie.
- **Marker** - Sparklines support the marker feature.
- **DataLabel** - Sparklines support the datalabel feature. It uses to identify the x and y value for the current point.
- **Range Band** - Sparklines support the rangeband feature. It used to denote the certain range sparkline points.
- **Tooltip** - Sparklines support the tooltip feature. It used to interact with points to get more about current point.

### Smith Chart

Smith chart is one of the most useful data visualization tools for high frequency circuit applications. It contains two sets of circles to plot the parameters of transmission lines.

- **Types** - Smithchart had two type of rendering. Impedance and Admittance.
- **Marker** - Smithchart supports the marker feature. It used to identify point position.
- **Datalabel** - Smithchart supports the datalabel feature. It used to identify point values.
- **Legend** - Smithchart supports the legend feature. It used to denote each series names.
- **Tooltip** - Smithchart supports the tooltip feature. It used to get point values on user interaction like mouse and touch actions.
- **Print and Export** - Smithchart supports printing and exporting as different file types.

## 16.1.48 (2018-06-13)

### Chart

#### Bug Fixes

- Mean value for Box and Whisker is now rendering properly with multiple series.

## 16.1.40 (2018-05-08)

### Chart

#### Bug Fixes

- Column width is now working properly, when enabling the `enableSideBySidePlacement` property.

## 16.1.37 (2018-04-24)

### Common

#### Bug Fixes

- Performance related issue, when loading more number of chart in angular has been fixed.

### Accumulation Chart

#### Bug Fixes

- Skipped slice rendering when `y` value as 0.

## 16.1.35 (2018-04-17)

### Common

#### Bug Fixes

- Adding `annotation` dynamically to the chart is now working.

## 16.1.29 (2018-03-13)

### Chart

#### Bug Fixes

- Issue in `removeSeries` has been fixed.
- Zooming is now working properly, when enabling the panning through code.

## 16.1.24 (2018-02-22)

### Common

#### New Features

- Added support for SVG and PDF export.

### Chart

#### New Features

- Multicolored line type and area type series have been added to chart.
- A new date-time category axis has been added.
- Spline area series type has been added to chart.
- Support has been provided to customize axis labels in multiple levels.
- Support has been provided to wrap the chart title.
- Support has been provided to sort data points in either ascending or descending order.
- Supports to move the axis labels and ticks inside the chart area.
- Axis crossing feature has been added to chart.

## 15.4.27-preview (2018-01-30)

### Chart

#### Bug Fixes

- Vertical chart for step area is not working fixed.
- Stacking Area in polar and radar not proper is fixed.
- MACD indicators not working properly in angular is fixed.
- Marker explode not proper on image type is fixed.
- Datalabel template for stacking 100 is now working properly.
- Pinch zooming is now working properly when zoom factor and position is provided.
- Binding complex datasource to chart series is now working properly.

## 15.4.23-preview (2017-12-27)

### Common

#### New Features

- Added typing file for ES5 global scripts (dist/global/index.d.ts)

#### Breaking Changes

- Modified the module bundle file name for ES6 bundling

## 15.4.22-preview (2017-12-14)

### Common

#### New Features

- Upgraded TypeScript version to 2.6.2

## 15.4.17-preview (2017-11-13)

### Chart

Chart component is used to visualize the data with user interactivity and provides customization
options to configure the data visually. All chart elements are rendered by using Scalable Vector
Graphics (SVG).

- **Series** - Chart can plot over 28 chart types that are ranging from line charts to specialized financial charts
- **Data Binding** - Binds the data with local and remote data source.
- **Data Labels and Markers** - Supports data label and marker to annotate and enhance a data.
- **Error Bar** - Supports error bar to plot possible errors in data points.
- **Axis Types** - Supports four different types of axes, namely Numerical, Categorical, Datetime, and Logarithmic.
- **Axis Feature** - Supports multiple axes, inverted axis, multiple panes, opposed position,stripline, and smart labels.
- **Legend** - Supports legend to provide additional information about a series with paging and customization options.
- **Technical Indicators** -  Support for RSI, Momentum, Bollinger band, accumulation distribution,EMA, SMA, stochastic, ATR, MACD, and TMA indicators.
- **Trendlines** - Supports linear, exponential, logarithmic, power, polynomial, and moving average trendlines.
- **Animation** - Chart series will be animated when rendering and refreshing the chart widget.
- **User Interaction** - Supports interactive features that are zooming, panning, crosshair, trackball, tooltip, and data point selection.
- **Annotation** - Supports annotation to mark a specific area in chart.
- **Export** - Supports to print the chart directly from the browser and exports the chart in both JPEG and PNG format.
