# Changelog

## [Unreleased]

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
