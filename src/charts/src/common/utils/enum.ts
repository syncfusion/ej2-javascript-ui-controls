/**
 * Defines coordinate units of an annotation. They are:
 * * Pixel - Specifies the pixel value.
 * * Point - Specifies the axis value.
 */
export type Units =
    /**  Specifies the pixel value. */
    'Pixel' |
    /**  Specifies the axis value. */
    'Point';

/**
 * Defines the alignment. They are:
 * * Near - Align the element to the left.
 * * Center - Align the element to the center.
 * * Far - Align the element to the right.
 */

export type Alignment =
    /** Define the left alignment. */
    'Near' |
    /** Define the center alignment. */
    'Center' |
    /** Define the right alignment. */
    'Far';

/** @private */
export type SeriesCategories =
    /** Defines the trenline */
    'TrendLine' |
    /** Defines the indicator */
    'Indicator' |
    /** Defines the normal series */
    'Series' |
    /** Defines the Pareto series */
    'Pareto';

/**
 * Defines regions of an annotation. They are:
 * * Chart - Specifies the chart coordinates.
 * * Series - Specifies the series coordinates.
 */
export type Regions =
    /**  Specifies the chart coordinates */
    'Chart' |
    /**  Specifies the series coordinates */
    'Series';

/**
 * Defines the Position. They are:
 * * Top - Align the element to the top.
 * * Middle - Align the element to the center.
 * * Bottom - Align the element to the bottom.
 */

export type Position =
    /** Define the top position. */
    'Top' |
    /** Define the middle position. */
    'Middle' |
    /** Define the bottom position. */
    'Bottom';

/**
 * Defines the export file format. They are:
 * * PNG - Export the chart in PNG format.
 * * JPEG - Export the chart in JPEG format.
 * * SVG - Export the chart in SVG format.
 * * PDF - Export the chart in PDF format.
 * * XLSX - Export the chart data to XLSX.
 * * CSV - Export the chart to CSV.
 * * Print – Prints the chart.
 */
export type ExportType =
    /** Used to export the chart in PNG format */
    'PNG' |
    /** Used to export the chart in JPEG format */
    'JPEG' |
    /** Used to export the chart in SVG format */
    'SVG' |
    /** Used to export the chart in PDF format */
    'PDF' |
    /** Used to export the chart data to XLSX */
    'XLSX' |
    /** Used to export the chart data to CSV */
    'CSV' |
    /** Used to print the chart */
    'Print';

/**
 * Defines the Text overflow. They are:
 * * None - Shown the chart title with overlap if exceed.
 * * Wrap - Shown the chart title with wrap if exceed.
 * * Trim - Shown the chart title with trim if exceed.
 */
export type TextOverflow =
    /** Used to show the chart title with overlap to other element */
    'None' |
    /** Used to show the chart title with Wrap support */
    'Wrap' |
    /** Used to show the chart title with Trim */
    'Trim';

/**
 * Defines the interval type of datetime axis. They are:
 * * Auto - Define the interval of the axis based on data.
 * * Quarter - Define the interval of the axis based on data.
 * * Years - Define the interval of the axis in years.
 * * Months - Define the interval of the axis in months.
 * * Weeks - Define the interval of the axis in weeks
 * * Days - Define the interval of the axis in days.
 * * Hours - Define the interval of the axis in hours.
 * * Minutes - Define the interval of the axis in minutes.
 */
export type RangeIntervalType =
    /** Define the interval of the axis based on data. */
    'Auto' |
    /** Define the interval of the axis in years. */
    'Years' |
    /** Define the interval of the axis based on quarter */
    'Quarter' |
    /** Define the interval of the axis in months. */
    'Months' |
    /** Define the intervl of the axis in weeks */
    'Weeks' |
    /** Define the interval of the axis in days. */
    'Days' |
    /** Define the interval of the axis in hours. */
    'Hours' |
    /** Define the interval of the axis in minutes. */
    'Minutes' |
    /** Define the interval of the axis in seconds. */
    'Seconds';

/**
 * Defines the position of the period selector. They are:
 * * Top: Places the period selector at the top.
 * * Bottom: Places the period selector at the bottom.
 */
export type PeriodSelectorPosition =
    /** Top position */
    'Top' |
    /** Bottom position */
    'Bottom';

/**
 * Flag type for stock events.
 */
export type FlagType =
    /** Circle  */
    'Circle' |
    /** Square */
    'Square' |
    /** Flag */
    'Flag' |
    /** Pin type flags */
    'Pin' |
    /** Triangle Up */
    'Triangle' |
    /** Triangle Down */
    'InvertedTriangle' |
    /** Triangle Right */
    'TriangleRight' |
    /** Triangle Left */
    'TriangleLeft' |
    /** Arrow Up */
    'ArrowUp' |
    /** Arrow down */
    'ArrowDown' |
    /** Arrow Left */
    'ArrowLeft' |
    /** Arrow right */
    'ArrowRight' |
    /** Text type */
    'Text';

/**
 * Highlighting or selecting patterns in chart. They are:
 * * None - Sets none as highlighting or selecting pattern.
 * * Chessboard - Sets chess board as highlighting or selecting pattern.
 * * Dots - Set dots as highlighting or selecting pattern.
 * * DiagonalForward - Sets diagonal forward as highlighting or selecting pattern.
 * * Crosshatch -Sets crosshatch as highlighting or selecting pattern.
 * * Pacman - Sets pacman highlighting or selecting pattern.
 * * Diagonalbackward - Set diagonal backward as highlighting or selecting pattern.
 * * Grid - Set grid as highlighting or selecting pattern.
 * * Turquoise - Sets turquoise as highlighting or selecting pattern.
 * * Star - Sets star as highlighting or selecting pattern.
 * * Triangle - Sets triangle as highlighting or selecting pattern.
 * * Circle - Sets circle as highlighting or selecting pattern.
 * * Tile - Sets tile as highlighting or selecting pattern.
 * * Horizontaldash - Sets horizontal dash as highlighting or selecting pattern.
 * * Verticaldash - Sets vertical dash as highlighting or selecting pattern.
 * * Rectangle - Sets rectangle as highlighting or selecting pattern.
 * * Box - Sets box as highlighting or selecting pattern.
 * * Verticalstripe - Sets vertical stripe as highlighting or selecting pattern.
 * * Horizontalstripe - Sets horizontal stripe as highlighting or selecting pattern.
 * * Bubble - Sets bubble as highlighting or selecting pattern.
 */
export type SelectionPattern =
    /** Sets none as highlighting or selecting pattern. */
    'None' |
    /** Sets chess board as highlighting or selecting pattern. */
    'Chessboard' |
    /** Set dots as highlighting or selecting pattern. */
    'Dots' |
    /** Sets diagonal forward as highlighting or selecting pattern. */
    'DiagonalForward' |
    /** Sets cross hatch as highlighting or selecting pattern. */
    'Crosshatch' |
    /** Sets pacman as highlighting or selecting pattern. */
    'Pacman' |
    /** Set diagonal backward as highlighting or selecting pattern. */
    'DiagonalBackward' |
    /** Set grid as highlighting or selecting pattern. */
    'Grid' |
    /** Set turquoise as highlighting or selecting pattern. */
    'Turquoise' |
    /** Set star as highlighting or selecting pattern. */
    'Star' |
    /** Set triangle as highlighting or selecting pattern. */
    'Triangle' |
    /** Set circle as highlighting or selecting pattern. */
    'Circle' |
    /** Set tile as highlighting or selecting pattern. */
    'Tile' |
    /** Set horizontal dash as highlighting or selecting pattern. */
    'HorizontalDash' |
    /** Set vertical dash as highlighting or selecting pattern. */
    'VerticalDash' |
    /** Set rectangle as highlighting or selecting pattern. */
    'Rectangle' |
    /** Set box as highlighting or selecting pattern. */
    'Box' |
    /** Set vertical stripe as highlighting or selecting pattern. */
    'VerticalStripe' |
    /** Set horizontal stripe as highlighting or selecting pattern. */
    'HorizontalStripe' |
    /** Set dots as bubble or selecting pattern. */
    'Bubble';

/**
 * Defines the position of the legend title. They are:
 * * Top - Align the title to the top.
 * * Left - Align the title to the left.
 * * Right - Align the title to the right.
 */
export type LegendTitlePosition =
    /** Define the top position. */
    'Top' |
    /** Define the left position. */
    'Left' |
    /** Define the right position. */
    'Right';

/**
 * Specifies text wrap options when the text overflowing the container. They are:
 * * Normal - Specifies to break words only at allowed break points.
 * * Wrap - Specifies to break a word once it is too long to fit on a line by itself.
 * * AnyWhere - Specifies to break a word at any point if there are no otherwise-acceptable break points in the line.
 */
export type TextWrap =
/** Specifies to break words only at allowed break points. */
'Normal' |
/** Specifies to break a word once it is too long to fit on a line by itself. */
'Wrap' |
/** Specifies to break a word at any point if there are no otherwise-acceptable break points in the line. */
'AnyWhere';

/**
 * Specifies text overflow options when the text overflowing the container. They are:
 * * Ellipsis - Specifies an ellipsis (“...”) to the clipped text.
 * * clip - Specifies to break a word once it is too long to fit on a line by itself.
 */
export type LabelOverflow =
 /** Specifies an ellipsis (“...”) to the clipped text. */
 'Ellipsis' |
 /** Specifies the text is clipped and not accessible. */
 'Clip';

/**
 * Defines the alignment of the line break axis labels. They are:
 * * Center - Align the label with center.
 * * Left - Align the label with left.
 * * Right - Align the label with right.
 */
export type TextAlignment =
    /** align the label with left. */
    'Left' |
    /** align the label with center. */
    'Center' |
    /** align the label with right. */
    'Right';

/**
 * Defines the position of the title. They are:
 * * Top - Displays the title on the top of chart.
 * * Left - Displays the title on the left of chart.
 * * Bottom - Displays the title on the bottom of chart.
 * * Right - Displays the title on the right of chart.
 * * Custom - Displays the title based on given x and y value.
 */

export type TitlePosition =
    /** Places the title on the top of chart. */
    'Top' |
    /** Places the title on the left of chart. */
    'Right' |
    /** Places the title on the bottom of chart. */
    'Bottom' |
    /** Places the title on the right of chart. */
    'Left' |
    /** Places the title based on given x and y. */
    'Custom';

/**
 * Defines the selection mode. They are:
 * * None - Disable the selection.
 * * Series - To select a series.
 * * Point - To select a point.
 * * Cluster - To select a cluster of point.
 */
export type HighlightMode =
    /** Disable the selection. */
    'None' |
    /** To select a series. */
    'Series' |
    /** To select a point. */
    'Point' |
    /** To select a cluster of point. */
    'Cluster';

/**
 * Defines the selection mode. They are:
 * * None - Disable the selection.
 * * Series - To select a series.
 * * Point - To select a point.
 * * Cluster - To select a cluster of point
 * * DragXY - To select points, by dragging with respect to both horizontal and vertical axis
 * * DragX - To select points, by dragging with respect to horizontal axis.
 * * DragY - To select points, by dragging with respect to vertical axis.
 * * Lasso - To select points, by dragging with respect to free form.
 */
export type SelectionMode =
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
    'DragX' |
    /** To select points, by dragging with respect to free form. */
    'Lasso';

/**
 * Defines the label placement for category axis. They are:
 * * BetweenTicks - Render the label between the ticks.
 * * OnTicks - Render the label on the ticks.
 */
export type LabelPlacement =
    /**  Render the label between the ticks. */
    'BetweenTicks' |
    /**  Render the label on the ticks. */
    'OnTicks';

/**
 * Defines theme of the chart. They are:
 * * Material - Render a chart with Material theme.
 * * Fabric - Render a chart with Fabric theme.
 * * Bootstrap - Render a chart with Bootstrap theme.
 * * HighContrastLight - Render a chart with HighcontrastLight theme.
 * * MaterialDark - Render a chart with MaterialDark theme.
 * * FabricDark - Render a chart with FabricDark theme.
 * * HighContrast - Render a chart with HighContrast theme.
 * * BootstrapDark - Render a chart with BootstrapDark theme.
 * * Bootstrap4 - Render a chart with Bootstrap4 theme.
 * * Tailwind - Render a chart with Tailwind theme.
 * * TailwindDark - Render a chart with TailwindDark theme.
 * * Bootstrap5 - Render a chart with Bootstrap5 theme.
 * * Bootstrap5Dark - Render a chart with Bootstrap5Dark theme.
 * * Fluent - Render a chart with Fluent theme.
 * * FluentDark - Render a chart with FluentDark theme.
 * * Fluent2 - Render a chart with Fluent2 theme.
 * * Fluent2Dark - Render a chart with Fluent2Dark theme.
 * * Material3 - Render a chart with Material3 theme.
 * * Material3Dark - Render a chart with Material3Dark theme.
 */
export type ChartTheme =
    /**  Render a chart with Material theme. */
    'Material' |
    /**  Render a chart with Fabric theme. */
    'Fabric' |
    /**  Render a chart with Bootstrap theme. */
    'Bootstrap' |
    /**  Render a chart with HighcontrastLight theme. */
    'HighContrastLight'|
    /**  Render a chart with MaterialDark theme. */
    'MaterialDark' |
    /**  Render a chart with FabricDark theme. */
    'FabricDark' |
    /**  Render a chart with HighContrast theme. */
    'HighContrast'|
    /**  Render a chart with BootstrapDark theme. */
    'BootstrapDark' |
    /**  Render a chart with Bootstrap4 theme. */
    'Bootstrap4' |
    /**  Render a chart with Tailwind theme. */
    'Tailwind' |
    /**  Render a chart with TailwindDark theme. */
    'TailwindDark' |
    /**  Render a chart with Bootstrap5 theme. */
    'Bootstrap5' |
    /**  Render a chart with Bootstrap5Dark theme. */
    'Bootstrap5Dark' |
    /**  Render a chart with Fluent theme. */
    'Fluent' |
    /**  Render a chart with FluentDark theme. */
    'FluentDark' |
    /**  Render a chart with Fluent 2 theme. */
    'Fluent2' |
    /**  Render a chart with Fluent 2 dark theme. */
    'Fluent2Dark' |
    /**  Render a chart with Fluent 2 highcontrast dark theme. */
    'Fluent2HighContrast' |
    /**  Render a accumulation chart with Material 3 theme. */
    'Material3' |
    /**  Render a accumulation chart with Material 3 dark theme. */
    'Material3Dark';

/**
 * Defines the interval type of datetime axis. They are:
 * * Auto - Define the interval of the axis based on data.
 * * Years - Define the interval of the axis in years.
 * * Months - Define the interval of the axis in months.
 * * Days - Define the interval of the axis in days.
 * * Hours - Define the interval of the axis in hours.
 * * Minutes - Define the interval of the axis in minutes.
 * * Seconds - Define the interval of the axis in seconds.
 */
export type IntervalType =
    /** Define the interval of the axis based on data. */
    'Auto' |
    /** Define the interval of the axis in years. */
    'Years' |
    /** Define the interval of the axis in months. */
    'Months' |
    /** Define the interval of the axis in days. */
    'Days' |
    /** Define the interval of the axis in hours. */
    'Hours' |
    /** Define the interval of the axis in minutes. */
    'Minutes' |
    /** Define the interval of the axis in seconds. */
    'Seconds';

/**
 * Defines Orientation of axis. They are
 * * horizontal
 * * vertical
 *
 * @private
 */
export type Orientation =
    /**  Horizontal Axis. */
    'Horizontal' |
    /**  Vertical Axis. */
    'Vertical';

/**
 * Defines the range padding of axis. They are:
 * * Auto - Padding Normal is applied for orientation vertical axis and None is applied for orientation horizontal axis.
 * * None - Padding cannot be applied to the axis.
 * * Normal - Padding is applied to the axis based on the range calculation.
 * * Additional - Interval of the axis is added as padding to the minimum and maximum values of the range.
 * * Round - Axis range is rounded to the nearest possible value divided by the interval.
 */
export type ChartRangePadding =
    /**  Padding Normal is applied for orientation vertical axis and None is applied for orientation horizontal axis */
    'Auto' |
    /**  Padding wiil not be applied to the axis. */
    'None' |
    /**  Padding is applied to the axis based on the range calculation. */
    'Normal' |
    /**  Interval of the axis is added as padding to the minimum and maximum values of the range. */
    'Additional' |
    /**  Axis range is rounded to the nearest possible value divided by the interval. */
    'Round';

/**
 * Defines the skeleton type for the axis. They are:
 * * Date - It formats date only.
 * * DateTime - It formats date and time.
 * * Time - It formats time only.
 */
export type SkeletonType =
    /** Used to format date */
    'Date' |
    /** Used to format date and time */
    'DateTime' |
    /** Used to format time */
    'Time';

/**
 * Defines the edge label placement for an axis. They are:
 * * None - No action will be perform.
 * * Hide - Edge label will be hidden.
 * * Shift - Shift the edge labels.
 */

export type EdgeLabelPlacement =
    /**  Render the edge label in axis. */
    'None' |
    /**  Hides the edge label in axis. */
    'Hide' |
    /**  Shift the edge series in axis. */
    'Shift';

/**
 * Specifies the data types that the axis can handle. They are:
 * * Double: This type is used for rendering a numeric axis to accommodate numeric data.
 * * DateTime: This type is utilized for rendering a date-time axis to manage date-time data.
 * * Category: This type is employed for rendering a category axis to manage categorical data.
 * * Logarithmic: This type is applied for rendering a logarithmic axis to handle a wide range of values.
 * * DateTimeCategory: This type is used to render a date time category axis for managing business days.
 */
export type ValueType =
    /** Define the numeric axis. */
    'Double' |
    /** Define the DateTime axis. */
    'DateTime' |
    /** Define the Category axis . */
    'Category' |
    /** Define the Logarithmic axis . */
    'Logarithmic' |
    /** Define the datetime category axis */
    'DateTimeCategory';

/**
 * Defines the alignment. They are:
 * * None - Shows all the labels.
 * * Hide - Hide the label when it intersect.
 * * Trim - Trim the label when it intersect.
 * * Wrap - Wrap the label when it intersect.
 * * MultipleRows - Arrange the label in multiple row when it intersect.
 * * Rotate45 - Rotate the label to 45 degree when it intersect.
 * * Rotate90 - Rotate the label to 90 degree when it intersect.
 */
export type LabelIntersectAction =
    /** Shows all the labels. */
    'None' |
    /** Hide the label when it intersect. It is also applicable for polar radar chart */
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
 * Defines the shape of legend. They are:
 * * Circle - Renders a circle.
 * * Rectangle - Renders a rectangle.
 * * Triangle - Renders a triangle.
 * * Diamond - Renders a diamond.
 * * Cross - Renders a cross.
 * * HorizontalLine - Renders a horizontalLine.
 * * VerticalLine - Renders a verticalLine.
 * * Pentagon - Renders a pentagon.
 * * InvertedTriangle - Renders a invertedTriangle.
 * * SeriesType -Render a legend shape based on series type.
 * * Image - Renders a image.
 */
export type LegendShape =
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
    /** Render a Cross. */
    'Multiply' |
    /** Render a actual bar. */
    'ActualRect' |
    /** Render a target bar. */
    'TargetRect' |
    /** Render a HorizontalLine. */
    'HorizontalLine' |
    /** Render a VerticalLine. */
    'VerticalLine' |
    /** Render a Pentagon. */
    'Pentagon' |
    /** Render a InvertedTriangle. */
    'InvertedTriangle' |
    /** Render a legend shape based on series type. */
    'SeriesType' |
    /** Render a Image. */
    'Image';

/**
 * Defines the label position. They are:
 * * Outer - Position the label outside the point.
 * * Top - Position the label on top of the point.
 * * Bottom - Position the label on bottom of the point.
 * * Middle - Position the label to middle of the point.
 * * Auto - Position the label based on series.
 */
export type LabelPosition =
    /** Position the label outside the point. */
    'Outer' |
    /** Position the label on top of the point. */
    'Top' |
    /** Position the label on bottom of the point. */
    'Bottom' |
    /** Position the label to middle of the point. */
    'Middle' |
    /** Position the label based on series. */
    'Auto';

/**
 * Defines the empty point mode of the chart. They are:
 * * Gap - Used to display empty points as space.
 * * Zero - Used to display empty points as zero.
 * * Drop - Used to ignore the empty point while rendering.
 * * Average - Used to display empty points as previous and next point average.
 */
export type EmptyPointMode =
    /** Used to display empty points as space  */
    'Gap' |
    /** Used to display empty points as zero  */
    'Zero' |
    /** Used to ignore the empty point while rendering  */
    'Drop' |
    /** Used to display empty points as previous and next point average  */
    'Average';

/**
 * Defines the shape of the data in columns and bars. They are:
 * * Rectangle - Displays the data in a column and bar chart in a rectangle shape.
 * * Cylinder - Displays the data in a column and bar chart in a cylinder shape.
 */
export type ShapeType =
    /** Uses a rectangle shape to show data. */
    'Rectangle' |
    /** Uses a cylinder shape to show data. */
    'Cylinder';

/**
 * Defines the position of the legend. They are:
 * * Auto - Places the legend based on the area type.
 * * Top - Displays the legend on the top of the chart.
 * * Left - Displays the legend on the left of the chart.
 * * Bottom - Displays the legend on the bottom of the chart.
 * * Right - Displays the legend on the right of the chart.
 * * Custom - Displays the legend  based on the given x and y value.
 */
export type LegendPosition =
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
