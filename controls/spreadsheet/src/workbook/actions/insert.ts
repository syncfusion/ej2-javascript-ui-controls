import { RangeModel, Workbook, getCell, SheetModel, RowModel, CellModel, getSheetIndex, getSheetName, Cell } from '../base/index';
import { insertModel, ExtendedRange, InsertDeleteModelArgs, workbookFormulaOperation, ConditionalFormatModel, updateSheetFromDataSource } from '../../workbook/common/index';
import { insert, insertMerge, MergeArgs, InsertDeleteEventArgs, refreshClipboard, refreshInsertDelete } from '../../workbook/common/index';
import { ModelType, CellStyleModel, updateRowColCount, beginAction, ActionEventArgs, getRangeIndexes, getRangeAddress } from '../../workbook/common/index';
import { insertFormatRange } from '../../workbook/index';
import { IViewport, Spreadsheet } from '../../spreadsheet';

/**
 * The `WorkbookInsert` module is used to insert cells, rows, columns and sheets in to workbook.
 */
export class WorkbookInsert {
    private parent: Workbook;
    /**
     * Constructor for the workbook insert module.
     *
     * @param {Workbook} parent - Specifies the workbook.
     * @private
     */
    constructor(parent: Workbook) {
        this.parent = parent;
        this.addEventListener();
    }
    // tslint:disable-next-line
    private insertModel(args: InsertDeleteModelArgs): void {
        if (!args.model) {
            return;
        }
        let index: number; let model: RowModel[] = []; let mergeCollection: MergeArgs[]; let isModel: boolean;
        let maxHgtObj: object[];
        if (typeof (args.start) === 'number') {
            index = args.start; args.end = args.end || index;
            if (index > args.end) {
                index = args.end; args.end = args.start;
            }
            if (args.modelType === 'Row' && index < args.model.maxHgts.length) {
                maxHgtObj = [];
            }
            for (let i: number = index; i <= args.end; i++) {
                model.push({});
                if (maxHgtObj) {
                    maxHgtObj.push(null);
                }
            }
        } else {
            if (args.start) {
                index = args.start[0].index || 0;
                model = args.start;
                isModel = true;
            } else {
                index = 0;
                model.push({});
            }
            if (args.modelType === 'Row' && index < args.model.maxHgts.length) {
                maxHgtObj = [];
                model.forEach((): void => {
                    maxHgtObj.push(null);
                });
            }
        }
        const eventArgs: InsertDeleteEventArgs = { model: model, index: index, modelType: args.modelType, insertType: args.insertType,
            cancel: false, isUndoRedo: args.isUndoRedo };
        const actionArgs: ActionEventArgs = { eventArgs: eventArgs, action: 'insert' };
        if (args.isAction) {
            this.parent.notify(beginAction, actionArgs);
            if (eventArgs.cancel) {
                return;
            }
            delete eventArgs.cancel;
            eventArgs.isAction = args.isAction;
        }
        const insertArgs: InsertDeleteEventArgs = { startIndex: index, endIndex: index + model.length - 1, modelType: args.modelType, sheet:
            args.model, isInsert: true };
        if (args.modelType === 'Row') {
            if (args.checkCount !== undefined && args.model.rows && args.checkCount === args.model.rows.length) {
                return;
            }
            this.parent.notify(refreshInsertDelete, insertArgs);
            args.model = <SheetModel>args.model;
            if (!args.model.rows) {
                args.model.rows = [];
            }
            if (isModel && args.model.usedRange.rowIndex > -1 && index > args.model.usedRange.rowIndex) {
                for (let i: number = args.model.usedRange.rowIndex; i < index - 1; i++) {
                    model.splice(0, 0, {});
                }
            }
            const frozenRow: number = this.parent.frozenRowCount(args.model);
            if (index < frozenRow) {
                this.parent.setSheetPropertyOnMute(args.model, 'frozenRows', args.model.frozenRows + model.length);
                eventArgs.freezePane = true;
            }
            args.model.rows.splice(index, 0, ...model);
            if (maxHgtObj) {
                args.model.maxHgts.splice(index, 0, ...maxHgtObj);
            }
            //this.setInsertInfo(args.model, index, model.length, 'count');
            this.setRowColCount(insertArgs.startIndex, insertArgs.endIndex, args.model, 'row');
            if (index > args.model.usedRange.rowIndex) {
                this.parent.setUsedRange(index + (model.length - 1), args.model.usedRange.colIndex, args.model, true);
            } else {
                this.parent.setUsedRange(args.model.usedRange.rowIndex + model.length, args.model.usedRange.colIndex, args.model, true);
            }
            const curIdx: number = index + model.length; let style: CellStyleModel; let cell: CellModel; let newStyle: CellStyleModel;
            for (let i: number = 0; i <= args.model.usedRange.colIndex; i++) {
                if (args.model.rows[curIdx as number] && args.model.rows[curIdx as number].cells &&
                    args.model.rows[curIdx as number].cells[i as number]) {
                    cell = args.model.rows[curIdx as number].cells[i as number];
                    if (cell.rowSpan !== undefined && cell.rowSpan < 0 && cell.colSpan === undefined) {
                        this.parent.notify(insertMerge, <MergeArgs>{
                            range: [curIdx, i, curIdx, i], insertCount: model.length, insertModel: 'Row'
                        });
                    }
                }
                style = getCell(index - 1, i, args.model, false, true).style;
                cell = getCell(index + 1, i, args.model, false, true);
                if (style) {
                    newStyle = {};
                    Object.keys(style).forEach((key: string) => {
                        if (!(key === 'borderLeft' || key === 'borderRight' || key === 'borderTop' || key === 'borderBottom')) {
                            newStyle[key as string] = style[key as string];
                        }
                    });
                    if (cell.style) {
                        this.checkBorder(cell.style, args.model.rows[index - 1].cells[i as number].style, newStyle);
                    }
                    model.forEach((row: RowModel): void => {
                        if (!row.cells) { row.cells = []; }
                        if (!row.cells[i as number]) { row.cells[i as number] = {}; }
                        if (!row.cells[i as number].style) { row.cells[i as number].style = {}; }
                        Object.assign(row.cells[i as number].style, newStyle);
                    });
                }
            }
            eventArgs.sheetCount = args.model.rows.length;
        } else if (args.modelType === 'Column') {
            if (args.checkCount !== undefined && args.model.columns && args.checkCount === args.model.columns.length) { return; }
            this.parent.notify(refreshInsertDelete, insertArgs);
            args.model = <SheetModel>args.model;
            if (!args.model.columns) { args.model.columns = []; }
            if (index && !args.model.columns[index - 1]) {
                args.model.columns[index - 1] = {};
            }
            args.model.columns.splice(index, 0, ...model);
            const frozenCol: number = this.parent.frozenColCount(args.model);
            if (index < frozenCol) {
                this.parent.setSheetPropertyOnMute(args.model, 'frozenColumns', args.model.frozenColumns + model.length);
                eventArgs.freezePane = true;
            }
            //this.setInsertInfo(args.model, index, model.length, 'fldLen', 'Column');
            this.setRowColCount(insertArgs.startIndex, insertArgs.endIndex, args.model, 'col');
            if (index > args.model.usedRange.colIndex) {
                this.parent.setUsedRange(args.model.usedRange.rowIndex, index + (model.length - 1), args.model, true);
            } else {
                this.parent.setUsedRange(args.model.usedRange.rowIndex, args.model.usedRange.colIndex + model.length, args.model, true);
            }
            if (!args.model.rows) { args.model.rows = []; }
            const cellModel: CellModel[] = [];
            if (!args.columnCellsModel) { args.columnCellsModel = []; }
            for (let i: number = 0; i < model.length; i++) { cellModel.push(null); }
            mergeCollection = [];
            let cell: CellModel; let style: CellStyleModel; let newStyle: CellStyleModel;
            for (let i: number = 0; i <= args.model.usedRange.rowIndex; i++) {
                if (!args.model.rows[i as number]) {
                    args.model.rows[i as number] = { cells: [] };
                } else if (!args.model.rows[i as number].cells) {
                    args.model.rows[i as number].cells = [];
                }
                if (index && !args.model.rows[i as number].cells[index - 1]) {
                    args.model.rows[i as number].cells[index - 1] = {};
                }
                args.model.rows[i as number].cells.splice(index, 0, ...(args.columnCellsModel[i as number] &&
                    args.columnCellsModel[i as number].cells ? args.columnCellsModel[i as number].cells : cellModel));
                const curIdx: number = index + model.length;
                if (args.model.rows[i as number].cells[curIdx as number]) {
                    cell = args.model.rows[i as number].cells[curIdx as number];
                    if (cell.colSpan !== undefined && cell.colSpan < 0 && cell.rowSpan === undefined) {
                        mergeCollection.push(<MergeArgs>{
                            range: [i, curIdx, i, curIdx], insertCount: cellModel.length, insertModel: 'Column'
                        });
                    }
                }
                style = getCell(i, index - 1, args.model, false, true).style;
                cell = getCell(i, index + 1, args.model, false, true);
                if (style) {
                    newStyle = {};
                    Object.keys(style).forEach((key: string) => {
                        if (!(key === 'borderLeft' || key === 'borderRight' || key === 'borderTop' || key === 'borderBottom')) {
                            newStyle[key as string] = style[key as string];
                        }
                    });
                    if (cell.style) {
                        this.checkBorder(cell.style, args.model.rows[i as number].cells[index - 1].style, newStyle);
                    }
                    for (let j: number = index; j < curIdx; j++) {
                        if (!args.model.rows[i as number].cells[j as number]) {
                            args.model.rows[i as number].cells[j as number] = {};
                        }
                        if (!args.model.rows[i as number].cells[j as number].style) {
                            args.model.rows[i as number].cells[j as number].style = {};
                        }
                        Object.assign(args.model.rows[i as number].cells[j as number].style, newStyle);
                    }
                }
            }
            mergeCollection.forEach((mergeArgs: MergeArgs): void => {
                this.parent.notify(insertMerge, mergeArgs);
            });
            eventArgs.sheetCount = args.model.columns.length;
        } else {
            if (args.checkCount !== undefined && args.checkCount === this.parent.sheets.length) { return; }
            const sheetModel: SheetModel[] = model as SheetModel[];
            const sheetName: string = getSheetName(this.parent);
            const isFromUpdateAction: boolean = (args as unknown as { isFromUpdateAction: boolean }).isFromUpdateAction;
            for (let i: number = 0; i < sheetModel.length; i++) {
                if (sheetModel[i as number].name) {
                    for (let j: number = 0; j < this.parent.sheets.length; j++) {
                        if (sheetModel[i as number].name === this.parent.sheets[j as number].name) {
                            sheetModel.splice(i, 1); i--; break;
                        }
                    }
                }
            }
            if (!sheetModel.length) { return; }
            delete model[0].index; this.parent.createSheet(index, model); let id: number;
            if (args.activeSheetIndex) {
                eventArgs.activeSheetIndex = args.activeSheetIndex;
                this.parent.setProperties({ activeSheetIndex: args.activeSheetIndex }, true);
            } else if (!args.isAction && args.start < this.parent.activeSheetIndex) {
                this.parent.setProperties({ activeSheetIndex: this.parent.skipHiddenSheets(this.parent.activeSheetIndex) }, true);
            }
            if (isFromUpdateAction) {
                this.parent.setProperties({ activeSheetIndex: getSheetIndex(this.parent, sheetName) }, true);
            }
            model.forEach((sheet: SheetModel): void => {
                if (isModel) { this.updateRangeModel(sheet.ranges); }
                const viewport: IViewport = (this.parent as Spreadsheet).viewport;
                const refreshRange: number[] = [viewport.topIndex, viewport.leftIndex, viewport.bottomIndex, viewport.rightIndex];
                const args: { sheet: SheetModel, indexes: number[], promise?: Promise<Cell>, resolveAfterFullDataLoaded?: boolean } = {
                    sheet: sheet, resolveAfterFullDataLoaded: true,
                    indexes: refreshRange, promise: new Promise((resolve: Function) => { resolve((() => { /** */ })()); })
                };
                this.parent.notify(updateSheetFromDataSource, args);
                id = sheet.id;
                this.parent.notify(workbookFormulaOperation, {
                    action: 'addSheet', visibleName: sheet.name, sheetName: 'Sheet' + id, sheetId: id });
            });
            eventArgs.activeSheetIndex = args.activeSheetIndex;
            eventArgs.sheetCount = this.parent.sheets.length;
        }
        if (args.modelType !== 'Sheet') {
            this.insertConditionalFormats(args);
            this.parent.notify(
                refreshClipboard,
                { start: index, end: index + model.length - 1, modelType: args.modelType, model: args.model, isInsert: true });
            eventArgs.activeSheetIndex = getSheetIndex(this.parent, args.model.name);
        }
        this.parent.notify(insert, actionArgs);
    }
    private setRowColCount(startIdx: number, endIdx: number, sheet: SheetModel, layout: string): void {
        const prop: string = layout + 'Count';
        this.parent.setSheetPropertyOnMute(sheet, prop, sheet[`${prop}`] + ((endIdx - startIdx) + 1));
        if (sheet.id === this.parent.getActiveSheet().id) {
            this.parent.notify(
                updateRowColCount, { index: sheet[`${prop}`] - 1, update: layout, isInsert: true, start: startIdx, end: endIdx });
        }
    }
    private updateRangeModel(ranges: RangeModel[]): void {
        ranges.forEach((range: RangeModel): void => {
            if (range.dataSource) {
                range.startCell = range.startCell || 'A1';
                range.showFieldAsHeader = range.showFieldAsHeader === undefined || range.showFieldAsHeader;
                range.template = range.template || '';
                range.address = range.address || 'A1';
            }
        });
    }
    private checkBorder(style: CellStyleModel, adjStyle: CellStyleModel, newStyle: CellStyleModel): void {
        if (style.borderLeft && style.borderLeft === adjStyle.borderLeft) { newStyle.borderLeft = style.borderLeft; }
        if (style.borderRight && style.borderRight === adjStyle.borderRight) { newStyle.borderRight = style.borderRight; }
        if (style.borderTop && style.borderTop === adjStyle.borderTop) { newStyle.borderTop = style.borderTop; }
        if (style.borderBottom && style.borderBottom === adjStyle.borderBottom) { newStyle.borderBottom = style.borderBottom; }
    }
    private setInsertInfo(sheet: SheetModel, startIndex: number, count: number, totalKey: string, modelType: ModelType = 'Row'): void {
        const endIndex: number = count = startIndex + (count - 1);
        sheet.ranges.forEach((range: ExtendedRange): void => {
            if (range.info && startIndex < range.info[`${totalKey}`]) {
                if (!range.info[`insert${modelType}Range`]) {
                    range.info[`insert${modelType}Range`] = [[startIndex, endIndex]];
                } else {
                    range.info[`insert${modelType}Range`].push([startIndex, endIndex]);
                }
                range.info[`${totalKey}`] += ((endIndex - startIndex) + 1);
            }
        });
    }
    private insertConditionalFormats(args: InsertDeleteModelArgs): void {
        const cfCollection: ConditionalFormatModel[] = args.model.conditionalFormats;
        if (args.prevAction === 'delete') {
            this.parent.setSheetPropertyOnMute(args.model, 'conditionalFormats', args.conditionalFormats);
        } else if (cfCollection) {
            for (let i: number = 0, cfLength: number = cfCollection.length; i < cfLength; i++) {
                cfCollection[i as number].range = getRangeAddress(
                    insertFormatRange(args, getRangeIndexes(cfCollection[i as number].range), !args.isAction && !args.isUndoRedo));
            }
        }
    }
    private addEventListener(): void {
        this.parent.on(insertModel, this.insertModel, this);
    }
    /**
     * Destroy workbook insert module.
     *
     * @returns {void} - destroy the workbook insert module.
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(insertModel, this.insertModel);
        }
    }
    /**
     * Get the workbook insert module name.
     *
     * @returns {string} - Return the string.
     */
    public getModuleName(): string {
        return 'workbookinsert';
    }
}
