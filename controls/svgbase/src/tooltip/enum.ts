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
 * * image - Renders a image.
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
/** Render a Cross. */
'Cross' |
/** Render a HorizontalLine. */
'HorizontalLine' |
/** Render a VerticalLine. */
'VerticalLine' |
/** Render a Pentagon. */
'Pentagon' |
/** Render a InvertedTriangle. */
'InvertedTriangle' |
/** Render a Image. */
'Image';

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
'MaterialDark'|
/**  Render a chart with Fabric Dark theme. */
'FabricDark'|
/**  Render a chart with Highcontrast Dark theme. */
'Highcontrast'|
/**  Render a chart with Highcontrast Dark theme. */
'HighContrast'|
/**  Render a chart with Bootstrap Dark theme. */
'BootstrapDark';
