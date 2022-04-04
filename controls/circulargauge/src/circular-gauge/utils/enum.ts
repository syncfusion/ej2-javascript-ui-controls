/**
 * Defines the position of the axis ticks and labels.
 *
 * @private
 */
export type Position =
    /** Specifies the position of the tick line and axis label inside the axis. */
    'Inside' |
    /** Specifies the position of the tick line and axis label outside the axis. */
    'Outside' |
    /** Specifies the position of the tick line and axis label on the axis. */
    'Cross' ;

/**
 * Defines the position of the axis range and pointers.
 *
 * @private
 */
export type PointerRangePosition =
    /** Specifies the position of the range and pointer inside the axis. */
    'Inside' |
    /** Specifies the position of the range and pointer outside the axis. */
    'Outside' |
    /** Specifies the position of the range and pointer on the axis. */
    'Cross' |
    /** Specifies the default position of the range and pointer in the axis. */
    'Auto';

/**
 * Defines the type of pointer in the axis.
 *
 * @private
 */
export type PointerType =
    /** Specifies the pointer type as needle. */
    'Needle' |
    /** Specifies the pointer type as marker. */
    'Marker' |
    /** Specifies the pointer type as range bar. */
    'RangeBar';

/**
 * Specifies the direction of the circular gauge.
 *
 * @private
 */
export type GaugeDirection =
    /** Renders the axis in clock wise direction. */
    'ClockWise' |
    /** Renders the axis in anti-clock wise direction. */
    'AntiClockWise';

/**
 * Defines the theme style of the circular gauge.
 *
 * @private
 */
export type GaugeTheme =
    /** Render a gauge with material theme. */
    'Material' |
    /** Render a gauge with bootstrap theme. */
    'Bootstrap' |
    /** Render a gauge with highcontrast light theme. */
    'HighContrastLight'|
    /** Render a gauge with fabric theme. */
    'Fabric'|
    /** Render a gauge with material dark theme. */
    'MaterialDark'|
    /** Render a gauge with fabric dark theme. */
    'FabricDark'|
    /** Render a gauge with highcontrast Dark theme. */
    'HighContrast'|
    /** Render a gauge with bootstrap Dark theme. */
    'BootstrapDark'|
    /** Render a gauge with bootstrap 4 theme. */
    'Bootstrap4' |
    /**  Render a gauge with Tailwind theme. */
    'Tailwind' |
    /**  Render a gauge with TailwindDark theme. */
    'TailwindDark' |
    /**  Render a gauge with Bootstrap5 theme. */
    'Bootstrap5' |
    /**  Render a gauge with Bootstrap5 dark theme. */
    'Bootstrap5Dark' |
    /**  Render a gauge with Fluent theme. */
    'Fluent' |
    /**  Render a gauge with Fluent dark theme. */
    'FluentDark';


/**
 * Specifies the axis label to be hidden in the axis of circular gauge.
 *
 * @private
 */
export type HiddenLabel =
    /** Specifies the first label to be hidden in circular gauge. */
    'First' |
    /** Specifies the last label to be hidden in circular gauge. */
    'Last' |
    /** No labels will be hidden in circular gauge. */
    'None';

/**
 * Specifies the shape of a marker in circular gauge.
 */
export type GaugeShape =
    /** Renders a marker shape as circle. */
    'Circle' |
    /** Renders the marker shape as rectangle. */
    'Rectangle' |
    /** Renders the marker shape as triangle. */
    'Triangle' |
    /** Renders the marker shape as diamond. */
    'Diamond' |
    /** Renders the marker shape as inverted triangle. */
    'InvertedTriangle' |
    /** Renders the marker shape as an image. */
    'Image' |
    /** Renders the marker as text. */
    'Text';

/**
 * Specifies the position of legend for ranges in circular gauge component.
 */
export type LegendPosition =
    /** Specifies the legend to be placed at the top of the circular gauge. */
    'Top' |
    /** Specifies the legend to be placed at the left of the circular gauge. */
    'Left' |
    /** Specifies the legend to be placed at the bottom of the circular gauge. */
    'Bottom' |
    /** Specifies the legend to be placed at the right of the circular gauge. */
    'Right' |
    /** Specifies the legend to be placed based on the custom x and y location. */
    'Custom' |
    /** Specifies the legend to be placed based on the available space. */
    'Auto';

/**
 * Specifies the alignment of the legend in circular gauge component.
 */
export type Alignment =
     /** Places the legend near the circular gauge with respect to the position of legend. */
     'Near' |
     /** Places the legend at the center of the circular gauge with respect to the position of legend. */
     'Center' |
     /** Places the legend far from the circular gauge with respect to the position of legend. */
     'Far';

/**
 * Specifies the export type of circular gauge component.
 */
export type ExportType =
    /** Specifies the rendered circular gauge to be exported in the png format. */
    'PNG' |
    /** Specifies the rendered cicular gauge to be exported in the jpeg format. */
    'JPEG' |
    /** Specifies the rendered circular gauge to be exported in the svg format. */
    'SVG' |
    /** Specifies the rendered circular gauge to be exported in the pdf format. */
    'PDF';
