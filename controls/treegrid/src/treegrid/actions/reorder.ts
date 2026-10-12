import { TreeGrid } from '../base/treegrid';
import { ColumnModel, Column } from '../models';
import { getObject, Grid, Reorder as GridReorder } from '@syncfusion/ej2-grids';

/**
 * TreeGrid Reorder module
 *
 * @hidden
 */
export class Reorder {
    private parent: TreeGrid;

    /**
     * Constructor for Reorder module
     *
     * @param {TreeGrid} parent - Tree Grid instance
     */
    constructor(parent?: TreeGrid) {
        Grid.Inject(GridReorder);
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * For internal use only - Get the module name.
     *
     * @private
     * @returns {string} Returns Reorder module name
     */
    private getModuleName(): string {
        return 'reorder';
    }

    /**
     * @hidden
     * @returns {void}
     */
    public addEventListener(): void {
        this.parent.on('getColumnIndex', this.updateTreeColumn, this);
    }

    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off('getColumnIndex', this.updateTreeColumn);
    }
    /**
     * To destroy the Reorder
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
    }

    private updateTreeColumn(): void
    {
        this.parent['getTreeColumn']();
    }
}
