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
        this.parent.on(events.rowDeselected, this.refreshToolbar, this);
        this.parent.on(events.toolbarClick, this.toolbarClickHandler, this);
    }

    /**
     * @hidden
     * @returns {void}
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.rowSelected, this.refreshToolbar);
        this.parent.off(events.rowDeselected, this.refreshToolbar);
        this.parent.off(events.toolbarClick, this.toolbarClickHandler);
    }

    private refreshToolbar(args: RowSelectEventArgs): void {
        const toolbarElement: Element = this.parent.grid.toolbarModule.getToolbar();
        if (!isNullOrUndefined(toolbarElement)) {
            const tObj: TreeGrid = this.parent; let indentElement: HTMLElement; let outdentElement: HTMLElement;
            const indentID: string = tObj.element.id + '_gridcontrol_indent';
            const outdentID: string = tObj.element.id + '_gridcontrol_outdent';
            const indentEle: HTMLElement = toolbarElement.querySelector('#' + indentID);
            const outdentEle: HTMLElement = toolbarElement.querySelector('#' + outdentID);
            let row: HTMLTableRowElement = args.row as HTMLTableRowElement;
            const selectedrow: HTMLTableRowElement = tObj.getSelectedRows()[0] as HTMLTableRowElement;
            if (!isNullOrUndefined(row[0])) {
                row = row[0];
            }
            row = (!isNullOrUndefined(selectedrow) && selectedrow.rowIndex !== row.rowIndex) ? selectedrow : row;
            if (indentEle !== null && outdentEle !== null) {
                indentElement = toolbarElement.querySelector('#' + indentID).parentElement;
                outdentElement  = toolbarElement.querySelector('#' + outdentID).parentElement;
                if (row.rowIndex === 0 || tObj.getSelectedRowIndexes().length > 1) {
                    indentElement.classList.add('e-hidden');
                    outdentElement.classList.add('e-hidden');
                }
                else if (args['name'] !== 'rowDeselected' || (!isNullOrUndefined(selectedrow) && tObj.grid.isCheckBoxSelection)) {
                    const selectedItem: ITreeData = tObj.getCurrentViewRecords()[row.rowIndex];
                    if (!isNullOrUndefined(selectedItem)) {
                        if ((selectedItem.level > (tObj.getCurrentViewRecords()[row.rowIndex - 1] as ITreeData).level)) {
                            indentElement.classList.add('e-hidden');
                        } else {
                            indentElement.classList.remove('e-hidden');
                        }
                        if (selectedItem.level === (tObj.getCurrentViewRecords()[row.rowIndex - 1] as ITreeData).level) {
                            indentElement.classList.remove('e-hidden');
                        }
                        if (selectedItem.level === 0) {
                            outdentElement.classList.add('e-hidden');
                        }
                        if (selectedItem.level !== 0) {
                            outdentElement.classList.remove('e-hidden');
                        }
                    }
                }
                if (args['name'] === 'rowDeselected' && isNullOrUndefined(selectedrow) && !tObj.grid.isCheckBoxSelection) {
                    if (this.parent.toolbar['includes']('Indent')) {
                        indentElement.classList.add('e-hidden');
                    }
                    if (this.parent.toolbar['includes']('Outdent')) {
                        outdentElement.classList.add('e-hidden');
                    }
                }
            }
        }
    }
    private toolbarClickHandler(args: ClickEventArgs): void {
        const tObj: TreeGrid = this.parent; const indentOutdentAction: string = 'indentOutdentAction';
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
        if (args.item.id === tObj.grid.element.id + '_indent' && tObj.getSelectedRecords().length
         && !isNullOrUndefined(tObj.rowDragAndDropModule)) {
            this.parent.rowDragAndDropModule[indentOutdentAction](null, 'indent');
        }
        if (args.item.id === tObj.grid.element.id + '_outdent' && tObj.getSelectedRecords().length
         && !isNullOrUndefined(tObj.rowDragAndDropModule)) {
            this.parent.rowDragAndDropModule[indentOutdentAction](null, 'outdent');
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
