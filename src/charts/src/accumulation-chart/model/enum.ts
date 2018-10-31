/**
 * Accumulation charts Enum file
 */
/**
 * Defines the Accumulation Chart series type.
 */
export type AccumulationType =
    /** Accumulation chart Pie series type */
    'Pie' |
    /** Accumulation chart Funnel series type */
    'Funnel' |
    /** Accumulation chart Pyramid series type */
    'Pyramid';
/**
 * Defines the AccumulationLabelPosition. They are
 * * Inside - Define the data label position for the accumulation series Inside.
 * * Outside - Define the data label position for the accumulation series Outside.
 * *
 */
export type AccumulationLabelPosition =
    /** Define the data label position for the accumulation series Inside */
    'Inside' |
    /** Define the data label position for the accumulation series Outside */
    'Outside';

/**
 * Defines the ConnectorType. They are
 * * Line - Accumulation series Connector line type as Straight line.
 * * Curve - Accumulation series Connector line type as Curved line.
 * *
 */
export type ConnectorType =
    /** Accumulation series Connector line type as Straight line */
    'Line' |
    /** Accumulation series Connector line type as Curved line */
    'Curve';
/**
 * Defines the SelectionMode, They are.
 * * none - Disable the selection.
 * * point - To select a point.
 */
export type AccumulationSelectionMode =
    /** Disable the selection. */
    'None' |
    /** To select a point. */
    'Point';
/**
 * Defines Theme of the accumulation chart. They are
 * * Material - Render a accumulation chart with Material theme.
 * * Fabric - Render a accumulation chart with fabric theme.
 */
export type AccumulationTheme =
    /**  Render a accumulation chart with Material theme. */
    'Material' |
    /**  Render a accumulation chart with Fabric theme. */
    'Fabric' |
    /**  Render a accumulation chart with Bootstrap theme. */
    'Bootstrap' |
    /**  Render a accumulation chart with Highcontrast theme. */
    'Highcontrast';
/**
 * Defines the empty point mode of the chart.
 * * Zero - Used to display empty points as zero.
 * * Drop - Used to ignore the empty point while rendering.
 * * Average - Used to display empty points as previous and next point average.
 */
export type AccEmptyPointMode =
    /** Used to display empty points as zero  */
    'Zero' |
    /** Used to ignore the empty point while rendering  */
    'Drop' |
     /** Used to display empty points as previous and next point average  */
    'Average' |
    /** Used to ignore the empty point while rendering   */
    'Gap';

/**
 * Defines the mode of the pyramid
 * * Linear - Height of the pyramid segments reflects the values
 * * Surface - Surface/Area of the  pyramid segments reflects the values
 */
export type PyramidModes =
    /** Height of the pyramid segments reflects the values */
    'Linear' |
    /** Surface/Area of the  pyramid segments reflects the values */
    'Surface';

/**
 * Defines the mode of the group mode
 * * Point - When choosing points, the selected points get grouped.
 * * Value - When choosing values, the points which less then values get grouped.
 */
export type GroupModes =
    /** When choosing points, the selected points get grouped */
    'Point' |
    /** When choosing values, the points which less then values get grouped. */
    'Value';