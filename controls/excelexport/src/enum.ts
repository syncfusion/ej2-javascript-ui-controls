/**
 * LineStyle
 */
export type LineStyle = 'thin' | 'thick' | 'medium' | 'none';
/**
 * HAlignType
 */
export type HAlignType = 'center ' | 'justify' | 'left' | 'right' | 'general';
/**
 * VAlignType
 */
export type VAlignType = 'bottom' | 'center' | 'top';
/**
 * HyperLinkType
 */
export type HyperLinkType = 'none' | 'url' | 'file' | 'unc' | 'workbook';
/**
 * SaveType
 */
export type SaveType = 'xlsx' | 'csv';
/**
 * CellType
 * @private
 */
export type CellType =
  /**
   * Cell containing a boolean.
   */
  'b' |
  /**
   * Cell containing an error.
   */
  'e' |
  /**
   * Cell containing an (inline) rich string.
   */
  'inlineStr' |
  /**
   * Cell containing a number.
   */
  'n' |
  /**
   * Cell containing a shared string.
   */
  's' |
  /**
   * Cell containing a formula string.
   */
  'str'|
  /**
   * Cell containing a formula.
   */
  'f'
  ;
/**
 * BlobSaveType
 */
export type BlobSaveType =
  /**
   * MIME Type for .csv file
   */
  'text/csv' |
  /**
   * MIME Type for .xlsx file
   */
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
