/**
 * Defines the shape of the marker. They are
 * * circle - Renders a circle.
 * * rectangle - Renders a rectangle.
 * * triangle - Renders a triangle.
 * * diamond - Renders a diamond.
 * * cross - Renders a cross.
 * * horizontalLine - Renders a horizontalLine.
 * * verticalLine - Renders a verticalLine.
 * * pentagon- Renders a pentagon.
 * * invertedTriangle - Renders a invertedTriangle.
 * * image - Renders a image
 * * star - Renders a star
 */
export type TooltipShape =
    /** Render a circle. */
    'Circle' |
    /** Render a Rectangle. */
    'Rectangle' |
    /** Render a Triangle. */
    'Triangle' |
    /** Render a Diamond. */
    'Diamond' |
    /** Specifies the shape of the marker as a cross symbol. */
    'Cross' |
    /** Specifies the shape of the marker as a plus symbol.  */
    'Plus'|
    /** Render a HorizontalLine. */
    'HorizontalLine' |
    /** Render a VerticalLine. */
    'VerticalLine' |
    /** Render a Pentagon. */
    'Pentagon' |
    /** Render a InvertedTriangle. */
    'InvertedTriangle' |
    /** Render a Image. */
    'Image' |
    /** Render a Star. */
    'Star' |
    /** Render a None */
    'None';

/**
 * Defines Theme of the chart. They are
 * * Material - Render a chart with Material theme.
 * * Fabric - Render a chart with Fabric theme
 */
export type TooltipTheme =
    /**  Render a chart with Material theme. */
    'Material' |
    /**  Render a chart with Fabric theme. */
    'Fabric' |
    /**  Render a chart with Bootstrap theme. */
    'Bootstrap' |
    /**  Render a chart with Highcontrast theme. */
    'HighContrastLight' |
    /**  Render a chart with Material Dark theme. */
    'MaterialDark' |
    /**  Render a chart with Fabric Dark theme. */
    'FabricDark' |
    /**  Render a chart with Highcontrast Dark theme. */
    'HighContrast' |
    /**  Render a chart with Bootstrap Dark theme. */
    'BootstrapDark' |
    /**  Render a chart with Bootstrap4 theme. */
    'Bootstrap4' |
    /**  Render a chart with Tailwind theme. */
    'Tailwind' |
    /**  Render a chart with TailwindDark theme. */
    'TailwindDark' |
    /**  Render a chart with Tailwind3 theme. */
    'Tailwind3' |
    /**  Render a chart with Tailwind3Dark theme. */
    'Tailwind3Dark' |
    /**  Render a chart with Bootstrap5 theme. */
    'Bootstrap5' |
    /**  Render a chart with Bootstrap5Dark theme. */
    'Bootstrap5Dark' |
    /**  Render a chart with Fluent theme. */
    'Fluent' |
    /**  Render a chart with FluentDark theme. */
    'FluentDark' |
    /**  Render a chart with Fluent 2 theme. */
    'Fluent2' |
    /**  Render a chart with Fluent 2 dark theme. */
    'Fluent2Dark' |
    /**  Render a chart with Fluent 2 HighContrast theme. */
    'Fluent2HighContrast' |
    /**  Render a chart with material 3 theme */
    'Material3' |
    /**  Render a chart with material 3 dark theme */
    'Material3Dark';

/**
 * Defines the tooltip position.
 */
export type TooltipPlacement =
    /** Render tooltip in Left position */
    'Left' |
    /** Render tooltip in Right position */
    'Right' |
    /** Render tooltip in Top position */
    'Top' |
    /** Render tooltip in Bottom position */
    'Bottom';
