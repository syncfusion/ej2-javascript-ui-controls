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
