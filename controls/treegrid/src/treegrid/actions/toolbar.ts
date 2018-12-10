import { Grid, Toolbar as tool } from '@syncfusion/ej2-grids';
import { TreeGrid } from '../base';
/**
 * Toolbar Module for TreeGrid
 * @hidden
 */
export class Toolbar {
    private parent: TreeGrid;
    constructor(parent: TreeGrid) {
        Grid.Inject(tool);
        this.parent = parent;
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    private getModuleName(): string {
        return 'toolbar';
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
        //this.parent.grid.toolbarModule.destroy();
    }
}