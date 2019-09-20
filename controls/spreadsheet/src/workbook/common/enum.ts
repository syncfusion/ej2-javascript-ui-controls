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

 export enum NumberFormatType {
    General = 'General',
    Number = 'Number',
    Currency = 'Currency',
    Accounting = 'Accounting',
    ShortDate = 'ShortDate',
    LongDate = 'LongDate',
    Time = 'Time',
    Percentage = 'Percentage',
    Fraction = 'Fraction',
    Scientific = 'Scientific',
    Text = 'Text'
 }

/**
 * Specifies the option for save file type from Spreadsheet. By default, Excel save will be occur.
 */
export type SaveType = 'Xlsx' | 'Xls' | 'Csv';
