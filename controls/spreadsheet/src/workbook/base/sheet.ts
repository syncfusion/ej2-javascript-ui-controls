import { Workbook } from './workbook';
import { Query, DataManager } from '@syncfusion/ej2-data';
import { RangeModel, SheetModel, UsedRangeModel } from './sheet-model';
import { RowModel } from './row-model';
import { ColumnModel } from './column-model';
import { processIdx } from './data';
import { SheetState, ProtectSettingsModel, ConditionalFormat, ConditionalFormatModel, ExtendedRange, getCellIndexes, moveOrDuplicateSheet, workbookFormulaOperation, duplicateSheetFilterHandler, ExtendedSheet, moveSheetHandler } from '../common/index';
import { ProtectSettings, getCellAddress } from '../common/index';
import { isUndefined, ChildProperty, Property, Complex, Collection, extend } from '@syncfusion/ej2-base';
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
     *
     * @default null
     */
    @Property(null)
    public dataSource: Object[] | DataManager;

    /**
     * Specifies the start cell from which the datasource will be populated.
     *
     * @default 'A1'
     */
    @Property('A1')
    public startCell: string;

    /**
     * Defines the external [`Query`](https://ej2.syncfusion.com/documentation/data/api-query.html)
     * that will be executed along with data processing.
     *
     * @default null
     */
    @Property(null)
    public query: Query;

    /**
     * By default, when a sheet is bound to a data source, columns are assigned to data source fields sequentially.
     * This means that the first data field is assigned to Column A, the second to Column B, and so on.
     * You can customize these assignments by specifying the field names in the desired column order using the 'fieldsOrder' property.
     *
     * @default null
     */
    @Property(null)
    public fieldsOrder: string[];

    /**
     * Show/Hide the field of the datasource as header.
     *
     * @default true
     */
    @Property(true)
    public showFieldAsHeader: boolean;

    /**
     * Template helps to compiles the given HTML String (or HTML Element ID) into HtML Element and append to the Cell.
     *
     * @default ''
     * @aspType string
     */
    @Property('')
    public template: string | Function;

    /**
     * Specifies the address for updating the dataSource or template.
     *
     * @default 'A1'
     */
    @Property('A1')
    public address: string;


    protected setProperties(prop: object, muteOnChange: boolean): void {
        if (this['parentObj'].isComplexArraySetter && this['controlParent'] && this['controlParent'].isAngular) {
            if (Object.keys(prop).length) {
                if (this['parentObj']['currRangeIdx'] === undefined) {
                    this['parentObj']['currRangeIdx'] = 0;
                } else {
                    this['parentObj']['currRangeIdx'] += 1;
                }
                const range: ExtendedRange = this['parentObj'].ranges[this['parentObj']['currRangeIdx']];
                if (range && range.info) {
                    (this as ExtendedRange).info = range.info;
                }
                setTimeout(() => {
                    if (this['parentObj']['currRangeIdx'] !== undefined) {
                        delete this['parentObj']['currRangeIdx'];
                    }
                });
            } else if (this['controlParent'].tagObjects[0].instance && this['controlParent'].tagObjects[0].instance.hasChanges
                && !this['controlParent'].tagObjects[0].instance.isInitChanges) {
                const sheetIdx: number = this['controlParent'].sheets.indexOf(this['parentObj']);
                if (this['parentObj'].changedRangeIdx === undefined) {
                    let rangeIdx: number;
                    const tagObjects: Object[] = this['controlParent'].tagObjects[0].instance.list[sheetIdx as number].tagObjects;
                    for (let i: number = 0; i < tagObjects.length; i++) {
                        if (tagObjects[i as number]['name'] === 'ranges') {
                            tagObjects[i as number]['instance'].list
                                .forEach((range: { hasChanges: boolean }, idx: number) => {
                                    if (range.hasChanges) {
                                        rangeIdx = idx;
                                    }
                                });
                            break;
                        }
                    }
                    this['parentObj'].changedRangeIdx = rangeIdx;
                }
            }
        }
        super.setProperties(prop, muteOnChange);
    }
}

/**
 * Used range which contains end row index and end column index of the last used cell in sheet .
 */
export class UsedRange extends ChildProperty<UsedRange> {
    /**
     * Specifies the last used row index of the sheet.
     *
     * @default 0
     * @asptype int
     */
    @Property(0)
    public rowIndex: number;

    /**
     * Specifies the last used column index of the sheet.
     *
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
     *
     * @default 0
     * @hidden
     */
    // @Property(0)
    public id: number;

    /**
     * Configures row and its properties for the sheet.
     *
     * @default null
     */
    @Property(null)
    public rows: RowModel[];

    /**
     * Configures column and its properties for the sheet.
     *
     * @default null
     */
    @Property(null)
    public columns: ColumnModel[];

    /**
     * Configures protect and its options.
     *
     * @default { selectCells: false, formatCells: false, formatRows: false, formatColumns: false, insertLink: false  }
     */
    @Complex<ProtectSettingsModel>({}, ProtectSettings)
    public protectSettings: ProtectSettingsModel;

    /**
     * Specifies the collection of range for the sheet.
     *
     * @default []
     */
    @Collection([], Range)
    public ranges: RangeModel[];

    /**
     * Specifies the conditional formatting for the sheet.
     *
     * @default []
     */
    @Collection([], ConditionalFormat)
    public conditionalFormats: ConditionalFormatModel[];


    /**
     * Specifies index of the sheet. Based on the index, sheet properties are applied.
     *
     * @default 0
     * @asptype int
     */
    @Property(0)
    public index: number;

    /**
     * Specifies the name of the sheet, the name will show in the sheet tabs.
     *
     * @default ''
     */
    @Property('')
    public name: string;

    /**
     * Defines the number of rows to be rendered in the sheet.
     *
     * @default 100
     * @asptype int
     */
    @Property(100)
    public rowCount: number;

    /**
     * Defines the number of columns to be rendered in the sheet.
     *
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
     *
     * @default 'A1:A1'
     */
    @Property('A1:A1')
    public selectedRange: string;

    /**
     * Specifies active cell within `selectedRange` in the sheet.
     *
     * @default 'A1'
     */
    @Property('A1')
    public activeCell: string;

    /**
     * Defines the used range of the sheet.
     *
     * @default { rowIndex: 0, colIndex: 0 }
     */
    @Complex<UsedRangeModel>({}, UsedRange)
    public usedRange: UsedRangeModel;

    /**
     * Specified cell will be positioned at the upper-left corner of the sheet.
     *
     * @default 'A1'
     */
    @Property('A1')
    public topLeftCell: string;

    /**
     * Specifies to show / hide column and row headers in the sheet.
     *
     * @default true
     */
    @Property(true)
    public showHeaders: boolean;

    /**
     * Specifies to show / hide grid lines in the sheet.
     *
     * @default true
     */
    @Property(true)
    public showGridLines: boolean;

    /**
     * Specifies to  protect the cells in the sheet.
     *
     * @default false
     */
    @Property(false)
    public isProtected: boolean;

    /**
     * Specifies the sheet visibility state. There must be at least one visible sheet in Spreadsheet.
     *
     * @default 'Visible'
     */
    @Property('Visible')
    public state: SheetState;

    /**
     * Gets or sets the number of frozen rows.
     *
     * @default 0
     * @asptype int
     */
    @Property(0)
    public frozenRows: number;

    /**
     * Gets or sets the number of frozen columns.
     *
     * @default 0
     * @asptype int
     */
    @Property(0)
    public frozenColumns: number;

    /**
     * Represents the maximum row height collection.
     *
     * @default []
     * @hidden
     */
    // @Property([])
    public maxHgts: object[];

    /**
     * Represents the freeze pane top left cell. Its default value would be based on the number of freeze rows and columns.
     *
     * @default 'A1'
     */
    @Property('A1')
    public paneTopLeftCell: string;

    /**
     * Specifies the password.
     *
     * @default ''
     */
    @Property('')
    public password: string;

    /**
     * Represents the standard height of the sheet.
     *
     * @default null
     * @asptype double
     * @aspDefaultValue null
     */
    @Property(null)
    public standardHeight: number;
}

/**
 * To get sheet index from address.
 *
 * @hidden
 * @param {Workbook} context - Specifies the context.
 * @param {string} name - Specifies the name.
 * @returns {number} - To gget sheet index from address.
 */
export function getSheetIndex(context: Workbook, name: string): number {
    let idx: number;
    if (name.startsWith('\'') && name.endsWith('\'')) {
        name = name.replace(/''/g, '\'').replace(/^'|'$/g, '');
    }
    for (let i: number = 0; i < context.sheets.length; i++) {
        if (context.sheets[i as number].name.toLowerCase() === name.toLowerCase()) {
            idx = i;
            break;
        }
    }
    return idx;
}

/**
 * To get sheet index from sheet id.
 *
 * @hidden
 * @param {Workbook} context - Specifies the context.
 * @param {number} id - Specifies the id.
 * @returns {number} - To get the sheet index from id.
 */
export function getSheetIndexFromId(context: Workbook, id: number): number {
    let idx: number;
    for (let i: number = 0; i < context.sheets.length; i++) {
        if (context.sheets[i as number].id === id) {
            idx = i;
            break;
        }
    }
    return idx;
}

/**
 * To get sheet name from address.
 *
 * @hidden
 * @param {string} address - Specifies the address.
 * @returns {address} - To get Sheet Name From Address.
 */
export function getSheetNameFromAddress(address: string): string {
    const sheetRefIndex: number = address.lastIndexOf('!');
    return sheetRefIndex > -1 ? address.substring(0, sheetRefIndex).replace(/'/gi, '') : address.replace(/'/gi, '');
}

/**
 * To get sheet index from sheet name.
 *
 * @hidden
 * @param {Workbook} context - Specifies the context.
 * @param {string} name - Specifies the name.
 * @param {SheetModel} info - Specifies the sheet info.
 * @returns {number} - To get the sheet index by name.
 */
export function getSheetIndexByName
(context: Workbook, name: string, info: { visibleName: string, sheet: string, index: number }[]): number {
    const len: number = info.length;
    for (let i: number = 0; i < len; i++) {
        if (info[i as number].sheet.toUpperCase() === name.toUpperCase()) {
            return info[i as number].index;
        }
    }
    return -1;
}

/**
 * update selected range
 *
 * @hidden
 * @param {Workbook} context - Specifies the context.
 * @param {string} range - Specifies the range.
 * @param {SheetModel} sheet - Specifies the sheet.
 * @param {boolean} isMultiRange - Specifies the boolean value.
 * @returns {void} - Update the selected range.
 */
export function updateSelectedRange(context: Workbook, range: string, sheet: SheetModel = {}, isMultiRange?: boolean): void {
    context.setSheetPropertyOnMute(sheet, 'selectedRange', isMultiRange ? sheet.selectedRange + ' ' + range : range);
}

/**
 * get selected range
 *
 * @hidden
 * @param {SheetModel} sheet - Specifies the sheet.
 * @returns {string} - Get selected range.
 */
export function getSelectedRange(sheet: SheetModel): string {
    return sheet && sheet.selectedRange || 'A1';
}

/**
 * @hidden
 * @param {SheetModel} sheet - Specifies the sheet.
 * @returns {string} - To get single selected range.
 */
export function getSingleSelectedRange(sheet: SheetModel): string {
    return sheet.selectedRange.split(' ')[0];
}


/**
 * @hidden
 * @param {Workbook} context - Specifies the context.
 * @param {number} idx - Specifies the idx.
 * @returns {SheetModel} - To get sheet.
 */
export function getSheet(context: Workbook, idx: number): SheetModel {
    return context.sheets[idx as number];
}

/**
 * @hidden
 * @param {Workbook} context - Specifies the context.
 * @returns {number} - To get sheet name count.
 */
export function getSheetNameCount(context: Workbook): number {
    const name: string[] = [];
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
 * @param {SheetModel[]} sheets - Specifies the sheets.
 * @returns {number} - To get sheet id.
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
 * @param {Workbook} context - Specifies the context.
 * @param {SheetModel[]} sheet - Specifies the sheet.
 * @param {boolean} isImport - Specifies is Import or not.
 * @returns {void} - To initiate sheet.
 */
export function initSheet(context: Workbook, sheet?: SheetModel[], isImport?: boolean): void {
    const sheets: SheetModel[] = sheet ? sheet : context.sheets;
    sheets.forEach((sheet:  ExtendedSheet) => {
        sheet.id = sheet.id || 0;
        sheet.name = sheet.name || '';
        context.setSheetPropertyOnMute(sheet, 'rowCount', sheet.rowCount || 100);
        context.setSheetPropertyOnMute(sheet, 'colCount', sheet.colCount || 100);
        context.setSheetPropertyOnMute(sheet, 'topLeftCell', sheet.topLeftCell || 'A1');
        context.setSheetPropertyOnMute(sheet, 'activeCell', sheet.activeCell || 'A1');
        context.setSheetPropertyOnMute(sheet, 'selectedRange', sheet.selectedRange || sheet.activeCell + ':' + sheet.activeCell);
        context.setSheetPropertyOnMute(sheet, 'usedRange', sheet.usedRange || { rowIndex: 0, colIndex: 0 });
        context.setSheetPropertyOnMute(sheet, 'ranges', sheet.ranges ? sheet.ranges : []);
        context.setSheetPropertyOnMute(sheet, 'rows', (sheet.rows && extend([], sheet.rows, null, true)) || []);
        context.setSheetPropertyOnMute(sheet, 'columns', sheet.columns || []);
        context.setSheetPropertyOnMute(sheet, 'showHeaders', isUndefined(sheet.showHeaders) ? true : sheet.showHeaders);
        context.setSheetPropertyOnMute(sheet, 'showGridLines', isUndefined(sheet.showGridLines) ? true : sheet.showGridLines);
        context.setSheetPropertyOnMute(sheet, 'state', sheet.state || 'Visible');
        sheet.maxHgts = sheet.maxHgts || [];
        sheet.isImportProtected = sheet.isProtected && isImport;
        sheet.protectSettings = sheet.protectSettings || { selectCells: false, formatCells: false, formatRows: false, formatColumns: false,
            insertLink: false };
        sheet.isProtected = sheet.isProtected || false;
        if (!sheet.paneTopLeftCell || sheet.paneTopLeftCell === 'A1') {
            sheet.frozenRows = sheet.frozenRows ? sheet.frozenRows : 0;
            sheet.frozenColumns = sheet.frozenColumns ? sheet.frozenColumns : 0;
            const indexes: number[] = getCellIndexes(sheet.topLeftCell);
            context.setSheetPropertyOnMute(sheet, 'paneTopLeftCell', getCellAddress(
                sheet.frozenRows ? indexes[0] + sheet.frozenRows : indexes[0],
                sheet.frozenColumns ? indexes[1] + sheet.frozenColumns : indexes[1]));
        }
        processIdx(sheet.columns);
        initRow(sheet.rows);
    });
    processIdx(sheets, true, context);
}

// function initRangeSettings(ranges: RangeModel[]): RangeModel[] {
//     ranges.forEach((range: RangeModel) => {
//         range.startCell = range.startCell || 'A1';
//         range.address = range.address || 'A1';
//         range.template = range.template || '';
//         range.showFieldAsHeader = isUndefined(range.showFieldAsHeader) ? true : range.showFieldAsHeader;
//     });
//     return ranges;
// }

/**
 * @param {RowModel[]} rows - Specifies the rows.
 * @returns {void} - Specifies the row.
 */
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
 *
 * @param {Workbook} context - Specifies the context.
 * @param {number} idx - Specifies the idx.
 * @returns {string} - To get sheet name.
 * @hidden
 */
export function getSheetName(context: Workbook, idx: number = context.activeSheetIndex): string {
    return getSheet(context, idx).name;
}

/**
 * @param {Workbook} context - Specifies context
 * @param {number} position - position to move a sheet in the list of sheets
 * @param {number[]} sheetIndexes - Specifies the sheet indexes of the sheets which is to be moved
 * @param {boolean} action - Specifies to trigger events
 * @param {boolean} isFromUpdateAction - Specifies is from UpdateAction or not.
 * @returns {void}
 * @hidden
 */
export function moveSheet(
    context: Workbook, position: number, sheetIndexes?: number[], action?: boolean, isFromUpdateAction?: boolean): void {
    const needRefresh: boolean = !!sheetIndexes;
    sheetIndexes = sheetIndexes || [context.activeSheetIndex];
    const sheetName: string = getSheetName(context);
    position = getNextPrevVisibleSheetIndex(context.sheets, position, context.activeSheetIndex > position);
    const args: { action: string, eventArgs: { position: number, sheetIndexes: number[], cancel: boolean } } = {
        action: 'moveSheet', eventArgs: { position: position, sheetIndexes: sheetIndexes, cancel: false } };
    if (action) {
        context.trigger('actionBegin', args);
    }
    if (!args.eventArgs.cancel) {
        context.notify(moveSheetHandler, { prevIndex: context.activeSheetIndex, currentIndex: position });
        sheetIndexes.forEach((sIdx: number, idx: number) => {
            context.sheets.splice(position + idx, 0, context.sheets.splice(sIdx + (position > sIdx ? -1 * idx : 0), 1)[0]);
        });
        context.setProperties({
            activeSheetIndex: isFromUpdateAction ? getSheetIndex(context, sheetName)
                : (position > sheetIndexes[0] ? position - (sheetIndexes.length - 1) : position)
        }, true);
        context.notify(moveOrDuplicateSheet, { refresh: needRefresh });
        if (action) {
            delete args.eventArgs.cancel;
            context.trigger('actionComplete', args);
        }
    }
}

/**
 * @param {Workbook} context - Specifies context
 * @param {number} sheetIndex - Specifies sheetIndex to be duplicated
 * @param {boolean} action - Specifies to trigger events
 * @param {boolean} isFromUpdateAction - Specifies is from updateAction.
 * @returns {void}
 * @hidden
 */
export function duplicateSheet(context: Workbook, sheetIndex?: number, action?: boolean, isFromUpdateAction?: boolean): void {
    sheetIndex = isUndefined(sheetIndex) ? context.activeSheetIndex : sheetIndex;
    const args: { action: string, eventArgs: { sheetIndex: number, cancel: boolean } } = {
        action: 'duplicateSheet', eventArgs: { sheetIndex: sheetIndex, cancel: false }
    };
    if (action) {
        context.trigger('actionBegin', args);
    }
    if (!args.eventArgs.cancel) {
        const originalSheet: SheetModel = getSheet(context, sheetIndex);
        const sheet: SheetModel = extend({}, (originalSheet as { properties: Object }).properties ?
            (originalSheet as { properties: Object }).properties : originalSheet, {}, true);
        sheet.id = getMaxSheetId(context.sheets);
        let name: string = sheet.name;
        if (/^\(\d+\)$/.test('(' + name.split(' (')[1])) {
            name = name.split(' (')[0];
        }
        const sheetNames: string[] = [];
        context.sheets.forEach((sheet: SheetModel): void => {
            sheetNames.push(sheet.name);
        });
        for (let i: number = 2; ; i++) {
            if (sheetNames.indexOf(name + ' (' + i + ')') === -1) {
                sheet.name = name + ' (' + i + ')';
                break;
            }
        }
        context.notify(duplicateSheetFilterHandler, {sheetIndex: sheetIndex, newSheetIndex: sheetIndex + 1});
        context.createSheet(sheetIndex + 1, [sheet]);
        context.notify(
            workbookFormulaOperation, { action: 'addSheet', sheetName: 'Sheet' + sheet.id, visibleName: sheet.name, sheetId: sheet.id });
        if (!isFromUpdateAction) {
            context.setProperties({ activeSheetIndex: sheetIndex + 1 }, true);
        }
        context.notify(moveOrDuplicateSheet, { refresh: true, isDuplicate: true });
        if (action) {
            delete args.eventArgs.cancel;
            context.trigger('actionComplete', args);
        }
    }
}

/**
 * @param {SheetModel[]} sheets - sheets of spreadsheet
 * @param {number} startIndex - index of the sheet to search from
 * @param {boolean} isPrevious - if set to `true`, its find the previous visible sheet index
 * @returns {number} - return next visible sheet
 */
function getNextPrevVisibleSheetIndex(sheets: SheetModel[], startIndex: number, isPrevious: boolean): number {
    for (let i: number = startIndex; isPrevious ? i >= 0 : i < sheets.length; isPrevious ? i-- : i++) {
        if (!(sheets[i as number].state === 'Hidden' || sheets[i as number].state === 'VeryHidden')) {
            startIndex = i;
            break;
        }
    }
    return startIndex;
}
