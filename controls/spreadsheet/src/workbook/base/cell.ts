import { extend, Property, ChildProperty, Complex, Collection } from '@syncfusion/ej2-base';
import { SheetModel } from './index';
import { CellStyleModel, HyperlinkModel, CellStyle, wrapEvent, ValidationModel, Chart, ChartModel } from '../common/index';
import { ImageModel, Image, updateCell } from '../common/index';
import { getRow } from './index';
import { RowModel } from './row-model';
import { CellModel, OpenSettingsModel } from './cell-model';
import { Workbook } from './workbook';
import { getSheet } from './sheet';

/**
 * Represents the cell.
 */
export class Cell extends ChildProperty<RowModel> {

    /**
     * Specifies the note of the cell.
     *
     * @default ''
     */
    @Property('')
    public notes: string;
    /**
     * Specifies the image of the cell.
     *
     * @default []
     */
    @Collection([], Image)
    public image: ImageModel[];

    /**
     * Specifies the chart of the cell.
     *
     * @default []
     */
    @Collection([], Chart)
    public chart: ChartModel[];

    /**
     * Defines the value of the cell which can be text or number.
     *
     * @default ''
     */
    @Property('')
    public value: string;

    /**
     * Defines the formula or expression of the cell.
     *
     * @default ''
     */
    @Property('')
    public formula: string;

    /**
     * Specifies the index of the cell.
     *
     * @default 0
     * @asptype int
     */
    @Property(0)
    public index: number;

    /**
     * Specifies the number format code to display value in specified number format.
     *
     * @default 'General'
     */
    @Property('General')
    public format: string;

    /**
     * Specifies the cell style options.
     *  ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * let spreadsheet: Spreadsheet = new Spreadsheet({
     *      sheets: [{
     *       ...
     *            rows: [{
     *                  cells: [{ value: '12', index: 2,  style: { fontWeight: 'bold', fontSize: 12, fontStyle: 'italic', textIndent: '2pt'
     *                         backgroundColor: '#4b5366', color: '#ffffff' } }]
     *                  }]
     *            }]
     *  });
     * spreadsheet.appendTo('#Spreadsheet');
     * ```
     *
     * @default {}
     */
    @Complex<CellStyleModel>({}, CellStyle)
    public style: CellStyleModel;

    /**
     * Specifies the hyperlink of the cell.
     *
     * @default ''
     */
    @Property('')
    public hyperlink: string | HyperlinkModel;

    /**
     * Wraps the cell text to the next line, if the text width exceeds the column width.
     *
     * @default false
     */
    @Property(false)
    public wrap: boolean;

    /**
     * Specifies the cell is locked or not, for allow edit range in spreadsheet protect option.
     *
     * @default true
     */
    @Property(true)
    public isLocked: boolean;


    /**
     * Specifies the validation of the cell.
     *
     * @default ''
     */
    @Property('')
    public validation: ValidationModel;

    /**
     * Specifies the column-wise cell merge count.
     *
     * @default 1
     * @asptype int
     */
    @Property(1)
    public colSpan: number;

    /**
     * Specifies the row-wise cell merge count.
     *
     * @default 1
     * @asptype int
     */
    @Property(1)
    public rowSpan: number;

    /**
     * Specifies the Specifies the note is editable or not, for the current cell when scroll the spreadsheet.
     *
     * @default false
     * @hidden
     */
    // @Property(false)
    public isNoteEditable: boolean;

    /**
     * Represents whether a cell in the sheet is read-only or not. If set to true, it prevents editing the specified cell in the sheet.
     *
     * @default false
     */
    @Property(false)
    public isReadOnly : boolean;

    /**
     * It allows to set the formatted value.
     *
     * @default ''
     * @hidden
     */
    // @Property(false)
    public formattedText: string;

    /**
     * It allows to set the cell row height.
     *
     * @default 20
     * @hidden
     */
    // @Property(20)
    public rowHeight: number;
}

/**
 * @hidden
 * @param {number} rowIndex - Specifies the rowIndex.
 * @param {number} colIndex - Specifies the colIndex.
 * @param {SheetModel} sheet - Specifies the sheet.
 * @param {boolean} isInitRow - Specifies the isInitRow.
 * @param {boolean} returnEmptyObjIfNull - Specifies the bool value.
 * @returns {CellModel} - get the cell.
 */
export function getCell(
    rowIndex: number, colIndex: number, sheet: SheetModel, isInitRow?: boolean, returnEmptyObjIfNull?: boolean): CellModel {
    const row: RowModel = getRow(sheet, rowIndex);
    if (!row || !row.cells) {
        if (isInitRow) {
            if (!row) {
                sheet.rows[rowIndex as number] = { cells: [] };
            } else {
                sheet.rows[rowIndex as number].cells = [];
            }
        } else {
            return returnEmptyObjIfNull ? {} : null;
        }
    }
    return sheet.rows[rowIndex as number].cells[colIndex as number] || (returnEmptyObjIfNull ? {} : null);
}

/**
 * @hidden
 * @param {number} rowIndex - Specifies the rowIndex.
 * @param {number} colIndex - Specifies the colIndex.
 * @param {SheetModel} sheet - Specifies the sheet.
 * @param {CellModel} cell - Specifies the cell.
 * @param {boolean} isExtend - Specifies the bool value.
 * @param {boolean} isUpdate - If true, allows updating the existing cell data without extending.
 * @returns {void} - set the cell.
 */
export function setCell(
    rowIndex: number, colIndex: number, sheet: SheetModel, cell: CellModel, isExtend?: boolean, isUpdate?: boolean
): void {
    if (!sheet.rows[rowIndex as number]) {
        sheet.rows[rowIndex as number] = { cells: [] };
    } else if (!sheet.rows[rowIndex as number].cells) {
        sheet.rows[rowIndex as number].cells = [];
    }
    if (isExtend && sheet.rows[rowIndex as number].cells[colIndex as number] && !isUpdate) {
        extend(sheet.rows[rowIndex as number].cells[colIndex as number], cell, null, true);
    } else {
        sheet.rows[rowIndex as number].cells[colIndex as number] = cell;
    }
}

/**
 * @hidden
 * @param {CellStyleModel} style - Specifies the style.
 * @param {boolean} defaultKey - Specifies the defaultKey.
 * @returns {CellStyleModel} - Specifies the CellStyleModel.
 */
export function skipDefaultValue(style: CellStyleModel, defaultKey?: boolean): CellStyleModel {
    const defaultProps: CellStyleModel = { fontFamily: 'Calibri', verticalAlign: 'bottom', textIndent: '0pt', backgroundColor: '#ffffff',
        color: '#000000', textAlign: 'left', fontSize: '11pt', fontWeight: 'normal', fontStyle: 'normal', textDecoration: 'none',
        border: '', borderLeft: '', borderTop: '', borderRight: '', borderBottom: '' };
    const changedProps: CellStyleModel = {}; let styleVal: string;
    Object.keys(defaultKey ? defaultProps : style).forEach((propName: string): void => {
        styleVal = style[`${propName}`];
        if (styleVal !== defaultProps[`${propName}`]) {
            changedProps[`${propName}`] = styleVal;
        }
    });
    return changedProps;
}

/**
 * @hidden
 * @param {string} address - Specifies the address.
 * @param {boolean} wrap - Specifies the wrap.
 * @param {Workbook} context - Specifies the context.
 * @param {Workbook} preventEvt - Preventing the before cell update event.
 * @param {boolean} isPublic - Specifies if the wrap operation is invoked from a public method.
 * @returns {void} - Specifies the wrap.
 */
export function wrap(address: string, wrap: boolean = true, context?: Workbook, preventEvt?: boolean, isPublic?: boolean): void {
    const addressInfo: { sheetIndex: number, indices: number[] } = context.getAddressInfo(address);
    const rng: number[] = addressInfo.indices;
    const sheet: SheetModel = getSheet(context, addressInfo.sheetIndex);
    const uiRefresh: boolean = addressInfo.sheetIndex === context.activeSheetIndex;
    let cancel: boolean = !preventEvt;
    for (let i: number = rng[0]; i <= rng[2]; i++) {
        for (let j: number = rng[1]; j <= rng[3]; j++) {
            cancel = updateCell(context, sheet, { cell: { wrap: wrap }, rowIdx: i, colIdx: j, preventEvt: preventEvt });
            if (!cancel && uiRefresh) {
                context.notify(wrapEvent, { range: [i, j, i , j], wrap: wrap, sheet: sheet, initial: true, isPublic: isPublic });
            }
        }
    }
    context.setProperties({ sheets: context.sheets }, true);
}

/**
 * @hidden
 * @param {string} format - Specifies the cell format.
 * @returns {string} - Specifies the supported color code.
 */
export function getColorCode(format: string): string {
    let code: string;
    if (format.indexOf('[') > -1) {
        const colorValue: string = format.split('[')[1].split(']')[0];
        const customColors: string[] = getCustomColors();
        if (customColors.indexOf(colorValue) > -1) {
            code = colorValue;
        }
    }
    return code;
}

/**
 * @hidden
 * @returns {string[]} - Returns the custom format colors
 */
export function getCustomColors(): string[] {
    return ['Black', 'Blue', 'Cyan', 'Green', 'Magenta', 'Red', 'White', 'Yellow'];
}
/**
 * @param {string} format - Specify the format.
 * @param {boolean} checkTime - Specify the checktime.
 * @param {Object} option - Specify rhe option value.
 * @param {string} option.type - Specify the type.
 * @param {boolean} checkBoth - Specify check both values.
 * @returns {boolean} - This function is used to return is custom Data time or not.
 * @hidden
 */
export function isCustomDateTime(format: string, checkTime?: boolean, option?: { type?: string }, checkBoth?: boolean): boolean {
    let isCustom: boolean;
    if (format.includes('"')) {
        const formatSection: string[] = format.split(';');
        let endStrIdx: number; let prevChar: string;
        formatSection.forEach((formatCode: string, index: number): void => {
            for (let idx: number = 0; idx < formatCode.length; idx++) {
                if (formatCode[idx as number] === '"' && formatCode[idx - 1] !== '\\') {
                    endStrIdx = idx;
                    do {
                        endStrIdx = formatCode.indexOf('"', endStrIdx + 1);
                        prevChar = formatCode[endStrIdx - 1];
                    } while (prevChar === '\\' || prevChar === '_' || prevChar === '*');
                    if (endStrIdx === -1) {
                        break;
                    }
                    formatCode = formatCode.substring(0, idx) + formatCode.substring(endStrIdx + 1);
                    idx--;
                }
            }
            formatSection[index as number] = formatCode;
        });
        format = formatSection.join(';');
    }
    if ((format.includes('d') || format.includes('y')) && !format.includes('#') && !getColorCode(format)) {
        if (option) {
            option.type = 'date';
        }
        if (checkBoth && format.includes(' ') && format.split(' ').length === 2) {
            format = format.split(' ')[1];
        } else {
            checkTime = false;
        }
        isCustom = true;
    }
    if (checkTime && (format.includes('h') || format.includes('m') || format.includes('s')) && !format.includes('#') &&
        !getColorCode(format)) {
        if (option) {
            option.type = option.type || '';
            option.type += 'time';
        }
        isCustom = true;
    }
    return isCustom;
}

/**
 * Represents the configuration options for the Spreadsheet when opening a document.
 */
export class OpenSettings extends ChildProperty<OpenSettingsModel> {
    /**
     * Specifies the size of the chunk for the server response when opening a document.
     * This property enables the server response to be returned in chunks when the value is greater than zero.
     */
    @Property(0)
    public chunkSize: number;
    /**
     * Specifies the number of retry attempts for a failed server request when opening the document, provided that the server response is returned in chunks.
     */
    @Property(3)
    public retryCount: number;
    /**
     * Specifies the delay before retrying a failed server request when opening the document, provided that the server response is returned in chunks.
     */
    @Property(500)
    public retryAfterDelay: number;
}
