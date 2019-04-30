import { TreeGrid, Sort as TreeGrdSort } from '@syncfusion/ej2-treegrid';
import { Gantt } from '../base/gantt';
import { SortDirection, getActualProperties } from '@syncfusion/ej2-grids';

/**
 * Sort operation in Gantt
 */
export class Sort {
    public parent: Gantt;
    constructor(gantt: Gantt) {
        this.parent = gantt;
        TreeGrid.Inject(TreeGrdSort);
        this.parent.treeGrid.allowSorting = this.parent.allowSorting;
        this.parent.treeGrid.sortSettings = getActualProperties(this.parent.sortSettings);
        this.addEventListener();
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    private getModuleName(): string {
        return 'sort';
    }

    /**
     * @private
     */
    private addEventListener(): void {
        this.parent.on('updateModel', this.updateModel, this);
    }

    /**
     * @hidden
     */
    private removeEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('updateModel', this.updateModel);
    }

    /**
     * Destroys the Sorting of TreeGrid.
     * @private
     */
    public destroy(): void {
        this.removeEventListener();
    }

    /**
     * 
     * @param columnName 
     * @param direction 
     * @param isMultiSort 
     */
    public sortColumn(columnName: string, direction: SortDirection, isMultiSort?: boolean): void {
        this.parent.treeGrid.sortByColumn(columnName, direction, isMultiSort);
    }

    /**
     * method for clear all sorted columns
     */
    public clearSorting(): void {
        this.parent.treeGrid.clearSorting();
    }

    /**
     * The function used to update sortSettings of TreeGrid.
     * @return {void}
     * @hidden
     */
    private updateModel(): void {
        this.parent.sortSettings = this.parent.treeGrid.sortSettings;
    }
    /**
     * To clear sorting for specific column
     * @param columnName 
     */
    public removeSortColumn(columnName: string): void {
        this.parent.treeGrid.grid.removeSortColumn(columnName);

    }
}
