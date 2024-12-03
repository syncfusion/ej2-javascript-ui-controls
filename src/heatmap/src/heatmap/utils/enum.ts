/**
 * Defines the alignment in the heatmap. They are,
 * * Near - Aligns the element to the left.
 * * Center - Aligns the element to the center.
 * * Far - Aligns the element to the right.
 * *
 */

export type Alignment =
    /** Aligns the element to the left. */
    'Near' |
    /** Aligns the element to the center. */
    'Center' |
    /** Aligns the element to the right. */
    'Far';

/**
 * Defines the type of exporting the rendered heatmap.
 */
export type ExportType =
    /** Used to export the rendered heatmap as image with PNG format. */
    'PNG' |
    /** Used to export the rendered heatmap as image with JPEG format. */
    'JPEG' |
    /** Used to export the rendered heatmap as image with SVG format. */
    'SVG' |
    /** Used to export the rendered heatmap as image with PDF format. */
    'PDF';


/**
 * Defines the theme of the heatmap.
 */
export type HeatMapTheme =
    /**  Render a heatmap with Material theme. */
    'Material' |
    /**  Render a heatmap with Fabric theme. */
    'Fabric' |
    /**  Render a heatmap with Bootstrap theme. */
    'Bootstrap' |
    /**  Render a heatmap with Bootstrap4 theme. */
    'Bootstrap4' |
    /**  Render a heatmap with Highcontrast Light theme. */
    'HighContrastLight'|
    /**  Render a heatmap with Material Dark theme. */
    'MaterialDark' |
    /**  Render a heatmap with Fabric Dark theme. */
    'FabricDark' |
    /**  Render a heatmap with HighContrast theme. */
    'HighContrast'|
    /**  Render a heatmap with Bootstrap Dark theme. */
    'BootstrapDark'|
    /**  Render a heatmap with TailwindDark theme. */
    'TailwindDark'|
    /**  Render a heatmap with Tailwind theme. */
    'Tailwind' |
    /**  Render a heatmap with Bootstrap5 theme. */
    'Bootstrap5' |
    /**  Render a heatmap with Bootstrap5Dark theme. */
    'Bootstrap5Dark' |
    /**  Render a heatmap with Fluent theme. */
    'Fluent' |
    /**  Render a heatmap with Fluent Dark theme. */
    'FluentDark' |
    /** Renders a map with Material3 theme. */
    'Material3' |
    /** Renders a map with Material3dark theme. */
    'Material3Dark' |
    /**  Render a heatmap with Fluent2 theme. */
    'Fluent2' |
    /**  Render a heatmap with Fluent2 Dark theme. */
    'Fluent2Dark' |
    /**  Render a heatmap with Fluent2 High Contrast theme. */
    'Fluent2HighContrast';

/**
 * @private
 */
export type Orientation =
    /**  Horizontal Axis. */
    'Horizontal' |
    /**  Vertical Axis. */
    'Vertical';

/**
 * Defines the type of the data to be handled in the axis. The available types are
 * * Numeric -  Renders a numeric axis.
 * * DateTime - Renders a axis that handles date and time.
 * * Category - Renders a axis that renders user provided labels.
 */
export type ValueType =
    /** Renders a numeric axis. */
    'Numeric' |
    /** Renders a axis that handles date and time. */
    'DateTime' |
    /** Renders a axis that renders user provided labels. */
    'Category';

/**
 * Defines the style in which the color is to be applied to the cells.
 * * Gradient - Renders the heatmap cells with linear gradient colors.
 * * Fixed - Renders the heatmap cells with fixed colors.
 */
export type PaletteType =
    /** Renders the heatmap cells with linear gradient colors. */
    'Gradient' |
    /** Renders the heatmap cells with fixed colors. */
    'Fixed';

/**
 * Defines the type of the cells in heatmap. The available types are,
 * * Rect - Renders the heatmap cells in rectangle shape.
 * * Bubble - Renders the heatmap cells in bubble shape.
 */
export type CellType =
    /** Renders the heatmap cells in rectangle shape. */
    'Rect' |
    /** Renders the heatmap cells in bubble shape. */
    'Bubble';

/**
 * Defines the type of the bubble heatmap. The available types are,
 * * Size - The bubble heatmap will be rendered in size variations based on the provided data.
 * * Color - The bubble heatmap will be rendered in color variations based on the provided data.
 * * Sector - Define the bubble type is sector.
 * * SizeAndColor - Define the bubble type is sizeandcolor.
 */
export type BubbleType =
    /**  The bubble heatmap will be rendered in size variations based on the provided data. */
    'Size' |
    /**  The bubble heatmap will be rendered in color variations based on the provided data. */
    'Color' |
    /**  The bubble heatmap will be rendered as sectors based on the provided data. */
    'Sector' |
    /**  The bubble heatmap will be rendered in size and color variations based on the provided data. */
    'SizeAndColor';
/**
 * Defines the type of the interval between the axis labels in date time axis.The available types are,
 * * years - Defines the interval of the axis labels in years.
 * * months - Defines the interval of the axis labels in months.
 * * days - Defines the interval of the axis labels in days.
 * * hours - Defines the interval of the axis labels in hours.
 * * minutes - Defines the interval of the axis labels in minutes.
 */
export type IntervalType =
    /** Defines the interval of the axis labels in years. */
    'Years' |
    /** Defines the interval of the axis labels in months. */
    'Months' |
    /** Defines the interval of the axis labels in days. */
    'Days' |
    /** Defines the interval of the axis labels in hours. */
    'Hours' |
    /** Defines the interval of the axis labels in minutes. */
    'Minutes';

/**
 * the position of the legend.
 * Left - Renders legend at the left of the heatmap.
 * Right - Renders legend at the right of the heatmap.
 * Top - Renders legend at the top of the heatmap.
 * Bottom -Renders legend at the bottom of the heatmap.
 */
export type LegendPosition =
    /**Renders legend at the left of the heatmap. */
    'Left' |
    /**Renders legend at the right of the heatmap. */
    'Right' |
    /**Renders legend at the top of the heatmap. */
    'Top' |
    /**Renders legend at the bottom of the heatmap. */
    'Bottom';

/**
 * Defines the overflow style of the text in heatmap.
 * None - No action is taken when the text overflows.
 * Wrap - Wraps the multi-level labels when the text overflows.
 * Trim - Trims the multi-level labels when the text overflows.
 */
export type TextOverflow =
    /** No action is taken when the text overflows. */
    'None' |
    /** Wraps the multi-level labels when the text overflows. */
    'Wrap' |
    /** Trims the multi-level labels when the text overflows. */
    'Trim';

/**
 * Specifies the type of the adaptor to process the data set in the heatmap.
 * Cell - This adaptor type processes the cell type data source.
 * Table - This adaptor type processes the table type data source.
 * None - No adaptor type will be used for the data source.
 */
export type AdaptorType =
    /** This adaptor type processes the cell type data source. */
    'Cell' |
    /** This adaptor type processes the table type data source. */
    'Table' |
    /** No adaptor type will be used for the data source. */
    'None';

/**
 * Defines the rendering mode of heatmap. The following are the available rendering modes.
 * SVG - Heatmap is rendered using SVG element.
 * Canvas - Heatmap is rendered using Canvas element.
 * Auto - Automatically switches the rendering mode based on number of records in the data source.
 */
export type DrawType =
    /** Heatmap is rendered using SVG element. */
    'SVG' |
    /** Heatmap is rendered using Canvas element. */
    'Canvas' |
    /** Automatically switches the rendering mode based on number of records in the data source. */
    'Auto';

/**
 * Defines the actions when the axis labels intersect with each other.The actions available are,
 * None - Shows all the labels.
 * Trim - Trims the label when label text intersects with other labels.
 * Rotate45 - Rotates the label to 45 degree when it intersects other labels.
 * MultipleRows - Shows all the labels as multiple rows when it intersects other labels.
 */
export type LabelIntersectAction =
    /** Shows all the labels. */
    'None' |
    /** Trims the label when label text intersects with other labels. */
    'Trim' |
    /** Rotates the label to 45 degree when it intersects other labels. */
    'Rotate45' |
    /** Shows all the labels as multiple rows when it intersects other labels. */
    'MultipleRows';

/**
 * Specifies the display mode for label for smart legend. The available display types are,
 * * All:  All the labels in the legend are displayed.
 * * Edge: Labels will be displayed only at the edges of the legend.
 * * None: No labels are displayed.
 */
export type LabelDisplayType =
/** All the labels in the legend are displayed. */
'All' |
/** Labels will be displayed only at the edges of the legend. */
'Edge' |
/** No labels are displayed. */
'None';

/**
 * Specifies the axis label display type for the date time axis. The following are available types,
 * * None - Axis labels displayed based on the value type.
 * * years - Displays the axis labels for every year.
 * * months - Displays the axis labels for every month.
 * * days - Displays the axis labels for every day.
 * * hours - Displays the axis labels for every hour.
 */

export type LabelType =
    /** Axis labels displayed based on the value type. */
    'None' |
    /** Displays the axis labels for every year. */
    'Years' |
    /** Displays the axis labels for every month. */
    'Months' |
    /** Displays the axis labels for every day. */
    'Days' |
    /** Displays the axis labels for every hour. */
    'Hours';


/**
 * Defines the type of the border for the axis labels. The following are the available types.
 */
export type BorderType =
    /** Renders all the borders around the rectangle. */
    'Rectangle' |
    /** Renders all the borders except the top border. */
    'WithoutTopBorder' |
    /** Renders all the borders except the bottom border. */
    'WithoutBottomBorder' |
    /** Renders without borders. */
    'WithoutBorder' |
    /** Renders all the borders except the top and bottom borders. */
    'WithoutTopandBottomBorder' |
    /** Renders the borders as brace shape. */
    'Brace';
/**
 * Specifies the color gradient mode in heatmap.
 * * Table: The minimum and maximum value colors calculated for overall data.
 * * Row: The minimum and maximum value colors calculated for each row of data.
 * * Column : The minimum and maximum value colors calculated for each column of data.
 */
export type ColorGradientMode =
    /** The minimum and maximum value colors calculated for overall data. */
    'Table' |
    /** The minimum and maximum value colors calculated for each row of data. */
    'Row' |
    /** The minimum and maximum value colors calculated for each column of data. */
    'Column';
