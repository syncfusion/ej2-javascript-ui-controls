/**
 * Defines Theme of the smithchart. They are
 * * Material - Render a smithchart with Material theme.
 * * Fabric - Render a smithchart with Fabric theme
 */
export type SmithchartTheme =
    /**  Render a smithchart with Material theme. */
    'Material' |
    /**  Render a smithchart with Fabric theme. */
    'Fabric' |
    /**  Render a smithchart with Bootstrap theme. */
    'Bootstrap' |
    /**  Render a smithchart with Highcontrast Light theme. */
    'HighContrastLight' |
    /**  Render a smithchart with Material Dark theme. */
    'MaterialDark'|
    /**  Render a smithchart with Fabric Dark theme. */
    'FabricDark'|
    /**  Render a smithchart with Highcontrast Dark theme. */
    'HighContrast'|
    /**  Render a smithchart with Bootstrap Dark theme. */
    'BootstrapDark'|
    /** Render a smithchart with Bootstrap4 theme. */
    'Bootstrap4'|
    /**  Render a smithchart with Tailwind theme. */
    'Tailwind' |
    /**  Render a smithchart with TailwindDark theme. */
    'TailwindDark' |
    /**  Render a smithchart with Bootstrap5 theme. */
    'Bootstrap5' |
    /**  Render a smithchart with Bootstrap5Dark theme. */
    'Bootstrap5Dark' |
    /**  Render a smithchart with Fluent theme. */
    'Fluent' |
    /**  Render a smithchart with FluentDark theme. */
    'FluentDark' |
    /**  Render a smithchart with Material 3 theme. */
    'Material3' |
    /**  Render a smithchart with Material 3 dark theme. */
    'Material3Dark';

/**
 * Defines render type of smithchart. They are
 * * Impedance - Render a smithchart with Impedance type.
 * * Admittance - Render a smithchart with Admittance type.
 */

export type RenderType =
/**  Render a smithchart with Impedance type. */
    'Impedance' |
    /**  Render a smithchart with Admittance type. */
    'Admittance';

export type AxisLabelPosition =

/**  Render a axis label with label position as outside. */
    'Outside' |
    /**  Render a axis label with label position as outside. */
    'Inside';

export type SmithchartLabelIntersectAction =
/**  Hide the overlapped axis label. */
    'Hide' |
    /**  Render the overlapped axis label */
    'None';

/**
 * Defines the Alignment. They are
 * * near - Align the element to the left.
 * * center - Align the element to the center.
 * * far - Align the element to the right.
 * *
 */

export type SmithchartAlignment =
    /** Define the left alignment. */
    'Near' |
    /** Define the center alignment. */
    'Center' |
    /** Define the right alignment. */
    'Far';

export type SmithchartExportType =
/** Used to export a image as png format */
'PNG' |
/** Used to export a image as jpeg format */
'JPEG' |
/** Used to export a file as svg format */
'SVG'|
/** Used to export a file as pdf format */
'PDF';
/**
 * Specifies TreeMap beforePrint event name.
 *
 * @private
 */
export const smithchartBeforePrint : string = 'beforePrint';
