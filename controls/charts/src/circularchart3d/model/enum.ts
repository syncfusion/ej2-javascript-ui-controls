/**
 * Defines the themes for the circular 3D chart.
 */
export type CircularChart3DTheme =
    /**  Render a circular 3D chart with the Material theme. */
    'Material' |
    /**  Render a circular 3D chart with the Fabric theme. */
    'Fabric' |
    /**  Render a circular 3D chart with the Bootstrap theme. */
    'Bootstrap' |
    /**  Render a circular 3D chart with the High Contrast Light theme. */
    'HighContrastLight' |
    /**  Render a circular 3D chart with the MaterialDark theme. */
    'MaterialDark' |
    /**  Render a circular 3D chart with the FabricDark theme. */
    'FabricDark' |
    /**  Render a circular 3D chart with the HighContrastDark theme. */
    'HighContrast' |
    /**  Render a circular 3D chart with the BootstrapDark theme. */
    'BootstrapDark' |
    /**  Render a circular 3D chart with the Bootstrap4 theme. */
    'Bootstrap4' |
    /**  Render a circular 3D chart with the Tailwind theme. */
    'Tailwind' |
    /**  Render a circular 3D chart with the TailwindDark theme. */
    'TailwindDark' |
    /**  Render a circular 3D chart with the Bootstrap5 theme. */
    'Bootstrap5' |
    /**  Render a circular 3D chart with the Bootstrap5Dark theme. */
    'Bootstrap5Dark' |
    /**  Render a circular 3D chart with the Fluent theme. */
    'Fluent' |
    /**  Render a circular 3D chart with the FluentDark theme. */
    'FluentDark' |
    /**  Render a circular 3D chart with the Fluent 2 theme. */
    'Fluent2' |
    /**  Render a circular 3D chart with the Fluent 2 dark theme. */
    'Fluent2Dark' |
    /**  Render a circular 3D chart with the Fluent 2 highcontrast theme. */
    'Fluent2HighContrast' |
    /**  Render a circular 3D chart with the Material 3 theme. */
    'Material3' |
    /**  Render a circular 3D chart with the Material 3 Dark theme. */
    'Material3Dark';

/**
 * Defines the SelectionMode. Options are:
 * * None - Disable the selection.
 * * Point - Selects a point.
 */
export type CircularChart3DSelectionMode =
    /** Disable the selection. */
    'None' |
    /** Selects a point. */
    'Point';

/**
 * Defines the HighlightMode. Options are:
 * * None - Disable the highlight.
 * * Point - Highlights a point.
 */
export type CircularChart3DHighlightMode =
    /** Disable the highlight. */
    'None' |
    /** Highlights a point. */
    'Point';

/**
 * Defines the Circular 3D data label positions. They can be:
 * * 'Inside': Define the data label position inside the circular 3D series.
 * * 'Outside': Define the data label position outside the circular 3D series.
 */
export type CircularChart3DLabelPosition =
    /** Define the data label position inside the circular 3D series. */
    'Inside' |
    /** Define the data label position outside the circular 3D series. */
    'Outside';
