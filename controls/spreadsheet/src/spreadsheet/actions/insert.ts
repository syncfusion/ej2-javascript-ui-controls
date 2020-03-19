import { Spreadsheet } from '../base/index';
import { InsertDeleteEventArgs, beginAction, completeAction, insertSheetTab, skipHiddenIdx } from '../common/index';
import { insert,  } from '../../workbook/common/index';

/**
 * The `Insert` module is used to insert cells, rows, columns and sheets in to the spreadsheet.
 */
export class Insert {
    private parent: Spreadsheet;
    /**
     * Constructor for the Spreadsheet insert module.
     * @private
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }
    private insert(args: InsertDeleteEventArgs): void {
        let isAction: boolean;
        if (args.isAction) { isAction = true; delete args.isAction; }
        if (isAction) { this.parent.notify(beginAction, { eventArgs: args, action: 'insert' }); }
        switch (args.modelType) {
            case 'Sheet':
                this.parent.notify(insertSheetTab, { startIdx: args.index, endIdx: args.index + (args.model.length - 1) });
                this.parent.renderModule.refreshSheet();
                this.parent.element.focus();
                break;
            case 'Row':
                if (!this.parent.scrollSettings.enableVirtualization || args.index <= this.parent.viewport.bottomIndex) {
                    if (this.parent.scrollSettings.enableVirtualization) {
                        if (args.index < this.parent.viewport.topIndex) {
                            this.parent.viewport.topIndex += args.model.length;
                        }
                        this.parent.renderModule.refreshUI({ skipUpdateOnFirst: this.parent.viewport.topIndex === skipHiddenIdx(
                            this.parent.getActiveSheet(), 0, true), rowIndex: this.parent.viewport.topIndex, colIndex:
                            this.parent.viewport.leftIndex, refresh: 'Row' });
                    } else {
                        this.parent.renderModule.refreshUI({ skipUpdateOnFirst: true, rowIndex: args.index, colIndex: 0, refresh: 'Row' });
                    }
                    this.parent.selectRange(this.parent.getActiveSheet().selectedRange);
                }
                break;
            case 'Column':
                if (!this.parent.scrollSettings.enableVirtualization || args.index <= this.parent.viewport.rightIndex) {
                    if (this.parent.scrollSettings.enableVirtualization) {
                        if (args.index < this.parent.viewport.leftIndex) {
                            this.parent.viewport.leftIndex += args.model.length;
                        }
                        this.parent.renderModule.refreshUI({ skipUpdateOnFirst: this.parent.viewport.leftIndex === skipHiddenIdx(
                            this.parent.getActiveSheet(), 0, true, 'columns'), rowIndex: this.parent.viewport.topIndex, colIndex:
                            this.parent.viewport.leftIndex, refresh: 'Column' });
                    } else {
                        this.parent.renderModule.refreshUI({ skipUpdateOnFirst: true, rowIndex: 0, colIndex: args.index, refresh:
                            'Column' });
                    }
                    this.parent.selectRange(this.parent.getActiveSheet().selectedRange);
                }
                break;
        }
        if (isAction) { this.parent.notify(completeAction, { eventArgs: args, action: 'insert' }); }
    }
    private addEventListener(): void {
        this.parent.on(insert, this.insert, this);
    }
    /**
     * Destroy insert module.
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(insert, this.insert);
        }
    }
    /**
     * Get the insert module name.
     */
    public getModuleName(): string {
        return 'insert';
    }
}