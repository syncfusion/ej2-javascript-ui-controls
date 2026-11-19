/**
 * Chart type.
 */
export type ChartType =
    'Column' |
    'StackingColumn' |
    'StackingColumn100' |
    'Bar' |
    'StackingBar' |
    'StackingBar100' |
    'Area' |
    'StackingArea' |
    'StackingArea100' |
    'Line' |
    'StackingLine' |
    'StackingLine100' |
    'Pie' |
    'Doughnut' |
    'Scatter' |
    'Bubble';

/**
 * Chart theme.
 */
export type ChartTheme =
    'Material' |
    'Fabric' |
    'Bootstrap' |
    'HighContrastLight' |
    'MaterialDark' |
    'FabricDark' |
    'HighContrast' |
    'BootstrapDark' |
    'Bootstrap4' |
    'Bootstrap5Dark' |
    'Bootstrap5' |
    'Tailwind' |
    'TailwindDark' |
    'Tailwind3' |
    'Tailwind3Dark' |
    'Fluent' |
    'FluentDark' |
    'Fluent2' |
    'Fluent2Dark' |
    'Material3' |
    'Material3Dark';

/**
 * Defines the position of the legend.
 */
export type LegendPosition = 'Auto' | 'Top' | 'Bottom' | 'Left' | 'Right';

/**
 * Defines the position of the data label.
 */
export type LabelPosition = 'Auto' | 'Top' | 'Bottom' | 'Middle' | 'Inside' | 'Outside' | 'Outer';

/**
 * Defines the shape of a marker.
 */
export type ChartShape = 'Circle' | 'Rectangle' | 'Triangle' | 'Diamond' | 'Cross' | 'HorizontalLine' | 'VerticalLine' | 'Pentagon' | 'InvertedTriangle' | 'Plus' | 'None';

/**
 * Defines the value type of an axis.
 */
export type ValueType = 'Double' | 'Category' | 'DateTime' | 'Logarithmic';
