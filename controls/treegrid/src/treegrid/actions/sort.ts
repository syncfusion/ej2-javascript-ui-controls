import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { ITreeData } from '../base/interface';
import { TreeGrid } from '../base/treegrid';
import { Sort as GridSort, Grid, SortDirection, getActualProperties } from '@syncfusion/ej2-grids';
import { getParentData } from '../utils';

/**
 * Internal dataoperations for TreeGrid 

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
   * @private
   */
  private getModuleName(): string {
    return 'sort';
  }
  /**

   */

  public addEventListener(): void {
    this.parent.on('updateModel', this.updateModel, this);
    this.parent.on('createSort', this.createdSortedRecords, this);
  }

  /**

   */
  public removeEventListener(): void {
    if (this.parent.isDestroyed) { return; }
    this.parent.off('updateModel', this.updateModel);
    this.parent.off('createSort', this.createdSortedRecords);
  }

  private createdSortedRecords(sortParams: { modifiedData: ITreeData[], filteredData: ITreeData[], srtQry: Query }) : void {
    let data: ITreeData[] = sortParams.modifiedData;
    let srtQry: Query = sortParams.srtQry;
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
        this.iterateSort(childSort, srtQry);
      }
    }
  }
  /** 
   * Sorts a column with the given options. 
   * @param {string} columnName - Defines the column name to be sorted.  
   * @param {SortDirection} direction - Defines the direction of sorting field.  
   * @param {boolean} isMultiSort - Specifies whether the previous sorted columns are to be maintained. 
   * @return {void} 
   */

  public sortColumn(columnName: string, direction: SortDirection, isMultiSort?: boolean): void {
    this.parent.grid.sortColumn(columnName, direction, isMultiSort);
  }

  public removeSortColumn(field: string): void {
    this.parent.grid.removeSortColumn(field);
  }

  /**
   * The function used to update sortSettings of TreeGrid.
   * @return {void}

   */
  private updateModel(): void {
    this.parent.setProperties({sortSettings: getActualProperties(this.parent.grid.sortSettings)}, true);
  }

  /**  
   * Clears all the sorted columns of the TreeGrid.  
   * @return {void} 
   */


  public clearSorting(): void {
    this.parent.grid.clearSorting();
    this.updateModel();
  }

  /**
   * Destroys the Sorting of TreeGrid.
   * @method destroy
   * @return {void}
   */
    public destroy(): void {
      this.removeEventListener();
    }
}
