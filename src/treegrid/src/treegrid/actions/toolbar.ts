import { Grid, Toolbar as tool } from '@syncfusion/ej2-grids';
import { TreeGrid } from '../base';
import * as events from '../base/constant';
import { ClickEventArgs } from '@syncfusion/ej2-navigations/src/toolbar';
/**
 * Toolbar Module for TreeGrid
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
     * @private
     */
    private getModuleName(): string {
        return 'toolbar';
    }

    /**
     * @hidden
     */
    public addEventListener(): void {
        this.parent.on(events.toolbarClick, this.toolbarClickHandler, this);
    }

    /**
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.toolbarClick, this.toolbarClickHandler);
    }

    private toolbarClickHandler(args: ClickEventArgs): void {
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
    }
    /**
     * Gets the toolbar of the TreeGrid.
     * @return {Element}
     * @hidden
     */
    public getToolbar(): Element {
        return this.parent.grid.toolbarModule.getToolbar();
    }

    /**
     * Enables or disables ToolBar items.
     * @param {string[]} items - Defines the collection of itemID of ToolBar items.
     * @param {boolean} isEnable - Defines the items to be enabled or disabled.
     * @return {void}
     * @hidden
     */
    public enableItems(items: string[], isEnable: boolean): void {
        this.parent.grid.toolbarModule.enableItems(items, isEnable);
    }

    /**
     * Destroys the ToolBar.
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        this.removeEventListener();
    }
}