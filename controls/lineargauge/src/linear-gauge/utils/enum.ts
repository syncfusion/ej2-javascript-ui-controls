
/**
 * Defines Position of Ticks / Labels / Pointers / Ranges. They are
 * * Inside
 * * Outside
 * * Cross
 * * Auto
 * @private
 */
export type Position =
    /**  Inside of Axis. */
    'Inside' |
    /**  Outside of Axis. */
    'Outside'|
    /**  Cross of Axis. */
    'Cross' |
    /** Default position of Axis. */
    'Auto';

/**
 * Defines type of pointer. They are
 * * Marker
 * * Bar
 * @private
 */

export type Point =
    /**  Marker pointer. */
    'Marker' |
    /**  Bar pointer. */
    'Bar';

/**
 * Defines Theme of the gauge. They are
 * * Material
 * * Fabric
 * @private
 */
export type LinearGaugeTheme =
    /**  Render a gauge with Material theme. */
    'Material' |
    /**  Render a gauge with Bootstrap theme. */
    'Bootstrap' |
    /**  Render a gauge with Highcontrast Light theme. */
    'HighContrastLight'|
    /**  Render a gauge with Fabric theme. */
    'Fabric'|
    /**  Render a gauge with Material Dark theme. */
    'MaterialDark' |
    /**  Render a gauge with Fabric Dark theme. */
    'FabricDark' |
    /**  Render a gauge with Highcontrast Dark theme. */
    'HighContrast'|
    /**  Render a gauge with Bootstrap Dark theme. */
    'BootstrapDark'|
    /** Render a gauge with Bootstrap4 theme. */
    'Bootstrap4';

/**
 * Defines the type of marker. They are
 * Traingle
 * Diamond
 * Rectangle
 * Circle
 * Image
 * @private
 */

export type MarkerType =
    /**
     * Triangle marker
     */
    'Triangle' |
    /**
     * Inverted triangle
     */
    'InvertedTriangle' |
    /**
     * Diamond marker
     */
    'Diamond' |
    /**
     * Rectangle marker
     */
    'Rectangle' |
    /**
     * Circle marker
     */
    'Circle' |
    /**
     * Arrow marker
     */
    'Arrow' |
    /**
     * Inverted Arrow marker
     */
    'InvertedArrow' |
    /**
     * Image marker
     */
    'Image';


/**
 * Defines the place of the pointer. They are
 * None
 * Near
 * Center
 * Far
 * @private
 */

export type Placement =
    /**
     * Near
     */
    'Near' |
    /**
     * Center
     */
    'Center' |
    /**
     * Far
     */
    'Far' |
    /**
     * None
     */
    'None';

/**
 * Defines the type of gauge orientation. They are
 * Horizontal
 * Vertical
 * @private
 */
export type Orientation =
    /**
     * Horizontal
     */
    'Horizontal' |
    /**
     * Vertical
     */
    'Vertical';

/**
 * Defines the container type. They are
 * Normal
 * Thermometer
 * Rounded Rectangle
 */
export type ContainerType =
    /** To draw the normal rectangle box */
    'Normal' |
    /**
     * To draw the thermometer box
     */
    'Thermometer' |
    /**
     * To draw the rounded rectangle box
     */
    'RoundedRectangle';

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
/**
 * Tooltip Position
 */
export type TooltipPosition =
     /** To draw the normal rectangle box */
     'Start' |
     /**
      * To draw the thermometer box
      */
     'Center' |
     /**
      * To draw the rounded rectangle box
      */
     'End';