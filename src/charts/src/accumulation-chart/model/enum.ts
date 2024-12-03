/**
 * Accumulation charts Enum file
 */
/**
 * Defines the Accumulation Chart series type.
 * * Pie - Accumulation chart Pie series type.
 * * Funnel - Accumulation chart Funnel series type.
 * * Pyramid - Accumulation chart Pyramid series type.
 */
export type AccumulationType =
    /** Accumulation chart Pie series type */
    'Pie' |
    /** Accumulation chart Funnel series type */
    'Funnel' |
    /** Accumulation chart Pyramid series type */
    'Pyramid';
/**
 * Defines the AccumulationLabelPosition. They are:
 * * Inside - Define the data label position for the accumulation series Inside.
 * * Outside - Define the data label position for the accumulation series Outside.
 */
export type AccumulationLabelPosition =
    /** Define the data label position for the accumulation series Inside */
    'Inside' |
    /** Define the data label position for the accumulation series Outside */
    'Outside';

/**
 * Defines the type of connector lines in an accumulation series. The options are:
 * * Line - Accumulation series Connector line type as Straight line.
 * * Curve - Accumulation series Connector line type as Curved line.
 */
export type ConnectorType =
    /** Accumulation series Connector line type as Straight line */
    'Line' |
    /** Accumulation series Connector line type as Curved line */
    'Curve';
/**
 * Defines the SelectionMode, They are:
 * * None - Disable the selection.
 * * Point - To select a point.
 */
export type AccumulationSelectionMode =
    /** Disable the selection. */
    'None' |
    /** To select a point. */
    'Point';
/**
 * Specifies whether a data point should be highlighted. The options are:
 * * None - Disable the Highlight.
 * * Point - To highlight a point.
 */
export type AccumulationHighlightMode =
    /** Disable the highlight. */
    'None' |
    /** To highlight a point. */
    'Point';
/**
 * Defines the theme of the accumulation chart. They are:
 * * Material - Render a accumulation chart with Material theme.
 * * Fabric - Render a accumulation chart with Fabric theme.
 * * Bootstrap - Render a accumulation chart with Bootstrap theme.
 * * HighContrastLight - Render a accumulation chart with HighcontrastLight theme.
 * * MaterialDark - Render a accumulation chart with MaterialDark theme.
 * * FabricDark - Render a accumulation chart with FabricDark theme.
 * * HighContrast - Render a accumulation chart with HighContrast theme.
 * * BootstrapDark - Render a accumulation chart with BootstrapDark theme.
 * * Bootstrap4 - Render a accumulation chart with Bootstrap4 theme.
 * * Tailwind - Render a accumulation chart with Tailwind theme.
 * * TailwindDark - Render a accumulation chart with TailwindDark theme.
 * * Bootstrap5 - Render a accumulation chart with Bootstrap5 theme.
 * * Bootstrap5Dark - Render a accumulation chart with Bootstrap5Dark theme.
 * * Fluent - Render a accumulation chart with Fluent theme.
 * * FluentDark - Render a accumulation chart with FluentDark theme.
 * * Fluent2 - Render a accumulation chart with Fluent2 theme.
 * * Fluent2Dark - Render a accumulation chart with Fluent2Dark theme.
 * * Material3 - Render a accumulation chart with Material3 theme.
 * * Material3Dark - Render a accumulation chart with Material3Dark theme.
 */
export type AccumulationTheme =
    /**  Render a accumulation chart with Material theme. */
    'Material' |
    /**  Render a accumulation chart with Fabric theme. */
    'Fabric' |
    /**  Render a accumulation chart with Bootstrap theme. */
    'Bootstrap' |
    /**  Render a accumulation chart with Highcontrast Light theme. */
    'HighContrastLight'|
    /**  Render a accumulation chart with MaterialDark theme. */
    'MaterialDark' |
    /**  Render a accumulation chart with FabricDark theme. */
    'FabricDark' |
    /**  Render a accumulation chart with HighContrastDark theme. */
    'HighContrast'|
    /**  Render a accumulation chart with BootstrapDark theme. */
    'BootstrapDark'|
    /**  Render a accumulation chart with BootstrapDark theme. */
    'Bootstrap4'|
    /**  Render a accumulation chart with Tailwind theme. */
    'Tailwind' |
    /**  Render a accumulation chart with TailwindDark theme. */
    'TailwindDark' |
    /**  Render a accumulation chart with Bootstrap5 theme. */
    'Bootstrap5' |
    /**  Render a accumulation chart with Bootstrap5Dark theme. */
    'Bootstrap5Dark' |
    /**  Render a accumulation chart with Fluent theme. */
    'Fluent' |
    /**  Render a accumulation chart with FluentDark theme. */
    'FluentDark' |
    /**  Render a accumulation chart with Fluent 2 theme. */
    'Fluent2' |
    /**  Render a accumulation chart with Fluent 2 dark theme. */
    'Fluent2Dark' |
    /**  Render a accumulation chart with Fluent 2 highcontrast theme. */
    'Fluent2HighContrast' |
    /**  Render a accumulation chart with Material 3 theme. */
    'Material3' |
    /**  Render a accumulation chart with Material 3 dark theme. */
    'Material3Dark';

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
 * Defines the mode of the pyramid.
 * * Linear - Height of the pyramid segments reflects the values.
 * * Surface - Surface/Area of the  pyramid segments reflects the values.
 */
export type PyramidModes =
    /** Height of the pyramid segments reflects the values */
    'Linear' |
    /** Surface/Area of the  pyramid segments reflects the values */
    'Surface';

/**
 * Defines the mode of the group.
 * * Point - When choosing points, the selected points get grouped.
 * * Value - When choosing values, the points which less then values get grouped.
 */
export type GroupModes =
    /** When choosing points, the selected points get grouped */
    'Point' |
    /** When choosing values, the points which less then values get grouped. */
    'Value';
