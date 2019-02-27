import { TreeGrid } from '../base/treegrid';
import { getObject, Filter as GridFilter, Grid } from '@syncfusion/ej2-grids';
import { isNullOrUndefined, setValue } from '@syncfusion/ej2-base';
import { ITreeData } from '../base';

/**
 * TreeGrid Filter module will handle filtering action
 * @hidden
 */
export class Filter {

    private parent: TreeGrid;
    public filteredResult: Object[];
    private flatFilteredData: Object[];
    private filteredParentRecs: Object[];
    private isHierarchyFilter: boolean;
    /**
     * Constructor for Filter module
     */
    constructor(parent?: TreeGrid) {
        Grid.Inject(GridFilter);
        this.parent = parent;
        this.isHierarchyFilter = false;
        this.filteredResult = [];
        this.flatFilteredData = [];
        this.filteredParentRecs = [];
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'filter';
    }
    /**
     * To destroy the Filter module 
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
    }
    /**
     * @hidden
     */
    public addEventListener(): void {
        this.parent.on('updateFilterRecs', this.updatedFilteredRecord, this);
        this.parent.on('clearFilters', this.clearFilterLevel, this);
      }
      /**
       * @hidden
       */
      public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off('updateFilterRecs', this.updatedFilteredRecord);
        this.parent.off('clearFilters', this.clearFilterLevel);
      }
    /**
     * Function to update filtered records
     *  @hidden
     */
    private updatedFilteredRecord(dataDetails: { data: Object }): void {
        this.flatFilteredData = dataDetails.data as Object[];
        this.filteredParentRecs = [];
        this.filteredResult = [];
        this.isHierarchyFilter = false;
        for (let f: number = 0 ; f < this.flatFilteredData.length; f++) {
            let rec: ITreeData = this.flatFilteredData[f];
            this.addParentRecord(rec);
            if (this.parent.filterSettings.hierarchyMode === 'Child' ||
                this.parent.filterSettings.hierarchyMode === 'None' || this.parent.searchSettings.hierarchyMode === 'Child' ||
                this.parent.searchSettings.hierarchyMode === 'None') {
                this.isHierarchyFilter = true;
            }
            let ischild: Object[] = getObject('childRecords', rec);
            if (!isNullOrUndefined(ischild) && ischild.length) {
                setValue('hasFilteredChildRecords', this.checkChildExsist(rec), rec);
            }
            let parent: Object = getObject('parentItem', rec);
            if (!isNullOrUndefined(parent)) {
                let parRecord: Object = this.flatFilteredData.filter((e: ITreeData) => {
                            return e.uniqueID === rec.parentItem.uniqueID; })[0];
                setValue('hasFilteredChildRecords', true, parRecord);
            }
        }
        if (this.flatFilteredData.length > 0 && this.isHierarchyFilter) {
            this.updateFilterLevel();
        }
        this.parent.notify('updateAction', { result: this.filteredResult });
    }
    private addParentRecord(record: ITreeData): void {
        let parent: Object = this.parent.flatData.filter((e: ITreeData) => {return e.uniqueID === record.parentUniqueID; })[0];
        if (this.parent.filterSettings.hierarchyMode === 'None' || this.parent.searchSettings.hierarchyMode === 'None') {
            if (isNullOrUndefined(parent)) {
                if (this.flatFilteredData.indexOf(record) !== -1) {
                    if (this.filteredResult.indexOf(record) === -1) {
                        this.filteredResult.push(record);
                        record.hasFilteredChildRecords = true;
                    }
                    return;
                }
            } else {
                    this.addParentRecord(parent);
                    if (this.flatFilteredData.indexOf(parent) !== -1 || this.filteredResult.indexOf(parent) !== -1) {
                         if (this.filteredResult.indexOf(record) === -1) {
                             this.filteredResult.push(record);
                         }
                    } else {
                        if (this.filteredResult.indexOf(record) === -1 && this.flatFilteredData.indexOf(record) !== -1) {
                            this.filteredResult.push(record);
                        }
                    }
                }
        } else {
            if (!isNullOrUndefined(parent)) {
                if (this.parent.filterSettings.hierarchyMode === 'Child'
                     || this.parent.searchSettings.hierarchyMode === 'Child') {
                    if (this.flatFilteredData.indexOf(parent) !== -1) {
                    this.addParentRecord(parent);
                    }
                } else {
                    this.addParentRecord(parent);
                }
            }
            if (this.filteredResult.indexOf(record) === -1) {
                this.filteredResult.push(record);
            }
      }
    }
    private checkChildExsist(records: Object): boolean {
        let childRec: Object[] = getObject('childRecords', records);
        let isExist: boolean = false;
        for (let count: number = 0; count < childRec.length; count++) {
            let ischild: Object[] = getObject('childRecords', childRec[count]);
            if ((this.parent.filterSettings.hierarchyMode === 'Child' || this.parent.filterSettings.hierarchyMode === 'Both') ||
            (this.parent.searchSettings.hierarchyMode === 'Child' || this.parent.searchSettings.hierarchyMode === 'Both' )) {
                this.filteredResult.push(childRec[count]);
                isExist = true;
            }
            if (this.parent.filterSettings.hierarchyMode === 'None' || this.parent.searchSettings.hierarchyMode === 'None' ) {
                if (this.flatFilteredData.indexOf(childRec[count] !== -1)) {
                    isExist = true;
                    break;
                }
            }
            if (!isNullOrUndefined(ischild) && ischild.length) {
                isExist = this.checkChildExsist(childRec[count]);
            }
        }
        return isExist;
    }
    private  updateFilterLevel(): void {
        let record: ITreeData[] = this.filteredResult;
        let len: number = this.filteredResult.length;
        for (let c: number = 0; c < len; c++) {
            let parent: ITreeData = this.parent.flatData.filter((e: ITreeData) => {return e.uniqueID === record[c].parentUniqueID; })[0];
            let isPrst: boolean = record.indexOf(parent) !== -1;
            if (isPrst) {
                let parent: ITreeData = this.filteredResult.filter((e: ITreeData) => {return e.uniqueID === record[c].parentUniqueID; })[0];
                setValue('filterLevel', parent.filterLevel + 1, record[c]);
            } else {
                setValue('filterLevel', 0, record[c]);
                this.filteredParentRecs.push(record[c]);
            }
        }
    }
    private clearFilterLevel(data: { flatData: Object[] }): void {
        let count: number = 0;
        let flatData: ITreeData[] = data.flatData as ITreeData[];
        let len: number = flatData.length;
        let currentRecord: object;
        for (count; count < len; count++) {
            currentRecord = flatData[count];
            let fLevel: number = getObject('filterLevel', currentRecord);
            if (fLevel || fLevel === 0 || !isNullOrUndefined(getObject('hasFilteredChildRecords', currentRecord))) {
                let ischild: Object[] = getObject('childRecords', currentRecord);
                setValue('hasFilteredChildRecords', null, currentRecord);
                setValue('filterLevel', null, currentRecord);
            }
        }
        this.parent.notify('updateResults', { result: flatData, count: flatData.length });
    }
}