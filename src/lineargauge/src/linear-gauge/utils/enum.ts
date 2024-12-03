
/**
 * Defines the position of ticks, labels, pointers, and ranges.
 *
 * @private
 */
export type Position =
    /** Specifies the position of ticks, labels, pointers, and ranges to be placed inside the axis. */
    'Inside' |
    /** Specifies the position of ticks, labels, pointers, and ranges to be placed outside the axis. */
    'Outside'|
    /** Specifies the position of ticks, labels, pointers, and ranges to be placed on the axis. */
    'Cross' |
    /** Specifies the position of ticks, labels, pointers, and ranges to be placed based on the available size in linear gauge. */
    'Auto';

/**
 * Defines type of pointer in linear gauge.
 *
 * @private
 */

export type Point =
    /** Specifies the pointer as marker type. */
    'Marker' |
    /** Specifies the pointer as bar. */
    'Bar';

/**
 * Defines theme supported for the linear gauge.
 *
 * @private
 */
export type LinearGaugeTheme =
    /** Renders the linear gauge with material theme. */
    'Material' |
    /** Renders the linear gauge with bootstrap theme. */
    'Bootstrap' |
    /** Renders the linear gauge with highcontrast light theme. */
    'HighContrastLight'|
    /** Renders the linear gauge with fabric theme. */
    'Fabric'|
    /** Renders the linear gauge with material dark theme. */
    'MaterialDark' |
    /** Renders the linear gauge with fabric dark theme. */
    'FabricDark' |
    /** Renders the linear gauge with highcontrast dark theme. */
    'HighContrast'|
    /** Renders the linear gauge with bootstrap dark theme. */
    'BootstrapDark'|
    /** Renders the linear gauge with bootstrap4 theme. */
    'Bootstrap4' |
    /** Renders the linear gauge with Tailwind theme. */
    'Tailwind' |
    /** Renders the linear gauge with TailwindDark theme. */
    'TailwindDark' |
    /** Renders the linear gauge with Bootstrap5 theme. */
    'Bootstrap5' |
    /**  Render the linear gauge with Bootstrap5 dark theme. */
    'Bootstrap5Dark' |
    /** Renders the linear gauge with Fluent theme. */
    'Fluent' |
    /**  Render the linear gauge with Fluent dark theme. */
    'FluentDark'|
    /** Renders the linear gauge with Fluent2 theme. */
    'Fluent2' |
    /**  Render the linear gauge with Fluent2 dark theme. */
    'Fluent2Dark'|
    /**  Render the linear gauge with Fluent2 high contrast theme. */
    'Fluent2HighContrast'|
    /** Renders the linear gauge with Material3 theme. */
    'Material3' |
    /** Renders the linear gauge with Material3Dark theme. */
    'Material3Dark';

/**
 * Defines the type of marker.
 *
 * @private
 */

export type MarkerType =
    /**
     * Specifies the marker as triangle.
     */
    'Triangle' |
    /**
     * Specifies the marker as inverted triangle.
     */
    'InvertedTriangle' |
    /**
     * Specifies the marker as diamond.
     */
    'Diamond' |
    /**
     * Specifies the marker as rectangle.
     */
    'Rectangle' |
    /**
     * Specifies the marker as circle.
     */
    'Circle' |
    /**
     * Specifies the marker as arrow.
     */
    'Arrow' |
    /**
     * Specifies the marker as inverted arrow.
     */
    'InvertedArrow' |
    /**
     * Specifies the marker as image.
     */
    'Image' |
    /**
     * Specifies the marker as text.
     */
    'Text';


/**
 * Defines the place of the pointer.
 *
 * @private
 */

export type Placement =
    /**
     * Specifies the pointer to be placed near the linear gauge.
     */
    'Near' |
    /**
     * Specifies the pointer to be placed at the center of the linear gauge.
     */
    'Center' |
    /**
     * Specifies the pointer to be placed far from the linear gauge.
     */
    'Far' |
    /**
     * Specifies the pointer to be placed at default position.
     */
    'None';

/**
 * Defines the type of gauge orientation.
 *
 * @private
 */
export type Orientation =
    /**
     * Specifies the linear gauge to be placed horizontally.
     */
    'Horizontal' |
    /**
     * Specifies the linear gauge to be placed vertically.
     */
    'Vertical';

/**
 * Defines the placement of the label in linear gauge.
 *
 * @private
 */
export type LabelPlacement =
    /**
     * Specifies that the first and last labels to be placed at the default position.
     */
    'None' |
    /**
     * Specifies that the first and last labels to be shifted within the axis.
     */
    'Shift' |
    /**
     * Specifies that the first and last labels to be trimmed.
     */
    'Trim' |
    /**
     * Specifies that the first and last labels must trim or shift automatically.
     */
    'Auto';

/**
 * Defines the container type.
 */
export type ContainerType =
    /** Specifies the container to be drawn as normal rectangle box. */
    'Normal' |
    /**
     * Specifies the container to be drawn as the thermometer box.
     */
    'Thermometer' |
    /**
     * Specifies the container to be drawn as the rounded rectangle box.
     */
    'RoundedRectangle';

/**
 * Defines the export type.
 */
export type ExportType =
    /** Specifies the rendered linear gauge to be exported as png format */
    'PNG' |
    /** Specifies the rendered linear gauge to be exported as jpeg format */
    'JPEG' |
    /** Specifies the rendered linear gauge to be exported as svg format */
    'SVG' |
    /** Specifies the rendered linear gauge to be exported as pdf format */
    'PDF';
/**
 * Specifies the tooltip position for the range in linear gauge.
 */
export type TooltipPosition =
     /** Specifies the tooltip for the range to be placed at the start of the range. */
     'Start' |
     /**
      * Specifies the tooltip for the range to be placed at the center of the range.
      */
     'Center' |
     /**
      * Specifies the tooltip for the range to be placed at the end of the range.
      */
     'End';
