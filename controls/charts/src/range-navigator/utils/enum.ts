/**
 * It defines type of series in the range navigator.
 * * line
 * * column
 * * area
 *
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
 * It defines type of thump in the range navigator.
 * * circle
 * * rectangle
 *
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
 *
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
 *
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
 *
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

/** 
 * Defines the Label Placement for axis. They are 
 * * betweenTicks - Render the label between the ticks. 
 * * onTicks - Render the label on the ticks. 
 * * auto - Render the label between or on the ticks based on data. 
 */ 
export type NavigatorPlacement = 
    /** Render the label between the ticks. */ 
    'BetweenTicks' | 
    /** Render the label on the ticks. */ 
    'OnTicks' | 
    /** Render the label between or on the ticks based on data. */ 
    'Auto'; 