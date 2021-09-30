
/**
 * Defines the position of the label in treemap leaf node.
 */
export type LabelPosition =
    /** To show the position of the label based on the top and left of the treemap leaf nodes.  */
    'TopLeft' |
    /** To show the position of the label based on the top and center of the treemap leaf nodes. */
    'TopCenter' |
    /** To show the position of the label based on the top and right of the treemap leaf nodes. */
    'TopRight' |
    /** To show the position of the label based on the center and left of the treemap leaf nodes. */
    'CenterLeft' |
    /** To show the position of the label based on the center of the treemap leaf nodes. */
    'Center' |
    /** To show the position of the label based on the center and right of the treemap leaf nodes. */
    'CenterRight' |
    /** To show the position of the label based on the bottom and left of the treemap leaf nodes. */
    'BottomLeft' |
    /** To show the position of the label based on the bottom and center of the treemap leaf nodes. */
    'BottomCenter' |
    /** To show the position of the label based on the bottom and right of the treemap leaf nodes. */
    'BottomRight';

/**
 * Specifies the layout rendering mode of the treemap.
 */
export type LayoutMode =
    /** This visualizes the treemap as the nested rectangles having size proportionate to weight value */
    'Squarified' |
    /** This visualizes the treemap as the horizontal rectangles having size proportionate to weight value */
    'SliceAndDiceHorizontal' |
    /** This visualizes the treemap as the vertical rectangles having size proportionate to weight value */
    'SliceAndDiceVertical' |
    /** This visualizes the treemap as the auto rectangles having size proportionate to weight value */
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
    /** Highlights the treemap item and level when the mouse over is done on the treemap item. */
    'Child' |
    /** Highlights the treemap item and parent level when the mouse over is done on the treemap item. */
    'Parent' |
    /** Highlights all the related nodes when the mouse over is done on the treemap item. */
    'All';
/**
 * Specifies the element which must be selected when click event is performed in treemap.
 */
export type SelectionMode =
    /** Selects the treemap item when the click operation is done on the treemap item. */
    'Item' |
    /** Selects the treemap item and level when the click operation is done on the treemap item. */
    'Child' |
    /** Selects the treemap item and parent level when the click operation is done on the treemap item.. */
    'Parent' |
    /** Selects all the related nodes when the click operation is done on the treemap item. */
    'All';
/**
 * Specifies the export type for the treemap
 */
export type ExportType =
    /** Specifies the rendered treemap to be exported in the png format. */
    'PNG' |
    /** Specifies the rendered treemap to be exported in the jpeg format. */
    'JPEG' |
    /** Specifies the rendered treemap to be exported in the svg format. */
    'SVG' |
    /** Specifies the rendered treemap to be exported in the pdf format. */
    'PDF';
/**
 * Defines the text to be placed within the defined margins.
 */
export type LabelAlignment =
    /** Specifies that the data label will trim if exceeded the defined margins. */
    'Trim' |
    /** Specifies that the data label will hide if exceeded the defined margins. */
    'Hide' |
    /** Specifies the word to force all text to fit within the defined margins. */
    'WrapByWord' |
    /** Specifies to wrap the data label if exceed the defined margins. */
    'Wrap';

/**
 * Defines the shape of legend in the treemap component.
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
 * Defines the position of the legend in the treemap component.
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
    /** Specifies to place the legend based on given x and y positions. */
    'Float' |
    /** Specifies to place the legend based on width and height. */
    'Auto';
/**
 * Defines the legend rendering modes. The modes are default and interactive modes.
 */
export type LegendMode =
    /** Specifies the legend as static. */
    'Default' |
    /** Specifies the legend as interactive. */
    'Interactive';
/**
 * Specifies the orientation of the legend in the treemap.
 */
export type LegendOrientation =
    /** Defines the legend renders with default behavior. */
    'None' |
    /** Defines the legend renders with items places horizontally. */
    'Horizontal' |
    /** Defines the legend renders with items places vertically. */
    'Vertical';
/**
 * Defines the label intersect action in treemap component.
 */
export type LabelIntersectAction =
    /** Specifies that no action will be taken when the label contents intersect. */
    'None' |
    /** Specifies the data label to be trimmed when it intersects. */
    'Trim' |
    /** Specifies the data label to be hidden when it intersects. */
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
    /** Render a treemap with material theme. */
    'Material' |
    /** Render a treemap with fabric theme. */
    'Fabric' |
    /** Render a treemap with highcontrast light theme. */
    'HighContrastLight' |
    /** Render a treemap with bootstrap theme. */
    'Bootstrap' |
    /** Render a treemap with material dark theme. */
    'MaterialDark' |
    /** Render a treemap with fabric dark theme. */
    'FabricDark' |
    /** Render a treemap with highcontrast dark theme. */
    'HighContrast' |
    /** Render a treemap with bootstrap dark theme. */
    'BootstrapDark'|
    /** Render a treemap with bootstrap4 theme. */
    'Bootstrap4'|
	/**  Render a treemap with Tailwind theme. */
    'Tailwind' |
    /**  Render a treemap with TailwindDark theme. */
    'TailwindDark' |
    /** Render a treemap with Bootstrap5 theme. */
    'Bootstrap5' |
    /**  Render a treemap with Bootstrap5 dark theme. */
    'Bootstrap5Dark';
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
