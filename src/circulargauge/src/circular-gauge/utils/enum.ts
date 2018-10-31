/** 
 * Defines position of the axis ticks / labels. They are
 * * inside
 * * outside
 * @private
 */
export type Position =
    /**  Inside position of the tick line / axis label. */
    'Inside' |
    /**  Outside position of the tick line / axis label. */
    'Outside';

/** 
 * Defines Pointer type of the axis. They are
 * * needle
 * * marker
 * * rangeBar
 * @private
 */
export type PointerType =
    /**  Specifies the pointer type as needle. */
    'Needle' |
    /**  Specifies the pointer type as marker. */
    'Marker' |
    /**  Specifies the pointer type as range bar. */
    'RangeBar';

/** 
 * Defines Direction of the gauge. They are
 * * ClockWise
 * * AntiClockWise
 * @private
 */
export type GaugeDirection =
    /** Renders the axis in clock wise direction. */
    'ClockWise' |
    /** Renders the axis in anti-clock wise direction. */
    'AntiClockWise';

/** 
 * Defines Theme of the gauge. They are
 * * Material
 * * Fabric
 * @private
 */
export type GaugeTheme =
    /**  Render a gauge with Material theme. */
    'Material' |
    /**  Render a gauge with Bootstrap theme. */
    'Bootstrap' |
    /**  Render a gauge with Highcontrast theme. */
    'Highcontrast'|
    /**  Render a gauge with Fabric theme. */
    'Fabric';


/** 
 * Defines Hidden label of the axis. They are
 * * First
 * * Last
 * @private
 */
export type HiddenLabel =
    /**  Hides the 1st label on intersect. */
    'First' |
    /**  Hides the last label on intersect. */
    'Last' |
    /**  Places both the labels. */
    'None';

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
export type GaugeShape =
    /** Render a circle. */
    'Circle' |
    /** Render a Rectangle. */
    'Rectangle' |
    /** Render a Triangle. */
    'Triangle' |
    /** Render a Diamond. */
    'Diamond' |
    /** Render a InvertedTriangle. */
    'InvertedTriangle' |
    /** Render a Image. */
    'Image';