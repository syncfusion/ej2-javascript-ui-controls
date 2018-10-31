/**
 * Defines Coordinate units of an annotation. They are
 * * Pixel
 * * Point
 */
export type Units =
    /**  Specifies the pixel value */
    'Pixel' |
    /**  Specifies the axis value. */
    'Point';

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

/** @private */
export type SeriesCategories =
    /** Defines the trenline */
    'TrendLine' |
    /** Defines the indicator */
    'Indicator' |
    /** Defines the normal series */
    'Series' |
    /** Defines the Pareto series */
    'Pareto';

/**
 * Defines regions of an annotation. They are
 * * Chart
 * * Series
 */
export type Regions =
    /**  Specifies the chart coordinates */
    'Chart' |
    /**  Specifies the series coordinates */
    'Series';

/**
 * Defines the Position. They are
 * * top - Align the element to the top.
 * * middle - Align the element to the center.
 * * bottom - Align the element to the bottom.
 * *
 */

export type Position =
    /** Define the top position. */
    'Top' |
    /** Define the middle position. */
    'Middle' |
    /** Define the bottom position. */
    'Bottom';

/**
 * Defines the export file format.
 * * PNG - export the image file format as png.
 * * JPEG - export the image file format as jpeg.
 */
export type ExportType =
    /** Used to export a image as png format */
    'PNG' |
    /** Used to export a image as jpeg format */
    'JPEG' |
    /** Used to export a file as svg format */
    'SVG' |
    /** Used to export a file as pdf format */
    'PDF';

/**
 * Defines the Text overflow.
 * * None - Shown the chart title with overlap if exceed.
 * * Wrap - Shown the chart title with wrap if exceed.
 * * Trim - Shown the chart title with trim if exceed.
 */
export type TextOverflow =
    /** Used to show the chart title with overlap to other element */
    'None' |
    /** Used to show the chart title with Wrap support */
    'Wrap' |
    /** Used to show the chart title with Trim */
    'Trim';
