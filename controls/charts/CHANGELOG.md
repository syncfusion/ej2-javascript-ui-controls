# Changelog

## [Unreleased]

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
