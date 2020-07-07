/**
 * Horizontal alignment type
 */
export type TextAlign = 'left' | 'center' | 'right';
/**
 * Vertical alignment type
 */
export type VerticalAlign = 'bottom' | 'middle' | 'top';
/**
 * Font weight type
 */
export type FontWeight = 'bold' | 'normal';
/**
 * Font style type
 */
export type FontStyle = 'italic' | 'normal';
/**
 * Text decoration type
 * @hidden
 */
export type TextDecoration = 'underline' | 'line-through' | 'underline line-through' | 'none';
/**
 * Font family type
 */
export type FontFamily = 'Arial' | 'Arial Black' | 'Axettac Demo' | 'Batang' | 'Book Antiqua' | 'Calibri' | 'Courier' | 'Courier New' |
    'Din Condensed' | 'Georgia' | 'Helvetica' | 'Helvetica New' | 'Roboto' | 'Tahoma' | 'Times New Roman' | 'Verdana';
/**
 * Specifies the number format types in Spreadsheet.
 */
export type NumberFormatType = 'General' | 'Number' | 'Currency' | 'Accounting' | 'ShortDate' | 'LongDate' | 'Time' | 'Percentage' |
    'Fraction' | 'Scientific' | 'Text';
/**
 * Specifies the option for save file type from Spreadsheet. By default, Excel save will be occur.
 */
export type SaveType = 'Xlsx' | 'Xls' | 'Csv';
/** 
 * Defines the order of Sorting. They are
 * * Ascending
 * * Descending 
 */
export type SortOrder =
    /**  Defines SortDirection as Ascending */
    'Ascending' |
    /**  Defines SortDirection as Descending */
    'Descending';
/**
 * Cell format type
 */
export type FormatType = 'CellFormat' | 'NumberFormat';
/**
 * Border type
 */
export type BorderType = 'Vertical' | 'Horizontal' | 'Outer' | 'Inner';

/**
 * Sheet visibility state
 */
export type SheetState =
    /** Defines the state of sheet as visible. */
    'Visible' |
    /** Defines the state of sheet as hidden. It can be unhidden later. */
    'Hidden' |
    /** Defines the state of sheet as hidden. Once set, it cannot be unhidden. */
    'VeryHidden';

/**
 * Workbook model type
 */
export type ModelType = 'Sheet' | 'Row' | 'Column';

/**
 * validation type
 */
export type ValidationType = 'WholeNumber' | 'Decimal' | 'Date' | 'TextLength' | 'List' | 'Time';

/**
 * validation operator
 */
export type ValidationOperator = 'Between' | 'NotBetween' | 'EqualTo' | 'NotEqualTo' | 'LessThan' |
'GreaterThan' | 'GreaterThanOrEqualTo' | 'LessThanOrEqualTo';

/**
 * Merge type
 */
export type MergeType =
    /** Merge all the cells between provided range. */
    'All' |
    /** Merge the cells row-wise. */
    'Horizontally' |
    /** Merge the cells column-wise. */
    'Vertically';

/**
 * Conditional formatting HighlightCell Type
 * @hidden
 */
export type HighlightCell = 'GreaterThan' | 'LessThan' | 'Between' | 'EqualTo' | 'ContainsText' | 'DateOccur' | 'Duplicate' | 'Unique';

/**
 * Conditional formatting TopBottom Type
 * @hidden
 */
export type TopBottom = 'Top10Items' | 'Bottom10Items' | 'Top10Percentage' | 'Bottom10Percentage' | 'BelowAverage' | 'AboveAverage';

/**
 * Conditional formatting DataBar Type
 * @hidden
 */
export type DataBar = 'BlueDataBar' | 'GreenDataBar' | 'RedDataBar' | 'OrangeDataBar' | 'LightBlueDataBar' | 'PurpleDataBar';

/**
 * Conditional formatting ColorScale Type
 * @hidden
 */
export type ColorScale = 'GYRColorScale' | 'RYGColorScale' | 'GWRColorScale' | 'RWGColorScale' | 'BWRColorScale' | 'RWBColorScale' |
    'WRColorScale' | 'RWColorScale' | 'GWColorScale' | 'WGColorScale' | 'GYColorScale' | 'YGColorScale';

/**
 * Conditional formatting IconSet Type
 * @hidden
 */
export type IconSet = 'ThreeArrows' | 'ThreeArrowsGray' | 'FourArrowsGray' | 'FourArrows' | 'FiveArrowsGray' |
    'FiveArrows' | 'ThreeTrafficLights1' | 'ThreeTrafficLights2' | 'ThreeSigns' | 'FourTrafficLights' |
    'FourRedToBlack' | 'ThreeSymbols' | 'ThreeSymbols2' | 'ThreeFlags' | 'FourRating' | 'FiveQuarters' |
    'FiveRating' | 'ThreeTriangles' | 'ThreeStars' | 'FiveBoxes';

export type CFColor = 'RedFT' | 'YellowFT' | 'GreenFT' | 'RedF' | 'RedT';

/** 
 * Clear type
 */
export type ClearType =
    /** Clear the content, formats and hyperlinks applied in the provided range. */
    'Clear All' |
    /** Clear the formats applied in the provided range. */
    'Clear Formats' |
    /** Clear the content in the provided range. */
    'Clear Contents' |
    /** Clear the hyperlinks applied in the provided range. */
    'Clear Hyperlinks';
