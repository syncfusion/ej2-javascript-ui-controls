
/**
 * Defines the position of the label in treemap leaf node.
 */
export type LabelPosition =
    /** Specifies to show the position of the label based on the top and left of the treemap leaf nodes.  */
    'TopLeft' |
    /** Specifies to show the position of the label based on the top and center of the treemap leaf nodes. */
    'TopCenter' |
    /** Specifies to show the position of the label based on the top and right of the treemap leaf nodes. */
    'TopRight' |
    /** Specifies to show the position of the label based on the center and left of the treemap leaf nodes. */
    'CenterLeft' |
    /** Specifies to show the position of the label based on the center of the treemap leaf nodes. */
    'Center' |
    /** Specifies to show the position of the label based on the center and right of the treemap leaf nodes. */
    'CenterRight' |
    /** Specifies to show the position of the label based on the bottom and left of the treemap leaf nodes. */
    'BottomLeft' |
    /** Specifies to show the position of the label based on the bottom and center of the treemap leaf nodes. */
    'BottomCenter' |
    /** Specifies to show the position of the label based on the bottom and right of the treemap leaf nodes. */
    'BottomRight';

/**
 * Specifies the layout rendering mode of the treemap.
 */
export type LayoutMode =
    /** This visualizes the treemap as the nested rectangles having size proportionate to weight value. */
    'Squarified' |
    /** This visualizes the treemap as the horizontal rectangles having size proportionate to weight value. */
    'SliceAndDiceHorizontal' |
    /** This visualizes the treemap as the vertical rectangles having size proportionate to weight value. */
    'SliceAndDiceVertical' |
    /** This visualizes the treemap rectangles having size proportionate to weight value. This type automatically provides the orientation based on the size of the treemap. */
    'SliceAndDiceAuto';

/**
 * Specifies the alignment of the elements in the treemap.
 */
export type Alignment =
    /** Defines the alignment is near the treemap with respect the element position. */
    'Near' |
    /** Defines the alignment is at center of the treemap with respect the element position. */
    'Center' |
    /** Defines the alignment is far from the treemap with respect the element position. */
    'Far';
/**
 * Specifies the element which must be highlighted when mouse over is performed in treemap.
 */
export type HighLightMode =
    /** Highlights the treemap item when the mouse over is done on the treemap item. */
    'Item' |
    /** Highlights the treemap item and all its children when the mouse over is done on the treemap item. */
    'Child' |
    /** Highlights the treemap item and all its parent levels when the mouse over is done on the treemap item. */
    'Parent' |
    /** Highlights all the related nodes such as child and parent when the mouse over is done on the treemap item. */
    'All';
/**
 * Specifies the element which must be selected when click event is performed in treemap.
 */
export type SelectionMode =
    /** Selects the treemap item when the click operation is done on the treemap item. */
    'Item' |
    /** Selects the treemap item and all its children when the click operation is done on the treemap item. */
    'Child' |
    /** Selects the treemap item and all its parent levels when the click operation is done on the treemap item.. */
    'Parent' |
    /** Selects all the related nodes such as child and parent when the click operation is done on the treemap item. */
    'All';
/**
 * Specifies the export type for the treemap.
 */
export type ExportType =
    /** Specifies that the rendered treemap is to be exported in the PNG format. */
    'PNG' |
    /** Specifies that the rendered treemap is to be exported in the JPEG format. */
    'JPEG' |
    /** Specifies that the rendered treemap is to be exported in the SVG format. */
    'SVG' |
    /** Specifies that the rendered treemap is to be exported in the PDF format. */
    'PDF';
/**
 * Defines the action of the label to be placed within the defined margins.
 */
export type LabelAlignment =
    /** Specifies that the label will be trimmed if it exceeds the defined margins. */
    'Trim' |
    /** Specifies that the label will be hidden if it exceeds the defined margins. */
    'Hide' |
    /** Specifies that the label will be wrapped by word to fit within the defined margins. */
    'WrapByWord' |
    /** Specifies to wrap the data label if exceed the defined margins. */
    'Wrap';

/**
 * Defines the shape of legend item in the treemap.
 */
export type LegendShape =
    /** Defines the legend shape as circle. */
    'Circle' |
    /** Defines the legend shape as rectangle. */
    'Rectangle' |
    /** Defines the legend shape as triangle. */
    'Triangle' |
    /** Defines the legend shape as diamond. */
    'Diamond' |
    /** Defines the legend shape as cross. */
    'Cross' |
    /** Defines the legend shape as star. */
    'Star' |
    /** Defines the legend shape as horizontal line. */
    'HorizontalLine' |
    /** Defines the legend shape as vertical line. */
    'VerticalLine' |
    /** Defines the legend shape as pentagon. */
    'Pentagon' |
    /** Defines the legend shape as inverted triangle. */
    'InvertedTriangle' |
    /** Defines the legend shape as image. */
    'Image';
/**
 * Defines the position of the legend in the treemap.
 */
export type LegendPosition =
    /** Specifies to place the legend at the top of the treemap. */
    'Top' |
    /** Specifies to place the legend on the left of the treemap. */
    'Left' |
    /** Specifies to place the legend at the bottom of the treemap. */
    'Bottom' |
    /** Specifies to place the legend on the right of the treemap. */
    'Right' |
    /** Specifies to place the legend based on given custom positions. */
    'Float' |
    /** Specifies to place the legend in a automatic position based on width and height. */
    'Auto';
/**
 * Defines the modes for rendering the legend.
 */
export type LegendMode =
    /** Sets the legend as fixed, and has the option to add different shapes showcasing legend items. */
    'Default' |
    /** Set the legend as interactive, which is rectangular in shape with an indicator showcasing legend items. */
    'Interactive';
/**
 * Specifies the orientation of the legend in the treemap.
 */
export type LegendOrientation =
    /** Defines the legend renders with default behavior. */
    'None' |
    /** Defines the legend rendered with items placed horizontally. */
    'Horizontal' |
    /** Defines the legend rendered with items placed vertically. */
    'Vertical';
/**
 * Defines the action to perform when the labels intersect each other in the treemap.
 */
export type LabelIntersectAction =
    /** Specifies that no action will be taken when the label contents intersect. */
    'None' |
    /** Specifies that the data label should be trimmed when it intersects. */
    'Trim' |
    /** Specifies that the data label should be hidden when it intersects. */
    'Hide';

/**
 * Defines the placement type of the label.
 */
export type LabelPlacement =
    /** Specifies the label placement as before. */
    'Before' |
    /** Specifies the label placement as after */
    'After';

/**
 * Defines the theme supported for treemap.
 */
export type TreeMapTheme =
    /** Render a treemap with Material theme. */
    'Material' |
    /** Render a treemap with Fabric theme. */
    'Fabric' |
    /** Render a treemap with HighContrast light theme. */
    'HighContrastLight' |
    /** Render a treemap with Bootstrap theme. */
    'Bootstrap' |
    /** Render a treemap with Material dark theme. */
    'MaterialDark' |
    /** Render a treemap with Fabric dark theme. */
    'FabricDark' |
    /** Render a treemap with HighContrast dark theme. */
    'HighContrast' |
    /** Render a treemap with Bootstrap dark theme. */
    'BootstrapDark'|
    /** Render a treemap with Bootstrap4 theme. */
    'Bootstrap4'|
    /**  Render a treemap with Tailwind theme. */
    'Tailwind' |
    /**  Render a treemap with TailwindDark theme. */
    'TailwindDark' |
    /** Render a treemap with Bootstrap5 theme. */
    'Bootstrap5' |
    /**  Render a treemap with Bootstrap5 dark theme. */
    'Bootstrap5Dark' |
    /** Render a treemap with Fluent theme. */
    'Fluent' |
    /**  Render a treemap with Fluent dark theme. */
    'FluentDark' |
    /** Render a treemap with Material3 theme. */
    'Material3' |
    /** Render a treemap with Material3Dark theme. */
    'Material3Dark' |
    /** Render a treemap with Fluent2 theme. */
    'Fluent2' |
    /** Render a treemap with Fluent2 dark theme. */
    'Fluent2Dark' |
    /** Render a treemap with Fluent2 high contrast theme. */
    'Fluent2HighContrast';
/**
 * Defines the rendering directions to render the treemap items in the treemap.
 */
export type RenderingMode =
    /** Renders the treemap items from top right to bottom left direction */
    'TopRightBottomLeft' |
    /** Renders the treemap items from bottom left to top right direction */
    'BottomLeftTopRight' |
    /** Renders the treemap items from bottom right to top left direction */
    'BottomRightTopLeft' |
    /** Renders the treemap items from top left to bottom right direction */
    'TopLeftBottomRight';

/**
 * Defines the shape of the marker in the tooltip of the treemap.
 *
 * @private
 */
export type MarkerShape =
    /** Renders circle shape marker in the tooltip. */
    'Circle' |
    /** Renders rectangle shape marker in the tooltip. */
    'Rectangle' |
    /** Renders triangle shape marker in the tooltip. */
    'Triangle' |
    /** Renders diamond shape marker in the tooltip. */
    'Diamond' |
    /** Renders cross shape marker in the tooltip. */
    'Cross' |
    /** Renders horizontal line shape marker in the tooltip. */
    'HorizontalLine' |
    /** Renders vertical line shape marker in the tooltip. */
    'VerticalLine' |
    /** Renders pentagon shape marker in the tooltip. */
    'Pentagon' |
    /** Renders inverted triangle shape marker in the tooltip. */
    'InvertedTriangle' |
    /** Renders image marker in the tooltip. */
    'Image';
