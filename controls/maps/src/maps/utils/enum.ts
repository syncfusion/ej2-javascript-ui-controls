/**
 * Maps enum doc
 */

/**
 * Defines the alignment for the elements in the maps.
 */
export type Alignment =
    /** Specifies the element to be placed near end of the maps. */
    'Near' |
    /** Specifies the element to be placed at the center of the maps. */
    'Center' |
    /** Specifies the element to be placed far end of the maps. */
    'Far';
/**
 * Defines the theme supported for maps.
 */
export type MapsTheme =
    /** Renders a map with Material theme. */
    'Material' |
    /** Renders a map with Fabric theme. */
    'Fabric' |
    /** Renders a map with HighContrast light theme. */
    'HighContrastLight' |
    /** Renders a map with Bootstrap theme. */
    'Bootstrap' |
    /** Renders a map with Material dark theme. */
    'MaterialDark'|
    /** Renders a map with Fabric dark theme. */
    'FabricDark'|
    /** Renders a map with HighContrast theme. */
    'HighContrast'|
    /** Renders a map with Bootstrap dark theme. */
    'BootstrapDark'|
    /** Renders a map with Bootstrap4 theme. */
    'Bootstrap4' |
    /** Renders a map with Tailwind theme. */
    'Tailwind' |
    /** Renders a map with TailwindDark theme. */
    'TailwindDark' |
    /** Renders a map with Bootstrap5 theme. */
    'Bootstrap5' |
    /**  Render a map with Bootstrap5 dark theme. */
    'Bootstrap5Dark' |
    /** Renders a map with Fluent theme. */
    'Fluent' |
    /**  Render a map with Fluent dark theme. */
    'FluentDark' |
    /** Renders a map with material3 theme. */
    'Material3' |
    /** Renders a map with material3dark theme. */
    'Material3Dark' |
    /** Renders a map with fluent2 theme. */
    'Fluent2' |
    /** Renders a map with fluent2 dark theme. */
    'Fluent2Dark' |
    /** Renders a map with fluent2 high contrast theme. */
    'Fluent2HighContrast';

/**
 * Defines the position of the legend.
 */
export type LegendPosition =
    /** Specifies the legend to be placed on the top of the maps. */
    'Top' |
    /** Specifies the legend to be placed to the left of the maps. */
    'Left' |
    /** Specifies the legend to be placed at the bottom of the maps. */
    'Bottom' |
    /** Specifies the legend to be placed to the right of the maps. */
    'Right' |
    /** Specifies the legend to be placed in a custom location. */
    'Float';

/**
 * Defines the type of the element in the map for which legend is to be rendered.
 */
export type LegendType =
    /** Renders the legend based on layers. */
    'Layers' |
    /** Renders the legend based on bubbles. */
    'Bubbles' |
    /** Renders the legend based on markers. */
    'Markers';

/**
 * Defines the smart label mode for the data-label. Smart label handles the data label text when it exceeds the shape over which it is rendered.
 */
export type SmartLabelMode =
    /** Trims the datalabel which exceed the region. */
    'Trim' |
    /** No action is taken when the data label exceeds its designated region. */
    'None' |
    /** Hides the datalabel which exceeds the region. */
    'Hide';
/**
 * Defines the arrow position in navigation line.
 */
export type ArrowPosition =
    /** Defines the arrow to be positioned at the start of the navigation line. */
    'Start' |
    /** Defines the arrow to be positioned at the end of the navigation line. */
    'End';
/**
 * Defines the label intersect action. Label interaction action handles the data label text
 * when it intersects with other data label contents.
 */
export type IntersectAction =
    /** Specifies the data label to be trimmed when it intersects. */
    'Trim' |
    /** Specifies that no action will be taken when it intersects. */
    'None' |
    /** Specifies the data label to be hidden when it intersects. */
    'Hide';
/**
 * Defines the modes for rendering the legend.
 */
export type LegendMode =
    /** Sets the legend as fixed, and has the option to add different shapes showcasing legend items. */
    'Default' |
    /** Set the legend as interactive, which is rectangular in shape with an indicator showcasing legend items. */
    'Interactive';
/**
 * Defines the type of the layer in maps.
 */
export type Type =
    /**
     * Specifies the provided layer as main layer in the maps.
     */
    'Layer' |
    /**
     * Specifies the provided layer as sublayer in the maps. This layer will be a part of the main layer provided in the maps.
     */
    'SubLayer';

/**
 * Defines the type of markers in the maps.
 */
export type MarkerType =
    /** Specifies that the marker shape should be rendered as a circle on maps. */
    'Circle' |
    /** Specifies that the marker shape should be rendered as a rectangle on maps. */
    'Rectangle' |
    /** Specifies that the marker shape should be rendered as a cross on maps. */
    'Cross' |
    /** Specifies that the marker shape should be rendered as a diamond on maps. */
    'Diamond' |
    /** Specifies that the marker shape should be rendered as a star on maps. */
    'Star' |
    /** Specifies that the marker shape should be rendered as a balloon on maps. */
    'Balloon' |
    /** Specifies that the marker shape should be rendered as a triangle on maps. */
    'Triangle' |
    /** Specifies that the marker shape should be rendered as a horizontal line on maps. */
    'HorizontalLine' |
    /** Specifies that the marker shape should be rendered as a vertical line on maps. */
    'VerticalLine' |
    /** Specifies that the marker shape should be rendered as an image on maps. */
    'Image' |
    /** Specifies that the marker shape should be rendered as an inverted triangle on maps. */
    'InvertedTriangle' |
    /** Specifies that the marker shape should be rendered as a pentagon on maps. */
    'Pentagon';

/**
 * Defines the projection type of the maps.
 */
export type ProjectionType =
    /** Specifies the maps to be rendered in Mercator projection type. */
    'Mercator' |
    /** Specifies the maps to be rendered in Winklel tripel projection type. */
    'Winkel3' |
    /** Specifies the maps to be rendered in Miller projection type. */
    'Miller' |
    /** Specifies the maps to be rendered in Eckert III projection type. */
    'Eckert3' |
    /** Specifies the maps to be rendered in Eckert V projection type. */
    'Eckert5' |
    /** Specifies the maps to be rendered in Eckert VI projection type. */
    'Eckert6' |
    /** Specifies the maps to be rendered in Aitoff projection type. */
    'AitOff' |
    /** Specifies the maps to be rendered in Equirectangular projection type. */
    'Equirectangular';

/**
 * Defines the zooming tool bar orientation.
 */
export type Orientation =
    /** Specifies the zooming toolbar to be placed horizontally. */
    'Horizontal' |
    /** Specifies the zooming toolbar to be placed vertically. */
    'Vertical';

/**
 * Defines the shape of the legend.
 */
export type LegendShape =
    /** Specifies to render the legend shape as a circle. */
    'Circle' |
    /** Specifies to render the legend shape as a rectangle. */
    'Rectangle' |
    /** Specifies to render the legend shape as a triangle. */
    'Triangle' |
    /** Specifies to render the legend shape as a diamond. */
    'Diamond' |
    /** Specifies to render the legend shape as a cross. */
    'Cross' |
    /** Specifies to render the legend shape as a star. */
    'Star' |
    /** Specifies to render the legend shape as a horizontal line. */
    'HorizontalLine' |
    /** Specifies to render the legend shape as a vertical line. */
    'VerticalLine' |
    /** Specifies to render the legend shape as a pentagon. */
    'Pentagon' |
    /** Specifies to render the legend shape as a inverted triangle. */
    'InvertedTriangle'|
    /** Specifies to render the legend shape as balloon on maps. */
    'Balloon';
/**
 * Defines the legend arrangement in the maps.
 */
export type LegendArrangement =
    /** Specifies the legend items to be placed on a default placement based on legend orientation. */
    'None' |
    /** Specifies the legend items to be placed horizontally. */
    'Horizontal' |
    /** Specifies the legend items to be placed vertically. */
    'Vertical';

/**
 * Defines the alignment for the annotation.
 */
export type AnnotationAlignment =
    /** Specifies the annotation to be placed on a default alignment. */
    'None' |
    /** Specifies the annotation to be placed near the maps with respect to the position of the legend. */
    'Near' |
    /** Specifies the annotation to be placed at the center of the maps with respect to the position of the legend. */
    'Center' |
    /** Specifies the annotation to be placed far end of the maps with respect to the position of the legend. */
    'Far';

/**
 * Defines the geometry type.
 */
export type GeometryType =
    /** Specifies to render the shape maps in geographic coordinate system. */
    'Geographic' |
    /** Specifies to render the shape maps in default coordinate system. */
    'Normal';
/**
 * Defines the type of the bubble to rendered in the maps.
 */
export type BubbleType =
    /** Specifies to render the bubble in circle shape. */
    'Circle' |
    /** Specifies to render the bubble in square shape. */
    'Square';

/**
 * Defines the placement type of the labels in the legend.
 */
export type LabelPosition =
    /** Specifies to place the label before the legend shape. */
    'Before' |
    /** Specifies to place the label after the legend shape. */
    'After';

/**
 * Defines the action to be performed when the label intersects with other labels in the maps.
 */
export type LabelIntersectAction =
    /**
     * Specifies that no action will be taken when the label contents intersect.
     */
    'None' |
    /**
     * Specifies the data label to be trimmed when it intersects.
     */
    'Trim' |
    /**
     * Specifies the data label to be hidden when it intersects.
     */
    'Hide';

/**
 * Specifies the export type for the maps.
 */
export type ExportType =
    /** Specifies the rendered maps to be exported in the PNG format. */
    'PNG' |
    /** Specifies the rendered maps to be exported in the JPEG format. */
    'JPEG' |
    /** Specifies the rendered maps to be exported in the SVG format. */
    'SVG' |
    /** Specifies the rendered maps to be exported in the PDF format. */
    'PDF';

/**
 * Specifies the direction of panning.
 */
export type PanDirection =
    /** Specifies the maps to pan in the left direction. */
    'Left' |
    /** Specifies the maps to pan in the right direction. */
    'Right' |
    /** Specifies the maps to pan in the top direction. */
    'Top' |
    /** Specifies the maps to pan in the bottom direction. */
    'Bottom' |
    /** Specifies the maps to pan as per the mouse move location. */
    'None';
/**
 * Specifies the gesture on the maps in which tooltip must be rendered.
 */
export type TooltipGesture =
    /** Specifies the tooltip to be shown on mouse hover event. */
    'MouseMove' |
    /** Specifies the tooltip to be shown on click event. */
    'Click' |
    /** Specifies the tooltip to be shown on double click event. */
    'DoubleClick';

/**
 * Specifies the type of the buttons in the zoom toolbar.
 */
export type ToolbarItem =
    /** Specifies whether the zoom-in button must be rendered in the zoom toolbar or not. */
    'ZoomIn' |
    /** Specifies whether the zoom-out button must be rendered in the zoom toolbar or not. */
    'ZoomOut' |
    /** Specifies whether the zoom button must be rendered in the zoom toolbar or not. */
    'Zoom' |
    /** Specifies whether the pan button must be rendered in the zoom toolbar or not. */
    'Pan' |
    /** Specifies whether the reset zoom button must be rendered in the zoom toolbar or not. */
    'Reset';
