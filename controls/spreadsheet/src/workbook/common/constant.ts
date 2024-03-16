/** @hidden */
export const workbookLocale: string = 'spreadsheetLocale';

/**
 * Workbook locale text
 *
 * @hidden
 */
export const localeData: object = {
    SortOutOfRangeError: 'Select a cell or range inside the used range and try again.'
};


/**
 * currency format collection
 *
 * @hidden
 */
export const currencyFormat: { currency: string[], accounting: string[] } = {
    currency: ['$#,##0.00', '$#,##0', '$#,##0_);[Red]($#,##0)', '$#,##0.00_);($#,##0.00)', '$#,##0_);($#,##0)',
        '$#,##0.00_);[Red]($#,##0.00)'], accounting: ['_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)',
        '_($* #,##0_);_($* (#,##0);_($* "-"_);_(@_)'] };
