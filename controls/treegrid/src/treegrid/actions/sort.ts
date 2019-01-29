import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { ITreeData } from '../base/interface';
import { TreeGrid } from '../base/treegrid';
import { Sort as GridSort, Grid, SortDirection, getObject, getUid } from '@syncfusion/ej2-grids';

/**
 * Internal dataoperations for TreeGrid 
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
   * @private
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
    this.parent.on('createSortRecords', this.createSorting, this);
  }

  /**
   * @hidden
   */
  public removeEventListener(): void {
    if (this.parent.isDestroyed) { return; }
    this.parent.off('updateModel', this.updateModel);
    this.parent.off('createSort', this.createdSortedRecords);
    this.parent.off('createSortRecords', this.createSorting);
  }

  private createSorting(data: Object): void {
     this.flatSortedData = [];
     this.createSortRecords(data);
  }

  private createSortRecords(data: Object): void {
    let sortData: Object = getObject('modifiedData', data); let parentRecords: ITreeData = getObject('parentRecords', data);
    let filteredResult: Object[] = getObject('filteredResult', data);
    let dataLength: number = Object.keys(sortData).length;
    for (let i: number = 0, len: number = dataLength; i < len; i++) {
      let currentSortData: ITreeData = sortData[i];
      this.storedIndex++;
      let level: number = 0;
      currentSortData.index = this.storedIndex;
      if (!isNullOrUndefined(currentSortData[this.parent.childMapping])) {
        currentSortData.childRecords =
          currentSortData[this.parent.childMapping];
        currentSortData.hasChildRecords = true;
        currentSortData.expanded = true;
      }
      if (isNullOrUndefined(currentSortData.uniqueID)) {
        currentSortData.uniqueID = getUid(this.parent.element.id + '_data_');
      }
      if (!isNullOrUndefined(parentRecords)) {
        let parentData: ITreeData = extend({}, parentRecords);
        delete parentData.childRecords;
        delete parentData[this.parent.childMapping];
        currentSortData.parentItem = parentData;
        currentSortData.parentUniqueID = parentData.uniqueID;
        level = parentRecords.level + 1;
      }
      currentSortData.level = level;
      if (
        isNullOrUndefined(currentSortData[this.parent.parentIdMapping]) ||
        currentSortData.parentItem
      ) {
        this.flatSortedData.push(currentSortData);
      }
      if (!isNullOrUndefined(currentSortData[this.parent.childMapping])) {
        this.createSortRecords({ modifiedData: currentSortData[this.parent.childMapping], parentRecords: currentSortData,
          filteredResult: filteredResult });
      }
    }
    this.parent.notify('Sorting', {sortedData: this.flatSortedData, filteredData: filteredResult});
  }

  private createdSortedRecords(sortingElements: Object): void {
     let data: ITreeData[] = getObject('modifiedData', sortingElements);
     let sortQuery: Query = getObject('srtQry', sortingElements);
     let parent: TreeGrid = getObject('parent', sortingElements);
     for (let i: number = 0, len: number = Object.keys(data).length; i < len; i++) {
      if (!isNullOrUndefined(data[i].childRecords) || !isNullOrUndefined(data[i][parent.childMapping])) {
        let sortedData: Object;
        let sortchildData: Object[];
        if (isNullOrUndefined(data[i].childRecords)) {
          sortedData = new DataManager(data[i][parent.childMapping]).executeLocal(sortQuery);
        } else {
          sortedData = new DataManager(data[i].childRecords).executeLocal(sortQuery);
        }
        sortchildData = <Object[]>sortedData;
        if (sortchildData.length > 0) {
          data[i][parent.childMapping] = sortchildData;
        }
        this.createdSortedRecords({ modifiedData: sortchildData, parent: parent, srtQry: sortQuery});
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
   * @hidden
   */
  private updateModel(): void {
    this.parent.sortSettings = this.parent.grid.sortSettings;
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
