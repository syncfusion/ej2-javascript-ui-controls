/**
 * Defines position of the axis ticks / labels. They are
 * * inside
 * * outside
 * * cross
 * @private
 */
export type Position =
    /**  Inside position of the tick line / axis label / Range. */
    'Inside' |
    /**  Outside position of the tick line / axis label / Range. */
    'Outside' |
    /**  Specifies the position type as range cross / Range. */
    'Cross' ;

/**
 * Defines position of the axis range / pointers. They are
 * * inside
 * * outside
 * * Cross
 * * Auto
 * @private
 */
export type PointerRangePosition =
    /**  Inside position of the pointer. */
    'Inside' |
    /**  Outside position of the pointer. */
    'Outside' |
    /**  Cross position of the pointer. */
    'Cross' |
    /**  Auto position of the pointer. */
    'Auto';

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
    /**  Render a gauge with Highcontrast light theme. */
    'HighContrastLight'|
    /**  Render a gauge with Fabric theme. */
    'Fabric'|
    /**  Render a chart with Material Dark theme. */
    'MaterialDark'|
    /**  Render a chart with Fabric Dark theme. */
    'FabricDark'|
    /**  Render a chart with Highcontrast Dark theme. */
    'HighContrast'|
    /**  Render a chart with Bootstrap Dark theme. */
    'BootstrapDark'|
    /** Render a chart with Bootstrap 4 theme. */
    'Bootstrap4';


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

export type LegendPosition =
    /** Places the legend on the top of circular gauge. */
    'Top' |
    /** Places the legend on the left of circular gauge. */
    'Left' |
    /** Places the legend on the bottom of circular gauge. */
    'Bottom' |
    /** Places the legend on the right of circular gauge. */
    'Right' |
    /** Places the legend on the custom x and y location */
    'Custom' |
    /** Places the legend based on the available space */
    'Auto';

export type Alignment =
     /** Places the legend on the near of the circular gauge */
     'Near' |
     /** Places the legend on the center of the circular gauge */
     'Center' |
     /** Places the legend on the far on the circular gauge */
     'Far';

/**
 * Export Type
 */
export type ExportType =
    /** Used to export a image as png format */
    'PNG' |
    /** Used to export a image as jpeg format */
    'JPEG' |
    /** Used to export a file as svg format */
    'SVG' |
    /** Used to export a file as pdf format */
    'PDF';
