/**
 * It defines type of series in the range navigator.
 * * line
 * * column
 * * area
 * @private
 */
export type RangeNavigatorType =
    /** Line type */
    'Line' |
    /** Area type */
    'Area' |
    /** StepLine type */
    'StepLine';
/** 
 * Defines the interval type of datetime axis. They are
 * * auto - Define the interval of the axis based on data.
 * * quarter - Define the interval of the axis based on data.
 * * years - Define the interval of the axis in years.
 * * months - Define the interval of the axis in months.
 * * weeks - Define the interval of the axis in weeks
 * * days - Define the interval of the axis in days.
 * * hours - Define the interval of the axis in hours.
 * * minutes - Define the interval of the axis in minutes.
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
 * It defines type of thump in the range navigator.
 * * circle
 * * rectangle
 * @private
 */
export type ThumbType =
    /** Circle type */
    'Circle' |
    /** Rectangle type */
    'Rectangle';
/**
 * It defines display mode for the range navigator tooltip.
 * * always
 * * OnDemand
 * @private
 */
export type TooltipDisplayMode =
    /** Tooltip will be shown always */
    'Always' |
    /** Tooltip will be shown only in mouse move */
    'OnDemand';
/**
 * It defines the value Type for the axis used
 * * double
 * * category
 * * dateTime
 * * logarithmic
 * @private
 */
export type RangeValueType =
    /** Double axis */
    'Double' |
    /** Datetime axis */
    'DateTime' |
    /** Logarithmic axis */
    'Logarithmic';

/**
 * Label alignment of the axis
 * *Near
 * *Middle
 * *Far
 * @private
 */
export type LabelAlignment =
    /** Near alignment */
    'Near' |
    /** Middle alignment */
    'Middle' |
    /** Far Alignment */
    'Far';

/**
 * Period selector position
 * *Top
 * *Bottom
 */
export type PeriodSelectorPosition =
    /** Top position */
    'Top' |
    /** Bottom position */
    'Bottom';

/** 
 * Defines the intersect action. They are
 * * none - Shows all the labels.
 * * hide - Hide the label when it intersect.
 * * 
 */
export type RangeLabelIntersectAction =
    /** Shows all the labels. */
    'None' |
    /** Hide the label when it intersect. */
    'Hide';
