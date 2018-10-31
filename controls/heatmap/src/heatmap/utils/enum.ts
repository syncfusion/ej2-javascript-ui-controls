/** 
 * Defines the Alignment. They are
 * * near - Align the element to the left.
 * * center - Align the element to the center.
 * * far - Align the element to the right.
 * * 
 */

export type Alignment =
    /** Define the left alignment. */
    'Near' |
    /** Define the center alignment. */
    'Center' |
    /** Define the right alignment. */
    'Far';

/** 
 * Defines Theme of the heatmap.
 */
export type HeatMapTheme =
    /**  Render a HeatMap with Material theme. */
    'Material' |
    /**  Render a HeatMap with Fabric theme. */
    'Fabric' |
    /**  Render a HeatMap with Bootstrap theme. */
    'Bootstrap' |
    /**  Render a HeatMap with Highcontrast theme. */
    'Highcontrast';

export type Orientation =
    /**  Horizontal Axis. */
    'Horizontal' |
    /**  Vertical Axis. */
    'Vertical';

/** 
 * Defines the type of axis. They are
 * * double -  Renders a numeric axis.
 * * dateTime - Renders a dateTime axis.
 * * category - Renders a category axis.
 */
export type ValueType =
    /** Define the numeric axis. */
    'Numeric' |
    /** Define the DateTime axis. */
    'DateTime' |
    /** Define the Category axis . */
    'Category';

/** 
 * Defines Color type for heat map cell.
 * * Gradient - Render a HeatMap cells with linear gradient color.
 * * Fixed - Render a HeatMap cells with fixed color.
 */
export type PaletteType =
    /** Define the graident type color. */
    'Gradient' |
    /** Define the Fixed type color */
    'Fixed';

/** 
 * Defines cell Type. They are
 * * Rect - Render a HeatMap cells in rectangle shape.
 * * Bubble - Render a HeatMap cells in bubble shape.
 */
export type CellType =
    /**  Render a HeatMap cells in rectangle shape. */
    'Rect' |
    /**  Render a HeatMap cells in bubble shape. */
    'Bubble';

/**
 * Defines Bubble Type. They are
 * * Size - Define the bubble type is size.
 * * Color - Define the bubble type is color.
 * * Sector - Define the bubble type is sector.
 * * SizeAndColor - Define the bubble type is sizeandcolor.
 */
export type BubbleType =
    /**  Define the bubble type is size. */
    'Size' |
    /**  Define the bubble type is color. */
    'Color' |
    /**  Define the bubble type is sector. */
    'Sector' |
    /**  SizeAndColor - Define the bubble type is sizeandcolor. */
    'SizeAndColor';
/**
 * Defines the interval type of datetime axis. They are
 * * years - Define the interval of the axis in years.
 * * months - Define the interval of the axis in months.
 * * days - Define the interval of the axis in days.
 * * hours - Define the interval of the axis in hours.
 * * minutes - Define the interval of the axis in minutes.
 */
export type IntervalType =
    /** Define the interval of the axis in years. */
    'Years' |
    /** Define the interval of the axis in months. */
    'Months' |
    /** Define the interval of the axis in days. */
    'Days' |
    /** Define the interval of the axis in hours. */
    'Hours' |
    /** Define the interval of the axis in minutes. */
    'Minutes';

/**
 * Defines the Legend position 
 * Left - Legend in the left position 
 * Right - Legend in the left right  position 
 * Up - Legend in the left up  position
 * Down -Legend in the left down position
 */
export type LegendPosition = 'Left' | 'Right' | 'Top' | 'Bottom';

/**
 * Defines the text over flow 
 * None - Used to show the heat map text with overlap to other element
 * Wrap - Used to show the heat map text with Wrap support
 * Trim - Used to show the heat map text with Trim
 */
export type TextOverflow =
    /** Used to show the heat map text with overlap to other element */
    'None' |
    /** Used to show the heat map text with Wrap support */
    'Wrap' |
    /** Used to show the heat map text with Wrap support */
    'Trim';

/**
 * specify the adapter type in heat map
 * Cell - Heat map is rendering using cell type data source
 * Table - Heat map is rendering using table type data source
 */
export type AdaptorType =
    /** Define the data soruce type is cell */
    'Cell' |
    /** Define the data soruce type is table */
    'Table';

/**
 * specify the rendering mode
 * SVG - Heat map is render using SVG draw mode.
 * Canvas - Heat map is render using Canvas draw mode.
 * Auto - Automatically switch the draw mode based on number of records in data source.
 */
export type DrawType =
    /** Heat map is render using SVG draw mode. */
    'SVG' |
    /** Heat map is render using Canvas draw mode */
    'Canvas' |
    /** Automatically switch the draw mode based on number of records in data source. */
    'Auto';

/**
 * specify the label intersect action for axis
 * None - Shows all the labels with overlap.
 * Trim - Trim the label when it intersect.
 * Rotate45 - Rotate the label to 45 degree when it intersect.
 */
export type LabelIntersectAction =
    /** Shows all the labels. */
    'None' |
    /** Trim the label when it intersect. */
    'Trim' |
    /** Rotate the label to 45 degree when it intersect. */
    'Rotate45';

/**
 * Specifies the type of label display for smart legend.
 * * All:  All labels are displayed.
 * * Edge: Labels will be displayed only at the edges of the legend.
 * * None: No labels are displayed. 
 */
export type LabelDisplayType =
/**  All labels are displayed */
'All' |
/** Labels will be displayed only at the edges of the legend */
'Edge' |
/** No labels are displayed */
'None';

/** 
 * Defines the axis label display type for date time axis.  They are
 * * None: Axis labels displayed based on the value type
 * * years - Define the axis labels display in every year.
 * * months - Define the axis labels display in every month.
 * * days - Define the axis labels display in every days.
 * * hours - Define the axis labels display in every hours.
 */

export type LabelType =
    /** Axis labels displayed based on the value type */
    'None' |
    /** Define the axis labels display in every year. */
    'Years' |
    /** Define the axis labels display in every month. */
    'Months' |
    /**  Define the axis labels display in every day. */
    'Days' |
    /** Define the axis labels display in every hour. */
    'Hours';