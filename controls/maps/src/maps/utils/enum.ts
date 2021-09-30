/**
 * Maps enum doc
 */

/**
 * Defines the alignment for the elements in map.
 */
export type Alignment =
    /** Specifies the element to be placed near the maps. */
    'Near' |
    /** Specifies the element to be placed at the center of the maps. */
    'Center' |
    /** Specifies the element to be placed far from the maps. */
    'Far';
/**
 * Defines the theme supported for maps.
 */
export type MapsTheme =
    /** Renders a map with material theme. */
    'Material' |
    /** Renders a map with fabric theme. */
    'Fabric' |
    /** Renders a map with highcontrast light theme. */
    'HighContrastLight' |
    /** Renders a map with bootstrap theme. */
    'Bootstrap' |
    /** Renders a map with material dark theme. */
    'MaterialDark'|
    /** Renders a map with fabric dark theme. */
    'FabricDark'|
    /** Renders a map with highcontrast dark theme. */
    'HighContrast'|
    /** Renders a map with bootstrap dark theme. */
    'BootstrapDark'|
    /** Renders a map with bootstrap4 theme. */
    'Bootstrap4' |
    /** Renders a map with Tailwind theme. */
    'Tailwind' |
    /** Renders a map with TailwindDark theme. */
    'TailwindDark' |
    /** Renders a map with Bootstrap5 theme. */
    'Bootstrap5' |
    /**  Render a map with Bootstrap5 dark theme. */
    'Bootstrap5Dark';

/**
 * Defines the position of the legend.
 */
export type LegendPosition =
    /** Specifies the legend to be placed on the top of maps. */
    'Top' |
    /** Specifies the legend to be placed to the left of maps. */
    'Left' |
    /** Specifies the legend to be placed at the bottom of maps. */
    'Bottom' |
    /** Specifies the legend to be placed to the right of maps. */
    'Right' |
    /** Specifies the legend to be placed based on given x and y location. */
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
 * Defines the smart label mode for the data-label. Smart label handles the data label text when it exceeds the shape.
 */
export type SmartLabelMode =
    /** Trims the datalabel which exceed the region. */
    'Trim' |
    /** Smart label mode is not applied. */
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
 * Defines the mode of the legend.
 */
export type LegendMode =
    /** Specifies the legend as static. */
    'Default' |
    /** Specifies the legend as interactive. */
    'Interactive';

/**
 * Defines the type of the layer in the map.
 */
export type ShapeLayerType =
    /**
     * Defines the map layer as geometry shapes.
     */
    'Geometry' |
    /**
     * Defines the map layer as open street map.
     */
    'OSM' |
    /**
     * Defines the map layer as bing.
     */
    'Bing' |
    /**
     * Specifies the map layer as google static map.
     */
    'GoogleStaticMap' |
    /**
     * Specifies the map layer as google map.
     */
    'Google';
/**
 * Defines the type of the layer in maps.
 */
export type Type =
    /**
     * Specifies the layer type as main layer in the maps component.
     */
    'Layer' |
    /**
     * Specifies the layer type as sublayer in the maps component. This layer will be a part of the layer provided in the maps.
     */
    'SubLayer';

/**
 * Defines the type of markers in the maps component.
 */
export type MarkerType =
    /** Specifies to render the marker shape as circle on maps. */
    'Circle' |
    /** Specifies to render the marker shape as rectangle on maps. */
    'Rectangle' |
    /** Specifies to render the marker shape as cross on maps. */
    'Cross' |
    /** Specifies to render the marker shape as diamond on maps. */
    'Diamond' |
    /** Specifies to render the marker shape as star on maps. */
    'Star' |
    /** Specifies to render the marker shape as balloon on maps. */
    'Balloon' |
    /** Specifies to render the marker shape as triangle on maps. */
    'Triangle' |
    /** Specifies to render the marker shape as horizontal line on maps. */
    'HorizontalLine' |
    /** Specifies to render the marker shape as vertical line on maps. */
    'VerticalLine' |
    /** Specifies to render the marker shape as image on maps. */
    'Image' |
    /** Specifies to render the marker shape as inverted triangle on maps. */
    'InvertedTriangle' |
    /** Specifies to render the marker shape as pentagon on maps. */
    'Pentagon';

/**
 * Defines the projection type of the maps.
 */
export type ProjectionType =
    /** Specifies the maps to render in mercator projection type. */
    'Mercator' |
    /** Specifies the maps to render in winklel3 projection type. */
    'Winkel3' |
    /** Specifies the maps to render in miller projection type. */
    'Miller' |
    /** Specifies the maps to render in eckert3 projection type. */
    'Eckert3' |
    /** Specifies the maps to render in eckert5 projection type. */
    'Eckert5' |
    /** Specifies the maps to render in eckert6 projection type. */
    'Eckert6' |
    /** Specifies the maps to render in ait off projection type. */
    'AitOff' |
    /** Specifies the maps to render in equirectangular projection type. */
    'Equirectangular';
/**
 * Defines the types of bing map.
 */
export type BingMapType =
    /** Defines the maps to render bing map layer with aerial type. */
    'Aerial' |
    /** Defines the maps to render bing map layer with aerial with label type. */
    'AerialWithLabel' |
    /** Defines the maps to render bing map layer with road type. */
    'Road' |
    /** Defines the maps to render a dark version of the road maps. */
    'CanvasDark' |
    /** Defines the maps to render a lighter version of the road maps. */
    'CanvasLight' |
    /** Defines the maps to render a grayscale version of the road maps. */
    'CanvasGray';

/**
 * Defines the types of maps.
 */
export type StaticMapType =
    /** Specifies the maps to render google map layer with road map type. */
    'RoadMap' |
    /** Specifies the maps to render google map layer with terrain type. */
    'Terrain' |
    /** Specifies the maps to render google map layer with satellite type. */
    'Satellite' |
    /** Specifies the maps to render the google map with hybrid type. */
    'Hybrid';

/**
 * Defines the zooming tool bar orientation.
 */
export type Orientation =
    /** Specifies the zooming toolbar to be placed horizontally. */
    'Horizontal' |
    /** Specifies the zooming toolbar to be placed vertically. */
    'Vertical';

/**
 * Defines the shape of legend.
 */
export type LegendShape =
    /** Specifies the legend shape as a circle. */
    'Circle' |
    /** Specifies the legend shape as a rectangle. */
    'Rectangle' |
    /** Specifies the legend shape as a triangle. */
    'Triangle' |
    /** Specifies the legend shape as a diamond. */
    'Diamond' |
    /** Specifies the legend shape as a cross. */
    'Cross' |
    /** Specifies the legend shape as a star. */
    'Star' |
    /** Specifies the legend shape as a horizontal line. */
    'HorizontalLine' |
    /** Specifies the legend shape as a vertical line. */
    'VerticalLine' |
    /** Specifies the legend shape as a pentagon. */
    'Pentagon' |
    /** Specifies the legend shape as a inverted triangle. */
    'InvertedTriangle';
/**
 * Defines the legend arrangement in the maps component.
 */
export type LegendArrangement =
    /** Specifies the legend item to be placed by default based on legend orientation. */
    'None' |
    /** Specifies the legend items to be placed horizontally. */
    'Horizontal' |
    /** Specifies the legend items to be placed vertically. */
    'Vertical';

/**
 * Defines the alignment for the annotation.
 */
export type AnnotationAlignment =
    /** Specifies the annotation to be placed by default alignement. */
    'None' |
    /** Specifies the annotation to be placed near the maps with respect to the position of the legend. */
    'Near' |
    /** Specifies the annotation to be placed at the center of the maps with respect to the position of the legend. */
    'Center' |
    /** Specifies the annotation to be placed far from the maps with respect to the position of the legend. */
    'Far';

/**
 * Defines the geometry type.
 */
export type GeometryType =
    /** Specifies the geometry rendering in the layer of the maps. */
    'Geographic' |
    /** Specifies the maps in normal rendering. */
    'Normal';
/**
 * Defines the type of the bubble.
 */
export type BubbleType =
    /** Specifies the bubble as circle type. */
    'Circle' |
    /** Specifies the bubble as square type. */
    'Square';

/**
 * Defines the placement type of the label.
 */
export type LabelPosition =
    /** Specifies the label placement as before. */
    'Before' |
    /** Specifies the label placement as after. */
    'After';

/**
 * Defines the label intersect action in the maps component.
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
    /** Specifies the rendered maps to be exported in the png format. */
    'PNG' |
    /** Specifies the rendered maps to be exported in the jpeg format. */
    'JPEG' |
    /** Specifies the rendered maps to be exported in the svg format. */
    'SVG' |
    /** Specifies the rendered maps to be exported in the pdf format. */
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
    /** Specifies the maps to pan map by mouse move. */
    'None';
/**
 * Specifies the tooltip to be rendered on mouse operation.
 */
export type TooltipGesture =
    /** Specifies the tooltip to be shown on mouse hover event. */
    'MouseMove' |
    /** Specifies the tooltip to be shown on click event. */
    'Click' |
    /** Specifies the tooltip to be shown on double click event. */
    'DoubleClick';
