import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { ITreeData } from '../base/interface';
import { TreeGrid } from '../base/treegrid';
import { Sort as GridSort, Grid, SortDirection, getActualProperties } from '@syncfusion/ej2-grids';
import { getParentData } from '../utils';

/**
 * Internal dataoperations for TreeGrid
 *
 * @hidden
 */
export class Sort {
    // Internal variables
    private flatSortedData: Object[];
    private taskIds: Object[];
    private storedIndex: number;
    private parent: TreeGrid;
    private isSelfReference: boolean;

    constructor(grid: TreeGrid) {
        Grid.Inject(GridSort);
        this.parent = grid;
        this.taskIds = [];
        this.flatSortedData = [];
        this.storedIndex = -1;
        this.isSelfReference = !isNullOrUndefined(this.parent.parentIdMapping);
        this.addEventListener();
    }

    /**
     * For internal use only - Get the module name.
     *
     * @private
     * @returns {string} Returns Sort module name
     */
    private getModuleName(): string {
        return 'sort';
    }
    /**
     * @hidden
     */

    public addEventListener(): void {
        this.parent.on('updateModel', this.updateModel, this);
        this.parent.on('createSort', this.createdSortedRecords, this);
    }

    /**
     * @hidden
     * @returns {void}
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off('updateModel', this.updateModel);
        this.parent.off('createSort', this.createdSortedRecords);
    }

    private createdSortedRecords(sortParams: { modifiedData: ITreeData[], filteredData: ITreeData[], srtQry: Query }) : void {
        const data: ITreeData[] = sortParams.modifiedData;
        const srtQry: Query = sortParams.srtQry;
        this.iterateSort(data, srtQry);
        this.storedIndex = -1;
        sortParams.modifiedData = this.flatSortedData;
        this.flatSortedData = [];
    }
    private iterateSort(data: ITreeData[], srtQry: Query): void {
        for (let d: number = 0; d < data.length; d++) {
            if (this.parent.grid.filterSettings.columns.length > 0 || this.parent.grid.searchSettings.key !== '') {
                if (!isNullOrUndefined(getParentData(this.parent, data[d].uniqueID, true))) {
                    this.storedIndex++;
                    this.flatSortedData[this.storedIndex] = data[d];
                }
            } else {
                this.storedIndex++;
                this.flatSortedData[this.storedIndex] = data[d];
            }
            if (data[d].hasChildRecords) {
                let childSort: ITreeData[] = <ITreeData[]>(new DataManager(data[d].childRecords).executeLocal(srtQry));
                if (this.parent.allowRowDragAndDrop && data[d].childRecords.indexOf(this.parent.rowDragAndDropModule['draggedRecord']) !== -1 && this.parent.rowDragAndDropModule['dropPosition'] !== 'middleSegment') {
                    var dragdIndex = childSort.indexOf(this.parent.rowDragAndDropModule['draggedRecord']);
                    childSort.splice(dragdIndex, 1);
                    var dropdIndex = childSort.indexOf(this.parent.rowDragAndDropModule['droppedRecord']);
                    if (this.parent.rowDragAndDropModule['dropPosition'] === 'topSegment') {
                        childSort.splice(dropdIndex, 0, this.parent.rowDragAndDropModule['draggedRecord']);
                    }
                    else if (this.parent.rowDragAndDropModule['dropPosition'] === 'bottomSegment') {
                        childSort.splice(dropdIndex + 1, 0, this.parent.rowDragAndDropModule['draggedRecord']);
                    }
                }
                this.iterateSort(childSort, srtQry);
            }
        }
    }
    /**
     * Sorts a column with the given options.
     *
     * @param {string} columnName - Defines the column name to be sorted.
     * @param {SortDirection} direction - Defines the direction of sorting field.
     * @param {boolean} isMultiSort - Specifies whether the previous sorted columns are to be maintained.
     * @returns {void}
     */

    public sortColumn(columnName: string, direction: SortDirection, isMultiSort?: boolean): void {
        this.parent.grid.sortColumn(columnName, direction, isMultiSort);
    }

    public removeSortColumn(field: string): void {
        this.parent.grid.removeSortColumn(field);
    }

    /**
     * The function used to update sortSettings of TreeGrid.
     *
     * @returns {void}
     * @hidden
     */
    private updateModel(): void {
        this.parent.setProperties({sortSettings: getActualProperties(this.parent.grid.sortSettings)}, true);
    }

    /**
     * Clears all the sorted columns of the TreeGrid.
     *
     * @returns {void}
     */


    public clearSorting(): void {
        this.parent.grid.clearSorting();
        this.updateModel();
    }

    /**
     * Destroys the Sorting of TreeGrid.
     *
     * @function destroy
     * @returns {void}
     */
    public destroy(): void {
        this.removeEventListener();
    }
}
