import { Spreadsheet } from '../base/index';
import { completeAction, refreshSheetTabs, refreshImagePosition, focus } from '../common/index';
import { skipHiddenIdx, deleteAction, InsertDeleteEventArgs, triggerDataChange, ActionEventArgs } from '../../workbook/common/index';
import { SheetModel, CellModel, getCell, getCellIndexes } from '../../workbook/index';

/**
 * The `Delete` module is used to delete cells, rows, columns and sheets from the spreadsheet.
 */
export class Delete {
    private parent: Spreadsheet;
    /**
     * Constructor for the Spreadsheet insert module.
     *
     * @param {Spreadsheet} parent - Constructor for the Spreadsheet insert module.
     * @private
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }
    private delete(actionArgs: ActionEventArgs): void {
        const args: InsertDeleteEventArgs = actionArgs.eventArgs;
        if (args.modelType === 'Sheet') {
            const activeSheetDeleted: boolean = args.activeSheetIndex >= args.startIndex && args.activeSheetIndex <= args.endIndex;
            if (activeSheetDeleted) {
                this.parent.setProperties(
                    { activeSheetIndex: this.parent.skipHiddenSheets(args.startIndex < this.parent.sheets.length ? args.startIndex :
                        (args.startIndex ? args.startIndex - 1 : 0)) }, true);
            }
            this.parent.notify(refreshSheetTabs, null);
            if (activeSheetDeleted) {
                this.parent.renderModule.refreshSheet(false, false, true);
            }
        } else if (args.activeSheetIndex === this.parent.activeSheetIndex) {
            const sheet: SheetModel = this.parent.getActiveSheet();
            const frozenRow: number = this.parent.frozenRowCount(sheet); const frozenCol: number = this.parent.frozenColCount(sheet);
            if (args.modelType === 'Row') {
                if (!this.parent.scrollSettings.enableVirtualization || args.startIndex <= this.parent.viewport.bottomIndex) {
                    if (this.parent.scrollSettings.enableVirtualization) {
                        if (args.startIndex < getCellIndexes(sheet.paneTopLeftCell)[0]) {
                            this.parent.updateTopLeftCell(
                                skipHiddenIdx(sheet, args.startIndex - 1 < frozenRow ? frozenRow : args.startIndex - 1, true) - frozenRow,
                                null, 'col');
                            this.parent.renderModule.refreshSheet(false, false, true);
                        } else {
                            if (args.freezePane || (this.parent.scrollSettings.isFinite &&
                                this.parent.viewport.bottomIndex >= skipHiddenIdx(sheet, sheet.rowCount - 1, false))) {
                                this.parent.renderModule.refreshSheet(false, false, true);
                            } else {
                                const frozenIndexes: number[] = [];
                                const frozenCol: number = this.parent.frozenColCount(sheet);
                                let colIndex: number;
                                const viewportColIdx: number = this.parent.viewport.leftIndex;
                                if (frozenCol) {
                                    frozenIndexes.push(frozenRow);
                                    frozenIndexes.push(viewportColIdx + frozenCol);
                                    colIndex = getCellIndexes(sheet.topLeftCell)[1];
                                } else {
                                    colIndex = viewportColIdx;
                                }
                                this.parent.renderModule.refreshUI(
                                    { rowIndex: this.parent.viewport.topIndex, refresh: 'Row', colIndex: colIndex, skipUpdateOnFirst:
                                    this.parent.viewport.topIndex + frozenRow === skipHiddenIdx(sheet, frozenRow, true),
                                    frozenIndexes: frozenIndexes });
                                if (frozenCol) {
                                    this.parent.viewport.leftIndex = viewportColIdx;
                                }
                                this.parent.selectRange(sheet.selectedRange);
                            }
                        }
                    } else {
                        this.parent.renderModule.refreshSheet(false, false, true);
                    }
                }
            } else {
                if (args.refreshSheet !== false && (!this.parent.scrollSettings.enableVirtualization ||
                    args.startIndex <= this.parent.viewport.rightIndex)) {
                    if (this.parent.scrollSettings.enableVirtualization) {
                        if (args.startIndex < getCellIndexes(sheet.paneTopLeftCell)[1]) {
                            this.parent.updateTopLeftCell(
                                null, skipHiddenIdx(sheet, args.startIndex - 1 < frozenCol ? frozenCol :
                                    args.startIndex - 1, true, 'columns') - frozenCol, 'row');
                            this.parent.renderModule.refreshSheet(false, false, true);
                        } else {
                            if (args.freezePane || args.refreshSheet === true) {
                                this.parent.renderModule.refreshSheet(false, false, true);
                            } else {
                                const frozenRow: number = this.parent.frozenRowCount(sheet);
                                let frozenIndexes: number[] = [];
                                const viewportRowIdx: number = this.parent.viewport.topIndex;
                                const rowIndex: number = frozenRow ? getCellIndexes(sheet.topLeftCell)[0] : viewportRowIdx;
                                if (frozenRow) {
                                    frozenIndexes = [frozenRow + viewportRowIdx, frozenCol];
                                }
                                this.parent.renderModule.refreshUI(
                                    { rowIndex: rowIndex, refresh: 'Column', colIndex: this.parent.viewport.leftIndex, insertDelete: true,
                                        skipUpdateOnFirst: this.parent.viewport.leftIndex + frozenCol === skipHiddenIdx(
                                            sheet, frozenCol, true, 'columns'), frozenIndexes: frozenIndexes });
                                if (frozenRow) {
                                    this.parent.viewport.topIndex = viewportRowIdx;
                                }
                                this.parent.selectRange(sheet.selectedRange);
                            }
                        }
                    } else {
                        this.parent.renderModule.refreshSheet(false, false, true);
                    }
                }
                delete args.refreshSheet;
            }
        }
        this.refreshImgElement(args.deletedModel.length, this.parent.activeSheetIndex, args.modelType, args.startIndex);
        if (args.isAction) {
            delete args.isAction;
            this.parent.notify(completeAction, actionArgs);
            focus(this.parent.element);
        } else if (!args.isUndoRedo) {
            args.isMethod = true;
            this.parent.notify(triggerDataChange, actionArgs);
        }
    }

    private addEventListener(): void {
        this.parent.on(deleteAction, this.delete, this);
    }
    /**
     * Destroy delete module.
     *
     * @returns {void} - Destroy delete module.
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(deleteAction, this.delete);
        }
    }
    /**
     * Get the delete module name.
     *
     * @returns {string} - Get the delete module name.
     */
    public getModuleName(): string {
        return 'delete';
    }
    private refreshImgElement(count: number, sheetIdx: number, modelType: string, index: number): void {
        const sheet: SheetModel = this.parent.sheets[sheetIdx as number];
        let cell: CellModel;
        const address: number[] = [0, 0, sheet.usedRange.rowIndex, sheet.usedRange.colIndex];
        for (let i: number = 0; i <= address[2]; i++) {
            for (let j: number = address[1]; j <= address[3]; j++) {
                cell = getCell(i, j, sheet);
                if (cell && cell.image && cell.image.length > 0) {
                    if ((modelType === 'Row' && i >= index) || (modelType === 'Column' && j >= index)) {
                        this.parent.notify(refreshImagePosition, {
                            rowIdx: i, colIdx: j, sheetIdx: sheetIdx, type: modelType, count: count, status: 'delete'
                        });
                    }
                }
            }
        }
    }
}
