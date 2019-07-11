/**
 * Specifies common enumerations
 */

/** 
 * Defines mode of render. They are
 * * Fixed
 * * Popup
 */
export type Mode =
    /** Shows field list within a popup dialog */
    'Fixed' |
    /** Shows field list in a static position */
    'Popup';

/* Defines modes of editing.
* * Normal
* * Dialog
* * Batch
*/
export type EditMode =
    /**  Defines EditMode as Normal */
    'Normal' |
    /**  Defines EditMode as Dialog */
    'Dialog' |
    /**  Defines EditMode as Batch */
    'Batch';

export type SelectionMode =
    /**  Defines SelectionMode as Cell */
    'Cell' |
    /**  Defines SelectionMode as Row */
    'Row' |
    /**  Defines SelectionMode as Column */
    'Column' |
    /**  Defines SelectionMode for both Row and Column */
    'Both';

export type PdfBorderStyle = 'Solid' | 'Dash' | 'Dot' | 'DashDot' | 'DashDotDot';

export type ToolbarItems = 'New' | 'Save' | 'SaveAs' | 'Load' | 'Rename' | 'Remove' | 'Grid' | 'Chart' | 'Export' |
    'SubTotal' | 'GrandTotal' | 'FieldList' | 'ConditionalFormatting';

export type View =
    /**  Defines the view port as both chart and table */
    'Both' |
    /**  Defines the view port as chart */
    'Chart' |
    /**  Defines the view port as table */
    'Table';

export type Primary =
    /**  Defines the primary view as chart */
    'Chart' |
    /**  Defines the primary view as table */
    'Table';

export type ChartSeriesType =
    /**  Define the line series. */
    'Line' |
    /**  Define the Column series. */
    'Column' |
    /**  Define the Area series. */
    'Area' |
    /**  Define the Bar series. */
    'Bar' |
    /**  Define the StackingColumn series. */
    'StackingColumn' |
    /**  Define the StackingArea series. */
    'StackingArea' |
    /**  Define the StackingBar series. */
    'StackingBar' |
    /**  Define the Stepline series. */
    'StepLine' |
    /**  Define the Steparea series. */
    'StepArea' |
    /**  Define the Steparea series. */
    'SplineArea' |
    /**  Define the Scatter series. */
    'Scatter' |
    /**  Define the Spline series. */
    'Spline' |
    /** Define the StackingColumn100 series */
    'StackingColumn100' |
    /** Define the StackingBar100 series */
    'StackingBar100' |
    /** Define the StackingArea100 series */
    'StackingArea100' |
    /** Define the Bubble Series */
    'Bubble' |
    /** Define the Pareto series */
    'Pareto' |
    /** Define the Polar series */
    'Polar' |
    /** Define the Radar series */
    'Radar';

export type ChartSelectionMode =
    /** Disable the selection. */
    'None' |
    /** To select a series. */
    'Series' |
    /** To select a point. */
    'Point' |
    /** To select a cluster of point. */
    'Cluster' |
    /** To select points, by dragging with respect to both horizontal and vertical axis. */
    'DragXY' |
    /** To select points, by dragging with respect to vertical axis. */
    'DragY' |
    /** To select points, by dragging with respect to horizontal axis. */
    'DragX';
/** 
 * Defines the default items of context menu.
 */
export type PivotContextMenuItem =
    /**  Enables drill through for the cell */
    'Drillthrough' |
    /**  expands the cell */
    'Expand' |
    /**  collapse the cell */
    'Collapse' |
    /**  Enables calculated field for the pivot grid */
    'CalculatedField' |
    /**  Export the grid as Pdf format */
    'Pdf Export' |
    /**  Export the grid as Excel format */
    'Excel Export' |
    /**  Export the grid as CSV format */
    'Csv Export' |
    /**  Sort the current column in ascending order */
    'Sort Ascending' |
    /**  Sort the current column in descending order */
    'Sort Descending' |
    /**  Sets aggregate type to sum */
    'Aggregate';

/**
 * Defines modes of GridLine, They are
 * * Both - Displays both the horizontal and vertical grid lines.
 * * None - No grid lines are displayed.
 * * Horizontal - Displays the horizontal grid lines only.
 * * Vertical - Displays the vertical grid lines only.
 * * Default - Displays grid lines based on the theme.
 */
export type PivotGridLine =
    /** Show both the vertical and horizontal line in the Grid  */
    'Both' |
    /** Hide both the vertical and horizontal line in the Grid  */
    'None' |
    /** Shows the horizontal line only in the Grid */
    'Horizontal' |
    /** Shows the vertical line only in the Grid  */
    'Vertical' |
    /** Shows the grid lines based on the theme  */
    'Default';

/**
 * Defines mode of cell selection.
 * * Flow
 * * Box
 */
export type PivotCellSelectionMode =
    /**  Defines CellSelectionMode as Flow */
    'Flow' |
    /**  Defines CellSelectionMode as Box */
    'Box' |
    /**  Defines CellSelectionMode as Box with border */
    'BoxWithBorder';

/**
 * Defines types of Selection. They are
 * * Single - Allows user to select a row or cell.
 * * Multiple - Allows user to select multiple rows or cells.
 */
export type PivotSelectionType =
    /**  Defines Single selection in the Grid */
    'Single' |
    /**  Defines multiple selections in the Grid */
    'Multiple';

/**
 * Defines modes of checkbox Selection. They are
 * * Default
 * * ResetOnRowClick
 */
export type PivotCheckboxSelectionType =
    /**  Allows the user to select multiple rows by clicking rows one by one */
    'Default' |
    /**  Allows to reset the previously selected row when a row is clicked and multiple rows can be selected by using CTRL or SHIFT key */
    'ResetOnRowClick';

/**
 * Defines the cell content's overflow mode. The available modes are
 * * `Clip` -  Truncates the cell content when it overflows its area.
 * * `Ellipsis` -  Displays ellipsis when the cell content overflows its area.
 * * `EllipsisWithTooltip` - Displays ellipsis when the cell content overflows its area
 * also it will display tooltip while hover on ellipsis applied cell.
 */
export type PivotClipMode =
    /**  Truncates the cell content when it overflows its area */
    'Clip' |
    /** Displays ellipsis when the cell content overflows its area */
    'Ellipsis' |
    /** Displays ellipsis when the cell content overflows its area also it will display tooltip while hover on ellipsis applied cell. */
    'EllipsisWithTooltip';

/**
 * Print mode options are
 * * AllPages - Print all pages records of the Grid.
 * * CurrentPage - Print current page records of the Grid.
 */
export type PivotPrintMode =
    /**  Defines PrintMode as AllPages */
    'AllPages' |
    /**  Defines PrintMode as CurrentPage */
    'CurrentPage';

/**
 * Defines the shape of marker. They are
 * * circle - Renders a circle.
 * * rectangle - Renders a rectangle.
 * * triangle - Renders a triangle.
 * * diamond - Renders a diamond.
 * * cross - Renders a cross.
 * * horizontalLine - Renders a horizontalLine.
 * * verticalLine - Renders a verticalLine.
 * * pentagon- Renders a pentagon.
 * * invertedTriangle - Renders a invertedTriangle.
 * * image - Renders a image.
 */
export type PivotChartShape =
    /** Render a circle. */
    'Circle' |
    /** Render a Rectangle. */
    'Rectangle' |
    /** Render a Triangle. */
    'Triangle' |
    /** Render a Diamond. */
    'Diamond' |
    /** Render a Cross. */
    'Cross' |
    /** Render a HorizontalLine. */
    'HorizontalLine' |
    /** Render a VerticalLine. */
    'VerticalLine' |
    /** Render a Pentagon. */
    'Pentagon' |
    /** Render a InvertedTriangle. */
    'InvertedTriangle' |
    /** Render a Image. */
    'Image';

/**
 * Defines the type of error bar. They are
 * * fixed -  Renders a fixed type error bar.
 * * percentage - Renders a percentage type error bar.
 * * standardDeviation - Renders a standard deviation type error bar.
 * * standardError -Renders a standard error type error bar.
 * * custom -Renders a custom type error bar.
 */
export type PivotChartErrorBarType =
    /** Define the Fixed type. */
    'Fixed' |
    /** Define the Percentage type. */
    'Percentage' |
    /** Define the StandardDeviation type . */
    'StandardDeviation' |
    /** Define the StandardError type . */
    'StandardError' |
    /** Define the Custom type . */
    'Custom';

/**
 * Defines the direction of error bar. They are
 * * both -  Renders both direction of error bar.
 * * minus - Renders minus direction of error bar.
 * * plus - Renders plus direction error bar.
 */
export type PivotChartErrorBarDirection =
    /** Define the Both direction. */
    'Both' |
    /** Define the Minus direction. */
    'Minus' |
    /** Define the Plus direction . */
    'Plus';

/**
 * Defines the modes of error bar. They are
 * * vertical -  Renders a vertical error bar.
 * * horizontal - Renders a horizontal error bar.
 * * both - Renders both side error bar.
 */
export type PivotChartErrorBarMode =
    /** Define the Vertical mode. */
    'Vertical' |
    /** Define the Horizontal mode. */
    'Horizontal' |
    /** Define the Both mode . */
    'Both';

/**
 * Defines the type of trendlines. They are
 * * Linear - Defines the linear trendline
 * * Exponential - Defines the exponential trendline
 * * Polynomial - Defines the polynomial trendline
 * * Power - Defines the power trendline
 * * Logarithmic - Defines the logarithmic trendline
 * * MovingAverage - Defines the moving average trendline
 */
export type PivotChartTrendlineTypes =
    /** Defines the linear trendline */
    'Linear' |
    /** Defines the exponential trendline */
    'Exponential' |
    /** Defines the polynomial trendline */
    'Polynomial' |
    /** Defines the power trendline */
    'Power' |
    /** Defines the logarithmic trendline */
    'Logarithmic' |
    /** Defines the moving average trendline */
    'MovingAverage';

/**
 * Defines the shape of legend. They are
 * * circle - Renders a circle.
 * * rectangle - Renders a rectangle.
 * * triangle - Renders a triangle.
 * * diamond - Renders a diamond.
 * * cross - Renders a cross.
 * * horizontalLine - Renders a horizontalLine.
 * * verticalLine - Renders a verticalLine.
 * * pentagon - Renders a pentagon.
 * * invertedTriangle - Renders a invertedTriangle.
 * * SeriesType -Render a legend shape based on series type.
 */
export type PivotChartLegendShape =
    /** Render a circle. */
    'Circle' |
    /** Render a Rectangle. */
    'Rectangle' |
    /** Render a Triangle. */
    'Triangle' |
    /** Render a Diamond. */
    'Diamond' |
    /** Render a Cross. */
    'Cross' |
    /** Render a HorizontalLine. */
    'HorizontalLine' |
    /** Render a VerticalLine. */
    'VerticalLine' |
    /** Render a Pentagon. */
    'Pentagon' |
    /** Render a InvertedTriangle. */
    'InvertedTriangle' |
    /** Render a legend shape based on series type. */
    'SeriesType';

/**
 * Defines the empty point mode of the chart.
 * * Gap - Used to display empty points as space.
 * * Zero - Used to display empty points as zero.
 * * Drop - Used to ignore the empty point while rendering.
 * * Average - Used to display empty points as previous and next point average.
 */
export type PivotChartEmptyPointMode =
    /** Used to display empty points as space  */
    'Gap' |
    /** Used to display empty points as zero  */
    'Zero' |
    /** Used to ignore the empty point while rendering  */
    'Drop' |
    /** Used to display empty points as previous and next point average  */
    'Average';

/**
 * Defines the Alignment. They are
 * * near - Align the element to the left.
 * * center - Align the element to the center.
 * * far - Align the element to the right.
 * *
 */
export type PivotChartAlignment =
    /** Define the left alignment. */
    'Near' |
    /** Define the center alignment. */
    'Center' |
    /** Define the right alignment. */
    'Far';

/**
 * Defines the Text overflow.
 * * None - Shown the chart title with overlap if exceed.
 * * Wrap - Shown the chart title with wrap if exceed.
 * * Trim - Shown the chart title with trim if exceed.
 */
export type PivotChartTextOverflow =
    /** Used to show the chart title with overlap to other element */
    'None' |
    /** Used to show the chart title with Wrap support */
    'Wrap' |
    /** Used to show the chart title with Trim */
    'Trim';

/**
 * Defines the unit of Strip line Size. They are
 * * auto
 * * pixel
 * * year
 * * month
 * * day
 * * hour
 * * minutes
 * * seconds
 */
export type PivotChartSizeType =
    /**  Auto - In numeric axis, it will consider a number and DateTime axis, it will consider as milliseconds. */
    'Auto' |
    /**  Pixel - The stripline gets their size in pixel */
    'Pixel' |
    /**  Years - The stipline size is based on year in the DateTime axis. */
    'Years' |
    /**  Months - The stipline size is based on month in the DateTime axis. */
    'Months' |
    /**  Days - The stipline size is based on day in the DateTime axis. */
    'Days' |
    /**  Hours - The stipline size is based on hour in the DateTime axis. */
    'Hours' |
    /**  Minutes - The stipline size is based on minutes in the DateTime axis. */
    'Minutes' |
    /**  Seconds - The stipline size is based on seconds in the DateTime axis. */
    'Seconds';

/**
 * Defines the strip line text position.
 * * Start - Places the strip line text at the start.
 * * Middle - Places the strip line text in the middle.
 * * End - Places the strip line text at the end.
 */
export type PivotChartAnchor =
    /** Places the strip line text at the start. */
    'Start' |
    /** Places the strip line text in the middle. */
    'Middle' |
    /** Places the strip line text at the end. */
    'End';

/**
 *  Specifies the order of the strip line. `Over` | `Behind`.
 * * Over - Places the strip line over the series elements.
 * * Behind - laces the strip line behind the series elements.
 */
export type PivotChartZIndex =
    /** Places the strip line over the series elements. */
    'Over' |
    /** Places the strip line behind the series elements. */
    'Behind';

/**
 * Defines border type for multi level labels.
 * * Rectangle
 * * Brace
 * * WithoutBorder
 * * Without top Border
 * * Without top and bottom border
 * * Curly brace
 */
export type PivotChartBorderType =
    /** Rectangle */
    'Rectangle' |
    /** Brace */
    'Brace' |
    /** WithoutBorder */
    'WithoutBorder' |
    /** WithoutTopBorder */
    'WithoutTopBorder' |
    /** WithoutTopandBottomBorder */
    'WithoutTopandBottomBorder' |
    /** CurlyBrace */
    'CurlyBrace';

/**
 * Defines the mode of line in crosshair. They are
 * * none - Hides both vertical and horizontal crosshair line.
 * * both - Shows both vertical and horizontal crosshair line.
 * * vertical - Shows the vertical line.
 * * horizontal - Shows the horizontal line.
 */
export type PivotChartLineType =
    /** Hides both vertical and horizontal crosshair line. */
    'None' |
    /** Shows both vertical and horizontal crosshair line. */
    'Both' |
    /** Shows the vertical line. */
    'Vertical' |
    /** Shows the horizontal line. */
    'Horizontal';

/**
 * Defines the position of the legend. They are
 * * auto - Places the legend based on area type.
 * * top - Displays the legend on the top of chart.
 * * left - Displays the legend on the left of chart.
 * * bottom - Displays the legend on the bottom of chart.
 * * right - Displays the legend on the right of chart.
 * * custom - Displays the legend  based on given x and y value.
 */
export type PivotChartLegendPosition =
    /** Places the legend based on area type. */
    'Auto' |
    /** Places the legend on the top of chart. */
    'Top' |
    /** Places the legend on the left of chart. */
    'Left' |
    /** Places the legend on the bottom of chart. */
    'Bottom' |
    /** Places the legend on the right of chart. */
    'Right' |
    /** Places the legend based on given x and y. */
    'Custom';

/**
 * * Type of series to be drawn in radar or polar series. They are
 * * line - Renders the line series.
 * * column - Renders the column series.
 * * area - Renders the area series.
 * * scatter - Renders the scatter series.
 * * spline - Renders the spline series.
 * * stackingColumn - Renders the stacking column series.
 * * stackingArea - Renders the stacking area series.
 * * rangeColumn - Renders the range column series.
 * * splineArea - Renders the spline area series.
 */
export type PivotChartDrawType =
    /**  Define the line series. */
    'Line' |
    /**  Define the Column series. */
    'Column' |
    /**  Define the stacking Column series. */
    'StackingColumn' |
    /**  Define the Area series. */
    'Area' |
    /**  Define the Scatter series. */
    'Scatter' |
    /** Define the Range column series */
    'RangeColumn' |
    /** Define the Spline series */
    'Spline' |
    /** Define the Spline Area series */
    'SplineArea' |
    /** Define the spline series */
    'StackingArea' |
    /** Define the Stacking line series */
    'StackingLine';

/**
 * It defines type of spline.
 * Natural - Used to render Natural spline.
 * Cardinal - Used to render cardinal spline.
 * Clamped - Used to render Clamped spline
 * Monotonic - Used to render monotonic spline
 */
export type PivotChartSplineType =
    /** Used to render natural spline type */
    'Natural' |
    /** Used to render Monotonicspline  */
    'Monotonic' |
    /** Used to render Cardinal */
    'Cardinal' |
    /** Used to render Clamped */
    'Clamped';

/**
 * Defines the Alignment. They are
 * * none - Shows all the labels.
 * * hide - Hide the label when it intersect.
 * * rotate45 - Rotate the label to 45 degree when it intersect.
 * * rotate90 - Rotate the label to 90 degree when it intersect.
 */
export type PivotChartLabelIntersectAction =
    /** Shows all the labels. */
    'None' |
    /** Hide the label when it intersect. */
    'Hide' |
    /** Trim the label when it intersect. */
    'Trim' |
    /** Wrap the label when it intersect. */
    'Wrap' |
    /** Arrange the label in multiple row when it intersect. */
    'MultipleRows' |
    /** Rotate the label to 45 degree when it intersect. */
    'Rotate45' |
    /** Rotate the label to 90 degree when it intersect. */
    'Rotate90';

/**
 * Defines the Edge Label Placement for an axis. They are
 * * none - No action will be perform.
 * * hide - Edge label will be hidden.
 * * shift - Shift the edge labels.
 */
export type PivotChartEdgeLabelPlacement =
    /**  Render the edge label in axis. */
    'None' |
    /**  Hides the edge label in axis. */
    'Hide' |
    /**  Shift the edge series in axis. */
    'Shift';

/**
 * Defines the Label Placement for category axis. They are
 * * betweenTicks - Render the label between the ticks.
 * * onTicks - Render the label on the ticks.
 */
export type PivotChartLabelPlacement =
    /**  Render the label between the ticks. */
    'BetweenTicks' |
    /**  Render the label on the ticks. */
    'OnTicks';

/**
 * Defines the Position. They are
 * * inside - Place the ticks or labels inside to the axis line.
 * * outside - Place the ticks or labels outside to the axis line.
 */
export type PivotChartAxisPosition =
    /** Place the ticks or labels inside to the axis line. */
    'Inside' |
    /** Place the ticks or labels outside to the axis line. */
    'Outside';

/**
 * Defines the zooming mode, They are.
 * * x,y - Chart will be zoomed with respect to both vertical and horizontal axis.
 * * x - Chart will be zoomed with respect to horizontal axis.
 * * y - Chart will be zoomed with respect to vertical axis.
 */
export type PivotChartZoomMode =
    /** Chart will be zoomed with respect to both vertical and horizontal axis. */
    'XY' |
    /** Chart will be zoomed with respect to horizontal axis. */
    'X' |
    /** Chart will be zoomed with respect to vertical axis. */
    'Y';

/**
 * Defines the ZoomingToolkit, They are.
 * * zoom - Renders the zoom button.
 * * zoomIn - Renders the zoomIn button.
 * * zoomOut - Renders the zoomOut button.
 * * pan - Renders the pan button.
 * * reset - Renders the reset button.
 */
export type PivotChartToolbarItems =
    /** Renders the zoom button. */
    'Zoom' |
    /** Renders the zoomIn button. */
    'ZoomIn' |
    /** Renders the zoomOut button. */
    'ZoomOut' |
    /** Renders the pan button. */
    'Pan' |
    /** Renders the reset button. */
    'Reset';

/**
 * Defines Theme of the chart. They are
 * * Material - Render a chart with Material theme.
 * * Fabric - Render a chart with Fabric theme
 */
export type PivotChartTheme =
    /**  Render a chart with Material theme. */
    'Material' |
    /**  Render a chart with Fabric theme. */
    'Fabric' |
    /**  Render a chart with Bootstrap theme. */
    'Bootstrap' |
    /**  Render a chart with HighcontrastLight theme. */
    'HighContrastLight' |
    /**  Render a chart with MaterialDark theme. */
    'MaterialDark' |
    /**  Render a chart with FabricDark theme. */
    'FabricDark' |
    /**  Render a chart with HighContrast theme. */
    'HighContrast' |
    /**  Render a chart with BootstrapDark theme. */
    'BootstrapDark' |
    /**  Render a chart with Bootstrap4 theme. */
    'Bootstrap4';