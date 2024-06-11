import { Workbook, RowModel, CellModel, getCell, setCell, ActionEventArgs } from '../index';
import { deleteAction, InsertDeleteModelArgs, refreshClipboard, ExtendedRange, MergeArgs, beforeDelete, ConditionalFormatModel, getRangeIndexes, getRangeAddress } from '../../workbook/common/index';
import { activeCellMergedRange, setMerge, workbookFormulaOperation, InsertDeleteEventArgs, deleteModel } from '../../workbook/common/index';
import { SheetModel, refreshInsertDelete, updateRowColCount, getSheetIndex, beginAction } from '../../workbook/index';
import { deleteFormatRange } from '../../workbook/index';
import { extend } from '@syncfusion/ej2-base';

/**
 * The `WorkbookDelete` module is used to delete cells, rows, columns and sheets from workbook.
 */
export class WorkbookDelete {
    private parent: Workbook;
    /**
     * Constructor for the workbook delete module.
     *
     * @param {Workbook} parent - Specify the workbook
     * @private
     */
    constructor(parent: Workbook) {
        this.parent = parent;
        this.addEventListener();
    }
    // tslint:disable-next-line
    private deleteModel(args: InsertDeleteModelArgs): void {
        const sheetLength: number = this.parent.sheets.length;
        if (args.modelType === 'Sheet' && sheetLength === 1) {
            return;
        }
        const modelName: string = `${args.modelType.toLowerCase()}s`;
        args.start = <number>args.start;
        if (args.start > args.end) {
            const startIdx: number = args.start;
            args.start = args.end;
            args.end = startIdx;
        }
        const eventArgs: InsertDeleteEventArgs = { startIndex: args.start, endIndex: args.end, modelType: args.modelType,
            cancel: false, isUndoRedo: args.isUndoRedo };
        const actionArgs: ActionEventArgs = { eventArgs: eventArgs, action: 'delete' };
        if (args.isAction) {
            this.parent.notify(beginAction, actionArgs);
            if (eventArgs.cancel) {
                return;
            }
        }
        let deletedCells: RowModel[]; let prevCell: CellModel;
        const mergeArgsCollection: MergeArgs[] = [];
        const count: number = (args.end - args.start) + 1;
        const insertArgs: InsertDeleteEventArgs = { startIndex: args.start, endIndex: args.end, modelType: args.modelType, sheet:
            args.model };
        const isFinite: boolean = (this.parent as { scrollSettings: { isFinite: boolean } } & Workbook).scrollSettings.isFinite;
        if (args.modelType === 'Row') {
            if (args.checkCount !== undefined && args.checkCount === args.model.usedRange.rowIndex) { return; }
            this.parent.notify(refreshInsertDelete, insertArgs);
            args.model = <SheetModel>args.model;
            if (isFinite) {
                if (args.start >= args.model.rowCount) {
                    return;
                }
                if (args.end >= args.model.rowCount) {
                    args.end = args.model.rowCount - 1;
                }
            } else {
                if (args.start > args.model.usedRange.rowIndex) {
                    return;
                }
                if (args.end > args.model.usedRange.rowIndex) {
                    args.end -= (args.end - args.model.usedRange.rowIndex);
                }
            }
            this.setRowColCount(args.start, args.end, args.model, 'row');
            if (args.start <= args.model.usedRange.rowIndex) {
                args.model.usedRange.rowIndex -= ((args.end - args.start) + 1);
                if (args.model.usedRange.rowIndex < 0) {
                    args.model.usedRange.rowIndex = 0;
                }
            }
            let frozenRow: number = this.parent.frozenRowCount(args.model);
            if (args.start < frozenRow) {
                frozenRow = args.end < frozenRow ? (args.end - args.start) + 1 : frozenRow - args.start;
                frozenRow = args.model.frozenRows - frozenRow;
                this.parent.setSheetPropertyOnMute(args.model, 'frozenRows', frozenRow);
                eventArgs.freezePane = true;
            }
            const curIdx: number = args.end + 1; let cell: CellModel; let mergeArgs: MergeArgs;
            if (args.model.rows[args.start] && args.model.rows[args.start].cells) {
                for (let i: number = 0; i <= args.model.usedRange.colIndex; i++) {
                    if (args.model.rows[args.start as number].cells[i as number] &&
                        args.model.rows[args.start as number].cells[i as number].rowSpan !== undefined &&
                        args.model.rows[args.start as number].cells[i as number].rowSpan < 0 &&
                        args.model.rows[args.start as number].cells[i as number].colSpan === undefined) {
                        mergeArgs = { range: [args.start, i, args.start, i] };
                        this.parent.notify(activeCellMergedRange, mergeArgs); mergeArgs.range = mergeArgs.range as number[];
                        if (mergeArgs.range[2] <= args.end) {
                            prevCell = getCell(mergeArgs.range[0], i, args.model);
                            if (prevCell && prevCell.rowSpan > 1) {
                                if (prevCell.rowSpan - ((mergeArgs.range[2] - args.start) + 1) > 1) {
                                    setCell(
                                        mergeArgs.range[0], i, args.model,
                                        { colSpan: prevCell.rowSpan - ((mergeArgs.range[2] - args.start) + 1) }, true);
                                } else {
                                    delete args.model.rows[mergeArgs.range[0]].cells[i as number].rowSpan;
                                }
                            }
                            mergeArgs = null;
                        }
                    }
                    if (args.model.rows[curIdx as number] && args.model.rows[curIdx as number].cells &&
                        args.model.rows[curIdx as number].cells[i as number] && args.model.rows[curIdx as number].cells[i as number].rowSpan
                        !== undefined && args.model.rows[curIdx as number].cells[i as number].rowSpan < 0 &&
                        args.model.rows[curIdx as number].cells[i as number].colSpan === undefined) {
                        if (!mergeArgs) {
                            mergeArgs = { range: [curIdx, i, curIdx, i] }; this.parent.notify(activeCellMergedRange, mergeArgs);
                        }
                        cell = new Object(); mergeArgs.range = mergeArgs.range as number[];
                        Object.assign(cell, getCell(mergeArgs.range[0], mergeArgs.range[1], args.model));
                        if (cell && cell.rowSpan && (cell.rowSpan > 1 || cell.colSpan > 1)) {
                            const indexes: number[] = [];
                            indexes[1] = i; indexes[3] = cell.colSpan > 1 ? i + (cell.colSpan - 1) : i;
                            mergeArgs.range = mergeArgs.range as number[];
                            if (mergeArgs.range[0] < args.start) {
                                indexes[0] = indexes[2] = mergeArgs.range[0];
                                if (cell.rowSpan - count > 1) { indexes[2] += (cell.rowSpan - count - 1); }
                            } else {
                                indexes[0] = indexes[2] = args.start;
                                if (cell.rowSpan - ((args.end - mergeArgs.range[0]) + 1) > 1) {
                                    indexes[2] += ((cell.rowSpan - ((args.end - mergeArgs.range[0]) + 1)) - 1);
                                }
                            }
                            mergeArgsCollection.push(<MergeArgs>{
                                range: indexes, isAction: false, preventRefresh: true, merge: true,
                                type: 'All', skipChecking: true
                            });
                        }
                    }
                    mergeArgs = null;
                }
            }
            eventArgs.sheetCount = args.model.usedRange.rowIndex;
        } else if (args.modelType === 'Column') {
            if (args.checkCount !== undefined && args.checkCount === args.model.usedRange.colIndex) { return; }
            this.parent.notify(refreshInsertDelete, insertArgs);
            args.model = <SheetModel>args.model;
            if (isFinite) {
                if (args.start >= args.model.colCount) {
                    return;
                }
                if (args.end >= args.model.colCount) {
                    args.end = args.model.colCount - 1;
                }
            } else {
                if (args.start > args.model.usedRange.colIndex) {
                    return;
                }
                if (args.end > args.model.usedRange.colIndex) {
                    args.end -= (args.end - args.model.usedRange.colIndex);
                }
            }
            this.setRowColCount(args.start, args.end, args.model, 'col');
            if (args.start <= args.model.usedRange.colIndex) {
                args.model.usedRange.colIndex -= count;
                if (args.model.usedRange.colIndex < 0) {
                    args.model.usedRange.colIndex = 0;
                }
            }
            //this.setDeleteInfo(args.start, args.end, 'fldLen', 'Column');
            let frozenCol: number = this.parent.frozenColCount(args.model);
            if (args.start < frozenCol) {
                frozenCol = args.end < frozenCol ? (args.end - args.start) + 1 : frozenCol - args.start;
                frozenCol = args.model.frozenColumns - frozenCol;
                this.parent.setSheetPropertyOnMute(args.model, 'frozenColumns', frozenCol);
                this.parent.updateTopLeftCell();
                eventArgs.freezePane = true;
            }
            deletedCells = []; const curIdx: number = args.end + 1; let cell: CellModel; let mergeArgs: MergeArgs;
            for (let i: number = 0; i <= args.model.usedRange.rowIndex; i++) {
                deletedCells.push({});
                if (args.model.rows[i as number] && args.model.rows[i as number].cells) {
                    if (args.model.rows[i as number].cells[args.start] && args.model.rows[i as number].cells[args.start].colSpan !==
                        undefined && args.model.rows[i as number].cells[args.start].colSpan < 0 &&
                        args.model.rows[i as number].cells[args.start].rowSpan === undefined) {
                        mergeArgs = { range: [i, args.start, i, args.start] };
                        this.parent.notify(activeCellMergedRange, mergeArgs); mergeArgs.range = mergeArgs.range as number[];
                        if (mergeArgs.range[3] <= args.end) {
                            const prevCell: CellModel = getCell(i, mergeArgs.range[1], args.model);
                            if (prevCell && prevCell.colSpan > 1) {
                                if (prevCell.colSpan - ((mergeArgs.range[3] - args.start) + 1) > 1) {
                                    setCell(
                                        i, mergeArgs.range[1], args.model,
                                        { colSpan: prevCell.colSpan - ((mergeArgs.range[3] - args.start) + 1) }, true);
                                } else {
                                    delete args.model.rows[i as number].cells[mergeArgs.range[1]].colSpan;
                                }
                            }
                            mergeArgs = null;
                        }
                    }
                    if (args.model.rows[i as number].cells[curIdx as number] && args.model.rows[i as number].cells[curIdx as number].colSpan
                        !== undefined && args.model.rows[i as number].cells[curIdx as number].colSpan < 0 &&
                        args.model.rows[i as number].cells[curIdx as number].rowSpan === undefined) {
                        if (!mergeArgs) {
                            mergeArgs = { range: [i, curIdx, i, curIdx] };
                            this.parent.notify(activeCellMergedRange, mergeArgs);
                        }
                        cell = new Object(); mergeArgs.range = mergeArgs.range as number[];
                        Object.assign(cell, getCell(mergeArgs.range[0], mergeArgs.range[1], args.model));
                        if (cell && cell.colSpan && (cell.colSpan > 1 || cell.rowSpan > 1)) {
                            const indexes: number[] = [];
                            indexes[0] = i; indexes[2] = cell.rowSpan > 1 ? i + (cell.rowSpan - 1) : i;
                            mergeArgs.range = mergeArgs.range as number[];
                            if (mergeArgs.range[1] < args.start) {
                                indexes[1] = indexes[3] = mergeArgs.range[1];
                                if (cell.colSpan - count > 1) { indexes[3] += (cell.colSpan - count - 1); }
                            } else {
                                indexes[1] = indexes[3] = args.start;
                                if (cell.colSpan - ((args.end - mergeArgs.range[1]) + 1) > 1) {
                                    indexes[3] += ((cell.colSpan - ((args.end - mergeArgs.range[1]) + 1)) - 1);
                                }
                            }
                            mergeArgsCollection.push(<MergeArgs>{
                                range: indexes, isAction: false, preventRefresh: true, merge: true,
                                type: 'All', skipChecking: true
                            });
                        }
                    }
                    deletedCells[i as number].cells = args.model.rows[i as number].cells.splice(args.start, count);
                    mergeArgs = null;
                }
            }
            eventArgs.sheetCount = args.model.usedRange.colIndex;
            eventArgs.deletedCellsModel = deletedCells;
        } else {
            if ((args.end - args.start === this.parent.sheets.length - 1) || (args.checkCount !== undefined && args.checkCount ===
                this.parent.sheets.length)) {
                return;
            }
            eventArgs.sheetCount = this.parent.sheets.length;
            eventArgs.activeSheetIndex = this.parent.activeSheetIndex;
        }
        const deletedModel: RowModel[] = [];
        const deleteMaxHgt: boolean = args.modelType === 'Row' && args.start < args.model.maxHgts.length;
        for (let i: number = args.start; i <= args.end; i++) {
            const sheetsModel: SheetModel[] = args.model[`${modelName}`];
            if (args.modelType === 'Sheet' && sheetsModel[i as number]) {
                this.parent.notify(workbookFormulaOperation, { action: 'deleteSheetTab', sheetId: sheetsModel[i as number].id });
            }
            if (sheetsModel[args.start] || args.start < sheetsModel.length) {
                deletedModel.push(sheetsModel[args.start] || {});
                sheetsModel.splice(args.start, 1);
            } else {
                deletedModel.push({});
            }
            if (i === args.start) {
                deletedModel[0].index = args.start;
            }
            if (deleteMaxHgt) {
                args.model.maxHgts.splice(args.start, 1);
            }
        }
        mergeArgsCollection.forEach((merge: MergeArgs): void => this.parent.notify(setMerge, merge));
        this.parent.notify(beforeDelete, args);
        if (args.modelType !== 'Sheet') {
            this.parent.notify(refreshClipboard, args);
            eventArgs.refreshSheet = args.refreshSheet;
            eventArgs.activeSheetIndex = getSheetIndex(this.parent, args.model.name);
            eventArgs['conditionalFormats']  = [];
            this.deleteConditionalFormats(args, eventArgs);
        }
        eventArgs.definedNames = insertArgs.definedNames;
        eventArgs.isAction = args.isAction;
        eventArgs.deletedModel = deletedModel;
        delete eventArgs.cancel;
        this.parent.notify(deleteAction, actionArgs);
    }
    private setRowColCount(startIdx: number, endIdx: number, sheet: SheetModel, layout: string): void {
        const prop: string = layout + 'Count';
        const curCount: number = sheet[`${prop}`];
        if (endIdx >= curCount) { endIdx = curCount - 1; }
        if (endIdx < startIdx) { return; }
        this.parent.setSheetPropertyOnMute(sheet, prop, curCount - ((endIdx - startIdx) + 1));
        if (sheet.id === this.parent.getActiveSheet().id) {
            this.parent.notify(updateRowColCount, { index: curCount - 1, update: layout, isDelete: true, start: startIdx, end: endIdx });
        }
    }
    private setDeleteInfo(startIndex: number, endIndex: number, totalKey: string, modelType: string = 'Row'): void {
        const total: number = (endIndex - startIndex) + 1; const newRange: number[] = [];
        this.parent.getActiveSheet().ranges.forEach((range: ExtendedRange): void => {
            if (range.info && startIndex < range.info[`${totalKey}`]) {
                if (range.info[`delete${modelType}Range`]) {
                    range.info[`delete${modelType}Range`].push([startIndex, endIndex]);
                } else {
                    range.info[`delete${modelType}Range`] = [[startIndex, endIndex]];
                }
                range.info[`${totalKey}`] -= total;
                if (range.info[`insert${modelType}Range`]) {
                    range.info[`insert${modelType}Range`] = newRange;
                }
            }
        });
    }
    private deleteConditionalFormats(args: InsertDeleteModelArgs, eventArgs: InsertDeleteEventArgs): void {
        const cfCollection: ConditionalFormatModel[] = args.model.conditionalFormats;
        if (cfCollection) {
            for (let i: number = 0; i < cfCollection.length; i++) {
                eventArgs['conditionalFormats'].push(extend({}, cfCollection[i as number], null, true));
                const cfRange: number[] = getRangeIndexes(cfCollection[i as number].range);
                const sltRangeIndex: number[] = getRangeIndexes(args.model.selectedRange);
                if ((args.modelType === 'Column' && sltRangeIndex[1] <= cfRange[1] && sltRangeIndex[3] >= cfRange[3]) || (args.modelType === 'Row' && sltRangeIndex[0] <= cfRange[0] && sltRangeIndex[2] >= cfRange[2])) {
                    cfCollection.splice(cfCollection.indexOf(cfCollection[i as number]), 1);
                    i--;
                } else {
                    cfCollection[i as number].range = getRangeAddress(deleteFormatRange(args, cfRange));
                }
            }
        }
    }
    private addEventListener(): void {
        this.parent.on(deleteModel, this.deleteModel, this);
    }
    /**
     * Destroy workbook delete module.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(deleteModel, this.deleteModel);
        }
    }
    /**
     * Get the workbook delete module name.
     *
     * @returns {string} - returns the module name.
     */
    public getModuleName(): string {
        return 'workbookdelete';
    }
}
