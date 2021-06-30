# Changelog

## [Unreleased]

## 18.4.30 (2020-12-17)

### Heatmap

#### Bug Fixes

- `#287830` - The issue with using setState in the HeatMap has been resolved.

## 18.4.39 (2021-01-28)

### Heatmap

#### Bug Fixes

- `#299279` - The issue "API level styles was not taken as important for HeatMap" has been resolved.

## 18.2.57 (2020-09-08)

### Heatmap

#### Bug Fixes

- The unwanted tags were removed.

## 18.1.54 (2020-05-26)

### HeatMap

#### Bug Fixes

- `#277767` - Issue with get the exact position of mouse in cell click event has been fixed.

#### Bug Fixes

- `#270398` -issue with tooltip while using scale has been fixed.

#### Bug Fixes

- `#277945` - Legend label cropping issue has been fixed.

## 18.1.52 (2020-05-13)

### HeatMap

#### Bug Fixes

- `#270398` - Heatmap tooltip alignment issue has been fixed.

## 18.1.45 (2020-04-21)

### HeatMap

#### Bug Fixes

- `#271846` - Legend label cropping issue has been fixed.

## 18.1.36-beta (2020-03-19)

### HeatMap

#### New Features

- `#259129` - Provided the support to display the exceeding X-Axis label using the `labelIntersectAction` property value as `MultipleRows`.
- Now the lengthier Y-Axis label can trimmed with ellipses using the `maxLabelLength` property.

## 17.4.39 (2019-12-17)

### HeatMap

#### New Features

- `#234060`, `#246529` - Provided the cell color customization support for heatmap by using the `cellRender` event.
- Provided the legend title support to customize the legend title in heatmap.
- Provided the support for a cell color range to customize a cell color based on the range value.

## 17.3.9-beta (2019-09-20)

### HeatMap

#### New Features

- Provided a minimum and maximum color display based on row and column wise

#### Breaking Changes

The `dataSource` property has been split into `dataSource` and `dataSourceSettings` properties.
The `dataSource` property is used to bind data to HeatMap and the `dataSourceSettings` property is used to configure the data source using adaptor settings.

## 17.2.28-beta (2019-06-27)

### HeatMap

#### New Features

- Now it is possible to customize the legend label using legendRender event.

## 17.1.47 (2019-05-14)

### HeatMap

#### New Features

- #230837, #229200 - Provided the tool tip template support for customizing the cell tool tip.

## 17.1.32-beta (2019-03-13)

### HeatMap

#### New Features

- Now it is possible to select or deselect multiple cells in Heatmap by holding CTRL key and mouse click actions.

## 17.1.1-beta (2019-01-29)

### HeatMap

#### New Features

- Now it is possible to provide minimum and maximum values for bubble size in Bubble Heatmap.
- Provided support for resized and loaded client-side events in Heatmap. The resized event will be triggered before Heatmap being rendered and the loaded event will be triggered after Heatmap is completely rendered on window resize action.

## 16.4.53 (2019-02-13)

### HeatMap

#### Bug Fixes

- The console window exception which is thrown for mouse hovering action on legend labels in Firefox browser has been handled.

## 16.4.40-beta (2018-12-10)

### HeatMap

#### New Features

- Support for toggling the cell visibility with legend selection has been added for fixed type legend in heat map. This support helps to view the data points with values which matches the legend selection.
- Multi-level axis label grouping feature has been added to heat map.
- Cell selection feature has been added to heat map, this feature helps to select single or multiple heat map cells at run-time.
- Support for binding date object to axis labels for cell JSON data has been provided.
- Support for auto generating axis labels for cell JSON data has been provided.
- Provided support for formatting legend label in heat map.
- Provided support for customizing the cell tool tip UI.
- Provided support for customizing the data labels.

## 16.3.27 (2018-10-23)

### HeatMap

#### Bug Fixes

- Axis labels tooltip cropping issue has been fixed
- Issue with heatmap margin with minimum axis label size has been fixed.

## 16.3.24 (2018-10-09)

### HeatMap

#### Bug Fixes

- Issue with rendering heatmap with smaller dimensions has been fixed.

## 16.3.17 (2018-09-12)

### HeatMap

#### New Features

- Bubble tile type support has been included in heatmap for visualizing data points by mapping the data to bubble size and bubble color.
- Axis label increment feature has been added to heat map. It’s is used to display the axis label with regular interval values in numeric and date time axes
- Provided the smart legend feature for fixed type legend.
- Provided the support for nested data binding for JSON data.

## 16.2.41 (2018-06-25)

### HeatMap

The HeatMap control is used to visualize a two-dimensional data in which the values are represented in gradient or fixed colors.

- **Axis Types** - Supports three different types of axes to populate the data, namely Numerical, Categorical,and Datetime.
- **Axis Feature** - Supports inverted axis, opposed position and axis intervals.
- **Legend** - Supports legend which provides value information for the colors which represents each values in HeatMap.
- **Data Binding** - Supports binding data in JSON and two-dimensional array formats.
- **Rendering Modes** - Supports automatic switching between SVG and Canvas rendering modes based on the data source length.
