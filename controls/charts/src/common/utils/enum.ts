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
    'PDF' |
    /** Used to print the chart */
    'Print';

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

/** 
 * Defines the interval type of datetime axis. They are
 * * auto - Define the interval of the axis based on data.
 * * quarter - Define the interval of the axis based on data.
 * * years - Define the interval of the axis in years.
 * * months - Define the interval of the axis in months.
 * * weeks - Define the interval of the axis in weeks
 * * days - Define the interval of the axis in days.
 * * hours - Define the interval of the axis in hours.
 * * minutes - Define the interval of the axis in minutes.
 */
export type RangeIntervalType =
    /** Define the interval of the axis based on data. */
    'Auto' |
    /** Define the interval of the axis in years. */
    'Years' |
    /** Define the interval of the axis based on quarter */
    'Quarter' |
    /** Define the interval of the axis in months. */
    'Months' |
    /** Define the intervl of the axis in weeks */
    'Weeks' |
    /** Define the interval of the axis in days. */
    'Days' |
    /** Define the interval of the axis in hours. */
    'Hours' |
    /** Define the interval of the axis in minutes. */
    'Minutes' |
    /** Define the interval of the axis in seconds. */
    'Seconds';

/**
 * Period selector position
 * *Top
 * *Bottom
 */
export type PeriodSelectorPosition =
    /** Top position */
    'Top' |
    /** Bottom position */
    'Bottom';

/**
 * Flag type for stock events
 */
export type FlagType =
    /** Circle  */
    'Circle' |
    /** Square */
    'Square' |
    /** Flag */
    'Flag' |
    /** Pin type flags */
    'Pin' |
    /** Triangle Up */
    'Triangle' |
    /** Triangle Down */
    'InvertedTriangle' |
    /** Triangle Right */
    'TriangleRight' |
    /** Triangle Left */
    'TriangleLeft' |
    /** Arrow Up */
    'ArrowUp' |
    /** Arrow down */
    'ArrowDown' |
    /** Arrow Left */
    'ArrowLeft' |
    /** Arrow right */
    'ArrowRight' |
    /** Text type */
    'Text';

/**
 * Highlighting or selecting patterns in Chart, They are.
 * * none -Sets none as highlighting or selecting pattern.
 * * chessboard - Sets chess board as highlighting or selecting pattern.
 * * dots - Set dots as highlighting or selecting pattern.
 * * diagonalForward - Sets diagonal forward as highlighting or selecting pattern.
 * * crosshatch -Sets crosshatch as highlighting or selecting pattern.
 * * pacman - Sets pacman highlighting or selecting pattern.
 * * diagonalbackward - Set diagonal backward as highlighting or selecting pattern.
 * * grid - Set grid as highlighting or selecting pattern.
 * * turquoise - Sets turquoise as highlighting or selecting pattern.
 * * star - Sets star as highlighting or selecting pattern.
 * * triangle - Sets triangle as highlighting or selecting pattern.
 * * circle - Sets circle as highlighting or selecting pattern.
 * * tile - Sets tile as highlighting or selecting pattern.
 * * horizontaldash - Sets horizontal dash as highlighting or selecting pattern.
 * * verticaldash - Sets vertical dash as highlighting or selecting pattern.
 * * rectangle - Sets rectangle as highlighting or selecting pattern.
 * * box - Sets box as highlighting or selecting pattern.
 * * verticalstripe - Sets vertical stripe as highlighting or selecting pattern.
 * * horizontalstripe - Sets horizontal stripe as highlighting or selecting pattern.
 * * bubble - Sets bubble as highlighting or selecting pattern.
 */
export type SelectionPattern =
    /** Sets none as highlighting or selecting pattern. */
    'None' |
    /** Sets chess board as highlighting or selecting pattern. */
    'Chessboard' |
    /** Set dots as highlighting or selecting pattern. */
    'Dots' |
    /** Sets diagonal forward as highlighting or selecting pattern. */
    'DiagonalForward' |
    /** Sets cross hatch as highlighting or selecting pattern. */
    'Crosshatch' |
    /** Sets pacman as highlighting or selecting pattern. */
    'Pacman' |
    /** Set diagonal backward as highlighting or selecting pattern. */
    'DiagonalBackward' |
    /** Set grid as highlighting or selecting pattern. */
    'Grid' |
    /** Set turquoise as highlighting or selecting pattern. */
    'Turquoise' |
    /** Set star as highlighting or selecting pattern. */
    'Star' |
    /** Set triangle as highlighting or selecting pattern. */
    'Triangle' |
    /** Set circle as highlighting or selecting pattern. */
    'Circle' |
    /** Set tile as highlighting or selecting pattern. */
    'Tile' |
    /** Set horizontal dash as highlighting or selecting pattern. */
    'HorizontalDash' |
    /** Set vertical dash as highlighting or selecting pattern. */
    'VerticalDash' |
    /** Set rectangle as highlighting or selecting pattern. */
    'Rectangle' |
    /** Set box as highlighting or selecting pattern. */
    'Box' |
    /** Set vertical stripe as highlighting or selecting pattern. */
    'VerticalStripe' |
    /** Set horizontal stripe as highlighting or selecting pattern. */
    'HorizontalStripe' |
    /** Set dots as bubble or selecting pattern. */
    'Bubble';