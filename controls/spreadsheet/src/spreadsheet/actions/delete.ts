import { Spreadsheet } from '../base/index';
import { beginAction, completeAction, skipHiddenIdx, refreshSheetTabs, refreshImagePosition, focus } from '../common/index';
import { deleteAction, InsertDeleteEventArgs, triggerDataChange } from '../../workbook/common/index';
import { SheetModel, CellModel, getCell } from '../../workbook/index';

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
    private delete(args: InsertDeleteEventArgs): void {
        let isAction: boolean;
        if (args.isAction) { isAction = true; delete args.isAction; }
        if (isAction) { this.parent.notify(beginAction, { eventArgs: args, action: 'delete' }); }
        if (args.modelType === 'Sheet') {
            const activeSheetDeleted: boolean = args.activeSheetIndex >= args.startIndex && args.activeSheetIndex <= args.endIndex;
            if (activeSheetDeleted) {
                this.parent.setProperties(
                    { activeSheetIndex: this.parent.skipHiddenSheets(args.startIndex < this.parent.sheets.length ? args.startIndex :
                        (args.startIndex ? args.startIndex - 1 : 0)) },
                    true);
            }
            this.parent.notify(refreshSheetTabs, null);
            if (activeSheetDeleted) { this.parent.renderModule.refreshSheet(); }
            focus(this.parent.element);
        } else if (args.modelType === 'Row') {
            if (!this.parent.scrollSettings.enableVirtualization || args.startIndex <= this.parent.viewport.bottomIndex) {
                if (args.freezePane) {
                    this.parent.renderModule.refreshSheet();
                } else if (this.parent.scrollSettings.enableVirtualization) {
                    if (args.startIndex < this.parent.viewport.topIndex) { this.parent.viewport.topIndex -= args.model.length; }
                    this.parent.renderModule.refreshUI({
                        skipUpdateOnFirst: this.parent.viewport.topIndex === skipHiddenIdx(
                            this.parent.getActiveSheet(), 0, true), rowIndex: this.parent.viewport.topIndex, refresh: 'Row',
                        colIndex: this.parent.viewport.leftIndex
                    });
                    this.parent.selectRange(this.parent.getActiveSheet().selectedRange);
                } else {
                    this.parent.renderModule.refreshUI({ skipUpdateOnFirst: true, refresh: 'Row', rowIndex: args.startIndex, colIndex: 0 });
                    this.parent.selectRange(this.parent.getActiveSheet().selectedRange);
                }
            }
        } else {
            if (args.refreshSheet !== false && (!this.parent.scrollSettings.enableVirtualization ||
                args.startIndex <= this.parent.viewport.rightIndex)) {
                if (args.freezePane || args.refreshSheet === true) {
                    this.parent.renderModule.refreshSheet();
                } else if (this.parent.scrollSettings.enableVirtualization) {
                    if (args.startIndex < this.parent.viewport.leftIndex) { this.parent.viewport.leftIndex -= args.model.length; }
                    this.parent.renderModule.refreshUI({
                        skipUpdateOnFirst: this.parent.viewport.leftIndex === skipHiddenIdx(
                            this.parent.getActiveSheet(), 0, true, 'columns'), rowIndex: this.parent.viewport.topIndex, refresh: 'Column',
                        colIndex: this.parent.viewport.leftIndex, insertDelete: true
                    });
                    this.parent.selectRange(this.parent.getActiveSheet().selectedRange);
                } else {
                    this.parent.renderModule.refreshUI({
                        skipUpdateOnFirst: true, refresh: 'Column', rowIndex: 0,
                        colIndex: args.startIndex, insertDelete: true
                    });
                    this.parent.selectRange(this.parent.getActiveSheet().selectedRange);
                }
            }
            delete args.refreshSheet;
        }
        this.refreshImgElement(args.deletedModel.length, this.parent.activeSheetIndex, args.modelType, args.startIndex);
        if (isAction) {
            this.parent.notify(completeAction, { eventArgs: args, action: 'delete' });
        } else if (!args.isUndoRedo) {
            args.isMethod = true;
            this.parent.notify(triggerDataChange, { eventArgs: args, action: 'delete' });
        }
    }

    private refreshImgElement(count: number, sheetIdx: number, modelType: string, index: number): void {
        const sheet: SheetModel = this.parent.sheets[sheetIdx];
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
}
