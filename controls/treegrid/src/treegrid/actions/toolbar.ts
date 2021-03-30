import { Grid, Toolbar as tool, RowSelectEventArgs } from '@syncfusion/ej2-grids';
import { TreeGrid, ITreeData } from '../base';
import * as events from '../base/constant';
import { ClickEventArgs } from '@syncfusion/ej2-navigations/src/toolbar';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * Toolbar Module for TreeGrid
 *
 * @hidden
 */
export class Toolbar {
    private parent: TreeGrid;
    constructor(parent: TreeGrid) {
        Grid.Inject(tool);
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * For internal use only - Get the module name.
     *
     * @private
     * @returns {string} - Returns Toolbar module name
     */
    private getModuleName(): string {
        return 'toolbar';
    }

    /**
     * @hidden
     * @returns {void}
     */
    public addEventListener(): void {
        this.parent.on(events.rowSelected, this.refreshToolbar, this);
        this.parent.on(events.toolbarClick, this.toolbarClickHandler, this);
    }

    /**
     * @hidden
     * @returns {void}
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.rowSelected, this.refreshToolbar);
        this.parent.off(events.toolbarClick, this.toolbarClickHandler);
    }

    private refreshToolbar(args: RowSelectEventArgs): void {
        const tObj: TreeGrid = this.parent;
        if ((args.row as HTMLTableRowElement).rowIndex === 0 || tObj.getSelectedRecords().length > 1) {
            this.enableItems([tObj.element.id + '_gridcontrol_indent', tObj.element.id + '_gridcontrol_outdent'], false);
        } else {
            if (!isNullOrUndefined((tObj.getCurrentViewRecords()[(args.row as HTMLTableRowElement).rowIndex] as ITreeData))) {
                if (!isNullOrUndefined((tObj.getCurrentViewRecords()[(args.row as HTMLTableRowElement).rowIndex] as ITreeData)) &&
                    ((tObj.getCurrentViewRecords()[(args.row as HTMLTableRowElement).rowIndex] as ITreeData).level >
                (tObj.getCurrentViewRecords()[(args.row as HTMLTableRowElement).rowIndex - 1] as ITreeData).level)) {
                    this.enableItems([tObj.element.id + '_gridcontrol_indent'], false);
                } else {
                    this.enableItems([tObj.element.id + '_gridcontrol_indent'], true);
                }
                if ((tObj.getCurrentViewRecords()[(args.row as HTMLTableRowElement).rowIndex] as ITreeData).level ===
                (tObj.getCurrentViewRecords()[(args.row as HTMLTableRowElement).rowIndex - 1] as ITreeData).level) {
                    this.enableItems([tObj.element.id + '_gridcontrol_indent'], true);
                }
                if ((tObj.getCurrentViewRecords()[(args.row as HTMLTableRowElement).rowIndex] as ITreeData).level === 0) {
                    this.enableItems([tObj.element.id + '_gridcontrol_outdent'], false);
                }
                if ((tObj.getCurrentViewRecords()[(args.row as HTMLTableRowElement).rowIndex] as ITreeData).level !== 0) {
                    this.enableItems([tObj.element.id + '_gridcontrol_outdent'], true);
                }
            }
        }
        if ((args.row as HTMLTableRowElement).rowIndex === 0 && !isNullOrUndefined((args.data as ITreeData).parentItem)) {
            this.enableItems([tObj.element.id + '_gridcontrol_outdent'], true);
        }
    }
    private toolbarClickHandler(args: ClickEventArgs): void {
        const tObj: TreeGrid = this.parent;
        if (this.parent.editSettings.mode === 'Cell' && this.parent.grid.editSettings.mode === 'Batch' &&
            args.item.id === this.parent.grid.element.id + '_update') {
            args.cancel = true;
            this.parent.grid.editModule.saveCell();
        }
        if (args.item.id === this.parent.grid.element.id + '_expandall') {
            this.parent.expandAll();
        }
        if (args.item.id === this.parent.grid.element.id + '_collapseall') {
            this.parent.collapseAll();
        }
        if (args.item.id === tObj.grid.element.id + '_indent' && tObj.getSelectedRecords().length) {
            const record: ITreeData = tObj.getCurrentViewRecords()[tObj.getSelectedRowIndexes()[0] - 1];
            let dropIndex: number;
            if (record.level > (tObj.getSelectedRecords()[0] as ITreeData).level) {
                for (let i: number = 0; i < tObj.getCurrentViewRecords().length; i++) {
                    if ((tObj.getCurrentViewRecords()[i] as ITreeData).taskData === record.parentItem.taskData) {
                        dropIndex = i;
                    }
                }
            } else {
                dropIndex = tObj.getSelectedRowIndexes()[0] - 1;
            }
            tObj.reorderRows([tObj.getSelectedRowIndexes()[0]], dropIndex, 'child');
        }
        if (args.item.id === tObj.grid.element.id + '_outdent' && tObj.getSelectedRecords().length) {
            const index: number = tObj.getSelectedRowIndexes()[0];
            let dropIndex: number; const parentItem: ITreeData = (tObj.getSelectedRecords()[0] as ITreeData).parentItem;
            for (let i: number = 0; i < tObj.getCurrentViewRecords().length; i++) {
                if ((tObj.getCurrentViewRecords()[i] as ITreeData).taskData === parentItem.taskData) {
                    dropIndex = i;
                }
            }
            tObj.reorderRows([index], dropIndex, 'below');
        }
    }
    /**
     * Gets the toolbar of the TreeGrid.
     *
     * @returns {Element} - Returns Toolbar element
     * @hidden
     */
    public getToolbar(): Element {
        return this.parent.grid.toolbarModule.getToolbar();
    }

    /**
     * Enables or disables ToolBar items.
     *
     * @param {string[]} items - Defines the collection of itemID of ToolBar items.
     * @param {boolean} isEnable - Defines the items to be enabled or disabled.
     * @returns {void}
     * @hidden
     */
    public enableItems(items: string[], isEnable: boolean): void {
        this.parent.grid.toolbarModule.enableItems(items, isEnable);
    }

    /**
     * Destroys the ToolBar.
     *
     * @method destroy
     * @returns {void}
     */
    public destroy(): void {
        this.removeEventListener();
    }
}
