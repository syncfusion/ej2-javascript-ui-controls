import { Workbook } from './workbook';
import { Query, DataManager } from '@syncfusion/ej2-data';
import { RangeModel, SheetModel, UsedRangeModel } from './sheet-model';
import { RowModel } from './row-model';
import { ColumnModel } from './column-model';
import { processIdx } from './data';
import { SheetState, ProtectSettingsModel } from '../common/index';
import { ProtectSettings } from '../common/index';
import { isUndefined, isNullOrUndefined, ChildProperty, Property, Complex } from '@syncfusion/ej2-base';
import { WorkbookModel } from './workbook-model';

/**
 * Configures the range processing for the spreadsheet.
 *  ```html
 * <div id='Spreadsheet'></div>
 * ```
 * ```typescript
 * let spreadsheet: Spreadsheet = new Spreadsheet({
 *      sheets: [{
 *                  name: 'First Sheet',
 *                  ranges: [{ dataSource: defaultData }],
 *                  rows: [{
 *                          index: 30,
 *                          cells: [{ index: 4, value: 'Total Amount:' },
 *                                  { formula: '=SUM(F2:F30)', style: { fontWeight: 'bold' } }]
 *                  }]
 * ...
 * });
 * spreadsheet.appendTo('#Spreadsheet');
 * ```
 */
export class Range extends ChildProperty<Sheet> {
    /**
     * Specifies the data as JSON / Data manager to the sheet.
     * @default null
     */
    @Property(null)
    public dataSource: Object[] | DataManager;

    /**
     * Specifies the start cell from which the datasource will be populated.
     * @default 'A1'
     */
    @Property('A1')
    public startCell: string;

    /**
     * Defines the external [`Query`](https://ej2.syncfusion.com/documentation/data/api-query.html) 
     * that will be executed along with data processing.
     * @default null
     */
    @Property(null)
    public query: Query;

    /**
     * Show/Hide the field of the datasource as header.
     * @default true
     */
    @Property(true)
    public showFieldAsHeader: boolean;

    /**
     * Template helps to compiles the given HTML String (or HTML Element ID) into HtML Element and append to the Cell.
     *  @default ''
     */
    @Property('')
    public template: string;

    /**
     * Specifies the address for updating the dataSource or template.
     * @default 'A1'
     */
    @Property('A1')
    public address: string;


}

/**
 * Used range which contains end row index and end column index of the last used cell in sheet .
 */
export class UsedRange extends ChildProperty<UsedRange> {
    /**
     * Specifies the last used row index of the sheet.
     * @default 0
     * @asptype int
     */
    @Property(0)
    public rowIndex: number;

    /**
     * Specifies the last used column index of the sheet.
     * @default 0
     * @asptype int
     */
    @Property(0)
    public colIndex: number;
}

/**
 * Configures the sheet behavior for the spreadsheet.
 */
export class Sheet extends ChildProperty<WorkbookModel> {
    /**
     * Represents sheet unique id.
     * @default 0
     * @hidden
     */
    @Property(0)
    public id: number;

    /**
     * Configures row and its properties for the sheet.
     * @default []
     */
    @Property([])
    public rows: RowModel[];

    /**
     * Configures column and its properties for the sheet.
     * @default []
     */
    @Property([])
    public columns: ColumnModel[];

    /**
     * Configures protect and its options.
     * @default { selectCells: false, formatCells: false, formatRows: false, formatColumns: false, insertLink: false  }
     */
    @Complex<ProtectSettingsModel>({}, ProtectSettings)
    public protectSettings: ProtectSettingsModel;

    /**
     * Specifies the collection of range for the sheet.
     * @default []
     */
    @Property([])
    public ranges: RangeModel[];

    /**
     * Specifies index of the sheet. Based on the index, sheet properties are applied.
     * @default 0
     * @asptype int
     */
    @Property(0)
    public index: number;

    /**
     * Specifies the name of the sheet, the name will show in the sheet tabs.
     * @default ''
     */
    @Property('')
    public name: string;

    /**
     * Defines the number of rows to be rendered in the sheet.
     * @default 100
     * @asptype int
     */
    @Property(100)
    public rowCount: number;

    /**
     * Defines the number of columns to be rendered in the sheet.
     * @default 100
     * @asptype int
     */
    @Property(100)
    public colCount: number;

    /**
     * Specifies selected range in the sheet.
     *  ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * let spreadsheet: Spreadsheet = new Spreadsheet({
     *      sheets: [{
     *                selectedRange: 'A1:B5'
     *          }],
     *      ...
     * });
     * spreadsheet.appendTo('#Spreadsheet');
     * ```
     * @default 'A1'
     */
    @Property('A1')
    public selectedRange: string;

    /**
     * Specifies active cell within `selectedRange` in the sheet.
     * @default 'A1'
     */
    @Property('A1')
    public activeCell: string;

    /**
     * Defines the used range of the sheet.
     * @default { rowIndex: 0, colIndex: 0 }
     */
    @Complex<UsedRangeModel>({}, UsedRange)
    public usedRange: UsedRangeModel;

    /**
     * Specified cell will be positioned at the upper-left corner of the sheet.
     * @default 'A1'
     */
    @Property('A1')
    public topLeftCell: string;

    /**
     * Specifies to show / hide column and row headers in the sheet.
     * @default true
     */
    @Property(true)
    public showHeaders: boolean;

    /**
     * Specifies to show / hide grid lines in the sheet.
     * @default true
     */
    @Property(true)
    public showGridLines: boolean;

    /**
     * Specifies to  protect the cells in the sheet.
     * @default false
     */
    @Property(false)
    public isProtected: boolean;

    /**
     * Specifies the sheet visibility state. There must be at least one visible sheet in Spreadsheet.
     * @default 'Visible'
     */
    @Property('Visible')
    public state: SheetState;

    /**
     * Represents the maximum row height collection.
     * @default []
     * @hidden
     */
    @Property([])
    public maxHgts: object[];
}

/**
 * To get sheet index from name.
 * @hidden
 */
export function getSheetIndex(context: Workbook, sheet?: string | number): number {
    if (isNullOrUndefined(sheet)) { return context.activeSheetIndex; }
    if (typeof(sheet) === 'number') { return sheet; }
    let idx: number;
    for (let i: number = 0; i < context.sheets.length; i++) {
        if (context.sheets[i].name.toLowerCase() === sheet.toLowerCase()) {
            idx = i;
            break;
        }
    }
    return idx;
}

/**
 * To get sheet index from sheet id.
 * @hidden
 */
export function getSheetIndexFromId(context: Workbook, id: number): number {
    let idx: number;
    for (let i: number = 0; i < context.sheets.length; i++) {
        if (context.sheets[i].id === id) {
            idx = i;
            break;
        }
    }
    return idx;
}

/**
 * To get sheet name from address.
 * @hidden
 */
export function getSheetNameFromAddress(address: string): string {
    return address.split('!')[0].replace(/\'/gi, '');
}

/**
 * To get sheet index from sheet name.
 * @hidden
 */
export function getSheetIndexByName
    (context: Workbook, name: string, info: { visibleName: string, sheet: string, index: number }[]): number {
    let len: number = info.length;
    for (let i: number = 0; i < len; i++) {
        if (info[i].sheet.toUpperCase() === name.toUpperCase()) {
            return info[i].index;
        }
    }
    return -1;
}

/**
 * update selected range
 * @hidden
 */
export function updateSelectedRange(context: Workbook, range: string, sheet: SheetModel = {}): void {
    sheet.selectedRange = range;
}

/**
 * get selected range
 * @hidden
 */
export function getSelectedRange(sheet: SheetModel): string {
    return sheet && sheet.selectedRange || 'A1';
}

/** @hidden */
export function getSheet(context: Workbook, sheet?: string | number): SheetModel {
    return context.sheets[getSheetIndex(context, sheet) || 0];
}

/**
 * @hidden
 */
export function getSheetNameCount(context: Workbook): number {
    let name: string[] = [];
    context.sheets.forEach((sheet: SheetModel) => {
        name.push(sheet.name.toLowerCase());
    });
    for (let i: number = 0; i < name.length; i++) {
        if (name.indexOf('sheet' + context.sheetNameCount) > -1) {
            context.sheetNameCount++;
        } else {
            return context.sheetNameCount++;
        }
    }
    return context.sheetNameCount++;
}

/**
 * @hidden
 */
export function getMaxSheetId(sheets: SheetModel[]): number {
    let cnt: number = 0;
    sheets.forEach((sheet: SheetModel) => {
        cnt = Math.max(sheet.id, cnt);
    });
    return cnt + 1;
}

/**
 * @hidden
 */
export function initSheet(context: Workbook, sheet?: SheetModel[]): void {
    let sheets: SheetModel[] = sheet ? sheet : context.sheets;
    sheets.forEach((sheet: SheetModel) => {
        sheet.id = sheet.id || 0;
        sheet.name = sheet.name || '';
        sheet.rowCount = isUndefined(sheet.rowCount) ? 100 : sheet.rowCount;
        sheet.colCount = isUndefined(sheet.colCount) ? 100 : sheet.colCount;
        sheet.topLeftCell = sheet.topLeftCell || 'A1';
        sheet.activeCell = sheet.activeCell || 'A1';
        sheet.selectedRange = sheet.selectedRange || 'A1';
        sheet.usedRange = sheet.usedRange || { rowIndex: 0, colIndex: 0 };
        sheet.ranges = sheet.ranges ? initRangeSettings(sheet.ranges) : [];
        sheet.rows = sheet.rows || [];
        sheet.columns = sheet.columns || [];
        sheet.showHeaders = isUndefined(sheet.showHeaders) ? true : sheet.showHeaders;
        sheet.showGridLines = isUndefined(sheet.showGridLines) ? true : sheet.showGridLines;
        sheet.state = sheet.state || 'Visible';
        sheet.maxHgts = [];
        sheet.protectSettings = sheet.protectSettings || { selectCells: false, formatCells: false, formatRows: false, formatColumns: false,
            insertLink: false };
        sheet.isProtected = sheet.isProtected || false;
        processIdx(sheet.columns);
        initRow(sheet.rows);
    });
    processIdx(sheets, true, context);
}

function initRangeSettings(ranges: RangeModel[]): RangeModel[] {
    ranges.forEach((range: RangeModel) => {
        range.startCell = range.startCell || 'A1';
        range.address = range.address || 'A1';
        range.template = range.template || '';
        range.showFieldAsHeader = isUndefined(range.showFieldAsHeader) ? true : range.showFieldAsHeader;
    });
    return ranges;
}

function initRow(rows: RowModel[]): void {
    rows.forEach((row: RowModel) => {
        if (row && row.cells) {
            processIdx(row.cells);
        }
    });
    processIdx(rows);
}

/**
 * get sheet name
 * @hidden
 */
export function getSheetName(context: Workbook, idx: number = context.activeSheetIndex): string {
    return getSheet(context, idx).name;
}