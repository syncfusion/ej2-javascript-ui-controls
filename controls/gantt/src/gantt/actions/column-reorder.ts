import { TreeGrid, Reorder as TreeGridReorder } from '@syncfusion/ej2-treegrid';
import { Gantt } from '../base/gantt';
import { ColumnDragEventArgs } from '@syncfusion/ej2-grids';
/**
 * To handle column reorder action from TreeGrid
 */
export class Reorder {
    public parent: Gantt;
    constructor(gantt: Gantt) {
        this.parent = gantt;
        TreeGrid.Inject(TreeGridReorder);
        this.parent.treeGrid.allowReordering = this.parent.allowReordering;
        this.bindEvents();
    }

    /**
     * Get module name
     *
     * @returns {string} .
     */
    private getModuleName(): string {
        return 'reorder';
    }

    /**
     * To bind reorder events.
     *
     * @returns {void} .
     * @private
     */
    private bindEvents(): void {
        this.parent.treeGrid.columnDragStart = (args: ColumnDragEventArgs) => {
            this.parent.trigger('columnDragStart', args);
        };
        this.parent.treeGrid.columnDrag = (args: ColumnDragEventArgs) => {
            this.parent.trigger('columnDrag', args);
        };
        this.parent.treeGrid.columnDrop = (args: ColumnDragEventArgs) => {
            this.parent.trigger('columnDrop', args);
        };
    }

    /**
     * To destroy the column-reorder.
     *
     * @returns {void} .
     * @private
     */
    public destroy(): void {
        // Destroy Method
    }
}
