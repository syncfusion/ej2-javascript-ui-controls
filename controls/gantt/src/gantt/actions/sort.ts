import { TreeGrid, Sort as TreeGrdSort } from '@syncfusion/ej2-treegrid';
import { Gantt } from '../base/gantt';
import { SortDirection, getActualProperties } from '@syncfusion/ej2-grids';

/**
 * The Sort module is used to handle sorting action.
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
     *
     * @returns {string} .
     * @private
     */
    private getModuleName(): string {
        return 'sort';
    }

    /**
     * @returns {void} .
     * @private
     */
    private addEventListener(): void {
        this.parent.on('updateModel', this.updateModel, this);
    }

    /**
     *
     * @returns {void} .
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
     *
     * @returns {void} .
     * @private
     */
    public destroy(): void {
        this.removeEventListener();
    }

    /**
     * Sort a column with given options.
     *
     * @param {string} columnName - Defines the column name to sort.
     * @param {SortDirection} direction - Defines the direction of sort.
     * @param {boolean} isMultiSort - Defines whether the previously sorted columns are to be maintained.
     * @returns {void} .
     */
    public sortColumn(columnName: string, direction: SortDirection, isMultiSort?: boolean): void {
        this.parent.treeGrid.sortByColumn(columnName, direction, isMultiSort);
    }

    /**
     * Method to clear all sorted columns.
     *
     * @returns {void} .
     */
    public clearSorting(): void {
        this.parent.treeGrid.clearSorting();
    }

    /**
     * The function used to update sortSettings of TreeGrid.
     *
     * @returns {void} .
     * @hidden
     */
    private updateModel(): void {
        this.parent.sortSettings = this.parent.treeGrid.sortSettings;
    }
    /**
     * To clear sorting for specific column.
     *
     * @param {string} columnName - Defines the sorted column name to remove.
     * @returns {void} .
     */
    public removeSortColumn(columnName: string): void {
        this.parent.treeGrid.grid.removeSortColumn(columnName);

    }
}
