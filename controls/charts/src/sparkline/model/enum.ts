/**
 * Sparkline Enum
 */

/**
 * Specifies the sparkline types.
 * `Line`, `Column`, `WinLoss`, `Pie` and `Area`.
 */
export type SparklineType =
 /** Define the Sparkline Line type series. */
 'Line' |
 /** Define the Sparkline Column type series. */
 'Column' |
 /** Define the Sparkline WinLoss type series. */
 'WinLoss' |
 /** Define the Sparkline Pie type series. */
 'Pie' |
 /** Define the Sparkline Area type series. */
 'Area';

/**
 * Defines the range padding of series.
 * `None`, `Normal`, `Additional`, `Additional`.
 */
export type SparklineRangePadding =
 /** Define the Sparkline Line type series. */
 'None' |
 /** Define the Sparkline Column type series. */
 'Normal' |
 /** Define the Sparkline WinLoss type series. */
 'Additional';

/**
 * Specifies the sparkline data value types.
 * `Numeric`, `Category` and `DateTime`.
 */
export type SparklineValueType =
 /** Define the Sparkline Numeric value type series. */
 'Numeric' |
 /** Define the Sparkline Category value type series. */
 'Category' |
 /** Define the Sparkline DateTime value type series. */
 'DateTime';

/**
 * Specifies the sparkline marker | datalabel visible types.
 * `All`,  `High`,  `Low`,  `Start`,  `End`,  `Negative` and `None`.
 */
export type VisibleType =
 /** Define the Sparkline marker | datalabel  Visbile All type */
 'All' |
 /** Define the Sparkline marker | datalabel Visbile High type */
 'High' |
 /** Define the Sparkline marker | datalabel Visbile Low type */
 'Low' |
 /** Define the Sparkline marker | datalabel Visbile Start type */
 'Start' |
 /** Define the Sparkline marker | datalabel Visbile End type */
 'End' |
 /** Define the Sparkline marker | datalabel Visbile Negative type */
 'Negative' |
 /** Define the Sparkline marker | datalabel Visbile None type */
 'None';
/**
 * Defines Theme of the sparkline. They are:
 * * Material - Render a sparkline with Material theme.
 * * Fabric - Render a sparkline with Fabric theme.
 * * Bootstrap - Render a sparkline with Bootstrap theme.
 * * HighContrast - Render a sparkline with HighContrast theme.
 * * Dark - Render a sparkline with Dark theme.
 */
export type SparklineTheme =
    /**  Render a sparkline with Material theme. */
    'Material' |
    /**  Render a sparkline with Fabric theme. */
    'Fabric' |
    /**  Render a sparkline with Bootstrap theme. */
    'Bootstrap' |
    /**  Render a sparkline with HighContrast Light theme. */
    'HighContrastLight' |
    /**  Render a sparkline with Material Dark theme. */
    'MaterialDark'|
    /**  Render a sparkline with Fabric Dark theme. */
    'FabricDark'|
    /**  Render a sparkline with Highcontrast Dark theme. */
    'HighContrast'|
    /**  Render a sparkline with Bootstrap Dark theme. */
    'BootstrapDark'|
    /** Render a sparkline with Bootstrap4 theme. */
    'Bootstrap4'|
    /**  Render a sparkline with Tailwind theme. */
    'Tailwind' |
    /**  Render a sparkline with TailwindDark theme. */
    'TailwindDark' |
    /**  Render a sparkline with Bootstrap5 theme. */
    'Bootstrap5' |
    /**  Render a sparkline with Bootstrap5Dark theme. */
    'Bootstrap5Dark' |
    /**  Render a sparkline with Fluent theme. */
    'Fluent' |
    /**  Render a sparkline with Fluent 2 theme. */
    'Fluent2' |
    /**  Render a sparkline with Fluent 2 dark theme. */
    'Fluent2Dark' |
    /**  Render a sparkline with Fluent 2 highcontrast theme. */
    'Fluent2HighContrast' |
    /**  Render a sparkline with FluentDark theme. */
    'FluentDark' |
    /**  Render a smithchart with Material 3 theme. */
    'Material3' |
    /**  Render a smithchart with Material 3 dark theme. */
    'Material3Dark';

/**
 * Defines edge data label placement for datalabel, if exceeds the sparkline area horizontally.
 * * None - Edge data label shown as clipped text.
 * * Shift - Edge data label moved inside the sparkline area.
 * * Hide - Edge data label will hide, if exceeds the sparkline area.
 */
export type EdgeLabelMode =
/** Edge data label shown as clipped text */
'None' |
/** Edge data label moved inside the sparkline area */
'Shift' |
/** Edge data label will hide, if exceeds the sparkline area */
'Hide';
