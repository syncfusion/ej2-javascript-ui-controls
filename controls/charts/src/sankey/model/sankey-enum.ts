/**
 * Defines the theme of the Sankey chart. They are:
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
export type SankeyTheme =
    /**  Render a accumulation chart with Material theme. */
    'Material' |
    /**  Render a accumulation chart with Fabric theme. */
    'Fabric' |
    /**  Render a accumulation chart with Bootstrap theme. */
    'Bootstrap' |
    /**  Render a accumulation chart with Highcontrast Light theme. */
    'HighContrastLight' |
    /**  Render a accumulation chart with MaterialDark theme. */
    'MaterialDark' |
    /**  Render a accumulation chart with FabricDark theme. */
    'FabricDark' |
    /**  Render a accumulation chart with HighContrastDark theme. */
    'HighContrast' |
    /**  Render a accumulation chart with BootstrapDark theme. */
    'BootstrapDark' |
    /**  Render a accumulation chart with BootstrapDark theme. */
    'Bootstrap4' |
    /**  Render a accumulation chart with Tailwind theme. */
    'Tailwind' |
    /**  Render a accumulation chart with TailwindDark theme. */
    'TailwindDark' |
    /**  Render a accumulation chart with Tailwind3 theme. */
    'Tailwind3' |
    /**  Render a accumulation chart with Tailwind3Dark theme. */
    'Tailwind3Dark' |
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
 * Defines the possible color application modes for links in a Sankey chart.
 * Available options are:
 * * `Blend`: Blends the colors of the source and target nodes for the link.
 * * `Source`: Applies the color of the source node to the link.
 * * `Target`: Applies the color of the target node to the link.
 */
export type ColorType =
    /** Blends the colors of the source and target nodes for the link. */
    'Blend' |
    /** Applies the color of the source node to the link. */
    'Source' |
    /** Applies the color of the target node to the link. */
    'Target';
