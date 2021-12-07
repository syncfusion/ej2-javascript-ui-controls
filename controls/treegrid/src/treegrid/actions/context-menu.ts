import { Grid, ContextMenu as cmenu, ContextMenuOpenEventArgs } from '@syncfusion/ej2-grids';
import { TreeGrid } from '../base';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { isNullOrUndefined, select } from '@syncfusion/ej2-base';
/**
 * ContextMenu Module for TreeGrid
 *
 * @hidden
 */
export class ContextMenu {
    private parent: TreeGrid;
    constructor(parent: TreeGrid) {
        Grid.Inject(cmenu);
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * @hidden
     * @returns {void}
     */
    public addEventListener(): void {
        this.parent.on('contextMenuOpen', this.contextMenuOpen, this);
        this.parent.on('contextMenuClick', this.contextMenuClick, this);
    }
    /**
     * @hidden
     * @returns {void}
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('contextMenuOpen', this.contextMenuOpen);
        this.parent.off('contextMenuClick', this.contextMenuClick);
    }
    private  contextMenuOpen(args: ContextMenuOpenEventArgs): void {
        const addRow: HTMLElement = select('#' + this.parent.element.id + '_gridcontrol_cmenu_AddRow', args.element);
        const editRecord: HTMLElement = select('#' + this.parent.element.id + '_gridcontrol_cmenu_Edit', args.element);
        if (addRow) {
            if (this.parent.grid.editSettings.allowAdding === false) {
                addRow.style.display = 'none';
            } else {
                addRow.style.display = 'block';
            }
        }
        if ((this.parent.editSettings.mode === 'Cell' || this.parent.editSettings.mode === 'Batch')
        && !(isNullOrUndefined(editRecord)) && !(editRecord.classList.contains('e-menu-hide'))) {
            editRecord.style.display = 'none';
        }
    }
    private contextMenuClick(args: MenuEventArgs): void {
        if (args.item.id === 'Above' || args.item.id === 'Below' || args.item.id === 'Child') {
            this.parent.notify('savePreviousRowPosition', args);
            this.parent.setProperties({editSettings: {newRowPosition:  args.item.id }}, true);
            this.parent.addRecord();
        }
    }
    /**
     * For internal use only - Get the module name.
     *
     * @private
     * @returns {string} Returns ContextMenu module name
     */
    protected getModuleName(): string {
        return 'contextMenu';
    }
    /**
     * Destroys the ContextMenu.
     *
     * @function destroy
     * @returns {void}
     */
    public destroy(): void {
        this.removeEventListener();
    }

    /**
     * Gets the context menu element from the TreeGrid.
     *
     * @returns {Element} Return Context Menu root element.
     */
    public getContextMenu(): Element {
        return this.parent.grid.contextMenuModule.getContextMenu();
    }
}
