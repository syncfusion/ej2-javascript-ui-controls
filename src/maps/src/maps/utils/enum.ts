/**
 * Maps enum doc
 */

/** 
 * Defines the Alignment. They are
 * * near - Align the element to the left.
 * * center - Align the element to the center.
 * * far - Align the element to the right.
 * * 
 */
export type Alignment =
    /** Define the left alignment. */
    'Near' |
    /** Define the center alignment. */
    'Center' |
    /** Define the right alignment. */
    'Far';
/** 
 * Defines Theme of the maps. They are
 * * Material - Render a maps with Material theme.
 * * Fabric - Render a maps with Fabric theme
 * * Bootstrap - Render a maps with Bootstrap theme
 */
export type MapsTheme =
    /**  Render a maps with Material theme. */
    'Material' |
    /**  Render a maps with Fabric theme. */
    'Fabric' |
    /**  Render a maps with Highcontrast theme. */
    'Highcontrast' |
    /**  Render a maps with Bootstrap theme. */
    'Bootstrap';


/** 
 * Defines the position of the legend. They are
 * * top - Displays the legend on the top of maps.
 * * left - Displays the legend on the left of maps.
 * * bottom - Displays the legend on the bottom of maps.
 * * right - Displays the legend on the right of maps.
 * * float - Displays the legend  based on given x and y value.
 */
export type LegendPosition =
    /** Places the legend on the top of maps. */
    'Top' |
    /** Places the legend on the left of maps. */
    'Left' |
    /** Places the legend on the bottom of maps. */
    'Bottom' |
    /** Places the legend on the right of maps. */
    'Right' |
    /** Places the legend based on given x and y. */
    'Float';

/** 
 * Defines the Legend types. They are
 * * Layers - Legend applicable to Layers.
 * * Bubbles - Legend applicable to Bubbles.
 * * Markers - Legend applicable to Markers.
 */
export type LegendType =
    /** Legend applicable to Layers */
    'Layers' |
    /** Legend applicable to Bubbles. */
    'Bubbles' |
    /** Legend applicable to Markers */
    'Markers';

/**
 * Defines the smart label mode. They are
 * * Trim - Trims the datalabel which exceed the region
 * * None - Smart label mode is not applied
 * * hide - Hide the datalabel which exceeds the region
 */
export type SmartLabelMode =
    /** Trims the datalabel which exceed the region */
    'Trim' |
    /** Smart label mode is not applied */
    'None' |
    /** Hides the datalabel which exceeds the region */
    'Hide';
/**
 * Defines the arrow position in navigation line. They are
 * * Start - Arrow is positioned at the starting position of navigation line
 * * End - Arrow is positioned at the ending position of navigation line
 */
export type ArrowPosition =
    /** Arrow positioned at the start */
    'Start' |
    /** Arrow positioned at the end */
    'End';
/**
 * Defines the label intersect action. They are
 * * Trim - Trims the intersected datalabel
 * * None - Intersection action is not applied
 * * Hide - Hides the intersected datalabel
 */
export type IntersectAction =
    /** Trims the intersected datalabel */
    'Trim' |
    /** Intersection action is not applied */
    'None' |
    /** Hide the intersected datalabel */
    'Hide';
/** 
 * Defines the Legend modes. They are
 * * Default - Specifies the Default mode.
 * * interactive - specifies the Interactive mode.
 */
export type LegendMode =
    /** Legend remains static */
    'Default' |
    /** Legend remains interactively */
    'Interactive';

/**
 * Defines the Layer types.
 * * Geometry - Specifies the geometry type.
 * * Bing - Specifies the Bing type.
 */
export type ShapeLayerType =
    /**
     * Draw the geometry shape
     */
    'Geometry' |
    /**
     * Draw the open street map
     */
    'OSM' |
    /**
     * Draw the bing map
     */
    'Bing';
/**
 * Defines the map layer types.
 * * Layer - Specifies the layer type.
 * * SubLayer - Specifies the sublayer type.
 */
export type Type =
    /** Layer - Used to render layer on maps */
    'Layer' |
    /** SubLayer - Used to render sublayer on maps */
    'SubLayer';

/**
 * Defines the marker types.
 * * Circle - Specifies the Circle type.
 * * Rectangle - Specifies the Rectangle type.
 * * Cross - Specifies the Cross type.
 * * Diamond - Specifies the Diamond type.
 * * Star - Specifies the Star type.
 * * Balloon - Specifies the Balloon type.
 * * Triangle - Specifies the Triangle type.
 * * HorizontalLine - Specifies the HorizontalLine type.
 * * VerticalLine - Specifies the VerticalLine type.
 */
export type MarkerType =
    /** Circle - Used to render marker shape as Circle on maps */
    'Circle' |
    /** Rectangle - Used to render marker shape as Rectangle on maps */
    'Rectangle' |
    /** Cross - Used to render marker shape as Cross on maps */
    'Cross' |
    /** Diamond - Used to render marker shape as Diamond on maps */
    'Diamond' |
    /** Star - Used to render marker shape as Star on maps */
    'Star' |
    /** Balloon - Used to render marker shape as Balloon on maps */
    'Balloon' |
    /** Triangle - Used to render marker shape as Triangle on maps */
    'Triangle' |
    /** HorizontalLine - Used to render marker shape as HorizontalLine on maps */
    'HorizontalLine' |
    /** VerticalLine - Used to render marker shape as VerticalLine on maps */
    'VerticalLine' |
    /** Image - Used to render marker shape as Image on maps  */
    'Image';

/**
 * Defines the projection type of the maps.
 * * Mercator -Specifies the Mercator projection type.
 */
export type ProjectionType =
    /** Mercator - Used to render maps based on the Mercator type */
    'Mercator' |
    /** Winkel 3 is one of the projection for map rendering */
    'Winkel3' |
    /** Miller is one of the projection for map rendering */
    'Miller' |
    /** Eckert3 is one of the projection for map rendering */
    'Eckert3' |
    /** Eckert5 is one of the projection for map rendering */
    'Eckert5' |
    /** Eckert6 is one of the projection for map rendering */
    'Eckert6' |
    /** Aitoff is one of the projection for map rendering */
    'AitOff' |
    /** Equirectangular is one of the projection for map rendering */
    'Equirectangular';
/**
 * Defines bing map types
 * * Aerial - specifies the Aerial type
 * * AerialWithLabel - specifies the AerialWithLabel type
 * * Road - specifies the Road type
 */
export type BingMapType =
    /** Aerial - Used to draw bing map layer with Aerial type */
    'Aerial' |
    /** AerialWithLabel - Used to draw bing map layer with AerialWithLabel type */
    'AerialWithLabel' |
    /** Road - Used to draw bing map layer with Road type */
    'Road' |
    /** CanvasDark - A dark version of the road maps */
    'CanvasDark' |
    /** CanvasLight - A lighter version of the road maps */
    'CanvasLight' |
    /** CanvasGray - A grayscale version of the road maps */
    'CanvasGray' ;

/**
 * Defines the tool bar orientation
 */
export type Orientation =
    /** Horizontal - Toolbar drawing horizontal orientation */
    'Horizontal' |
    /** Vertical - Toolbar drawing vertical orientation */
    'Vertical';

/** 
 * Defines the shape of legend. They are
 * * circle - Renders a circle.
 * * rectangle - Renders a rectangle.
 * * triangle - Renders a triangle.
 * * diamond - Renders a diamond.
 * * cross - Renders a cross.
 * * Star - Renders a star.
 * * horizontalLine - Renders a horizontalLine.
 * * verticalLine - Renders a verticalLine.
 * * pentagon - Renders a pentagon.
 * * invertedTriangle - Renders a invertedTriangle.
 */
export type LegendShape =
    /** Render a circle. */
    'Circle' |
    /** Render a Rectangle. */
    'Rectangle' |
    /** Render a Triangle. */
    'Triangle' |
    /** Render a Diamond. */
    'Diamond' |
    /** Render a Cross. */
    'Cross' |
    /** Render a Star. */
    'Star' |
    /** Render a HorizontalLine. */
    'HorizontalLine' |
    /** Render a VerticalLine. */
    'VerticalLine' |
    /** Render a Pentagon. */
    'Pentagon' |
    /** Render a InvertedTriangle. */
    'InvertedTriangle';
/**
 * Defines the legend arrangement
 */
export type LegendArrangement =
    /** Legend item placed default based on legend orientation */
    'None' |
    /** Legend items placed in row wise */
    'Horizontal' |
    /** Legend items place in column wise */
    'Vertical';

/** 
 * Defines the Alignment. They are
 * * none - Default alignment as none
 * * near - Align the element to the left.
 * * center - Align the element to the center.
 * * far - Align the element to the right.
 * * 
 */
export type AnnotationAlignment =
    /** Default alignement as none */
    'None' |
    /** Define the left alignment. */
    'Near' |
    /** Define the center alignment. */
    'Center' |
    /** Define the right alignment. */
    'Far';

/** 
 * Defines the geometry type. They are
 * * Geographic - Default value of geometry layer. 
 * * Normal - Normal rendering of geometry layer.
 * *
 */
export type GeometryType =
    /** Default value of geometry layer. */
    'Geographic' |
    /** Define the normal rendering . */
    'Normal';
/**
 * Defines the bubble type
 */
export type BubbleType =
    /** Specifies the bubble circle type */
    'Circle' |
    /** Specifies the bubble Square type */
    'Square';

/**
 * Defines the label placement type
 */
export type LabelPosition =
    /** Specifies the label placement as Before */
    'Before' |
    /** Specifies the label plcement as After */
    'After';

/**
 * Defines the label intersect action types
 */
export type LabelIntersectAction =
    /** Specifies the intersect action as None */
    'None' |
    /** Specifies the intersect action as Trim  */
    'Trim' |
    /**  Specifies the intersect action as Hide */
    'Hide';
/**
 * Export Type
 */
export type ExportType =
/** Used to export a image as png format */
'PNG' |
/** Used to export a image as jpeg format */
'JPEG' |
/** Used to export a file as svg format */
'SVG'|
/** Used to export a file as pdf format */
'PDF';
