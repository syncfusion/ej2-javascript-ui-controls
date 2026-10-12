/**
 * Defines modes of Selection.
 */
export type SelectionMode = 'None' | 'Single' | 'Multiple';

/**
 * Defines paste options.
 */
export type PasteSpecialType = 'All' | 'Values' | 'Formats' | 'Formulas';

/** @hidden */
export type RefreshType = 'All' | 'Row' | 'Column' | 'RowPart' | 'ColumnPart';

/**
 * Defines find mode options.
 */
export type FindModeType = 'Sheet' | 'Workbook';

/**
 * Defines the print modes.
 */
export type PrintType = 'ActiveSheet' | 'Workbook';

/**
 * Defines the AI assist actions.
 */
export type AssistAction = 'analysis' | 'query' | 'reportGeneration' | 'edit' | 'findAndReplace' | 'numberFormat' | 'cellFormat' | 'conditionalFormat' | 'merge'
| 'wrap' | 'cut' | 'copy' | 'paste' | 'chart' | 'dataValidation' | 'filter' | 'sort' | 'insert' | 'delete' | 'autofill' | 'freezePanes' | 'hyperlink' | 'save' | 'unknown';


