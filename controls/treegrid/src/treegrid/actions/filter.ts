import { TreeGrid } from '../base/treegrid';
import { getObject, Filter as GridFilter, Grid } from '@syncfusion/ej2-grids';
import { isNullOrUndefined, setValue, getValue } from '@syncfusion/ej2-base';
import { ITreeData } from '../base';
import { getParentData } from '../utils';
import {  FilterHierarchyMode } from '..';

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
        setValue('uniqueIDFilterCollection', {}, this.parent);
        this.flatFilteredData = dataDetails.data as Object[];
        this.filteredParentRecs = [];
        this.filteredResult = [];
        this.isHierarchyFilter = false;
        for (let f: number = 0; f < this.flatFilteredData.length; f++) {
            let rec: ITreeData = this.flatFilteredData[f];
            this.addParentRecord(rec);
            let hierarchyMode: FilterHierarchyMode = this.parent.grid.searchSettings.key === '' ? this.parent.filterSettings.hierarchyMode
            : this.parent.searchSettings.hierarchyMode;
            if (((hierarchyMode === 'Child' || hierarchyMode === 'None') &&
            (this.parent.grid.filterSettings.columns.length !== 0 || this.parent.grid.searchSettings.key !== ''))) {
                this.isHierarchyFilter = true;
            }
            let ischild: Object[] = getObject('childRecords', rec);
            if (!isNullOrUndefined(ischild) && ischild.length) {
                setValue('hasFilteredChildRecords', this.checkChildExsist(rec), rec);
            }
            let parent: Object = getObject('parentItem', rec);
            if (!isNullOrUndefined(parent)) {
                let parRecord: ITreeData = getParentData(this.parent, rec.parentItem.uniqueID, true);
                //let parRecord: Object = this.flatFilteredData.filter((e: ITreeData) => {
                //          return e.uniqueID === rec.parentItem.uniqueID; })[0];
                setValue('hasFilteredChildRecords', true, parRecord);
            }
        }
        if (this.flatFilteredData.length > 0 && this.isHierarchyFilter) {
            this.updateFilterLevel();
        }
        this.parent.notify('updateAction', { result: this.filteredResult });
    }
    private addParentRecord(record: ITreeData): void {
        let parent: Object = getParentData(this.parent, record.parentUniqueID);
        //let parent: Object = this.parent.flatData.filter((e: ITreeData) => {return e.uniqueID === record.parentUniqueID; })[0];
        let hierarchyMode: FilterHierarchyMode = this.parent.grid.searchSettings.key === '' ? this.parent.filterSettings.hierarchyMode
        : this.parent.searchSettings.hierarchyMode;
        if (hierarchyMode === 'None' && (this.parent.grid.filterSettings.columns.length !== 0
            || this.parent.grid.searchSettings.key !== '')) {
            if (isNullOrUndefined(parent)) {
                if (this.flatFilteredData.indexOf(record) !== -1) {
                    if (this.filteredResult.indexOf(record) === -1) {
                        this.filteredResult.push(record);
                        setValue('uniqueIDFilterCollection.' + record.uniqueID, record, this.parent);
                        record.hasFilteredChildRecords = true;
                    }
                    return;
                }
            } else {
                this.addParentRecord(parent);
                if (this.flatFilteredData.indexOf(parent) !== -1 || this.filteredResult.indexOf(parent) !== -1) {
                    if (this.filteredResult.indexOf(record) === -1) {
                        this.filteredResult.push(record);
                        setValue('uniqueIDFilterCollection.' + record.uniqueID, record, this.parent);
                    }
                } else {
                    if (this.filteredResult.indexOf(record) === -1 && this.flatFilteredData.indexOf(record) !== -1) {
                        this.filteredResult.push(record);
                        setValue('uniqueIDFilterCollection.' + record.uniqueID, record, this.parent);
                    }
                }
            }
        } else {
            if (!isNullOrUndefined(parent)) {
                let hierarchyMode: FilterHierarchyMode = this.parent.grid.searchSettings.key === '' ?
                this.parent.filterSettings.hierarchyMode : this.parent.searchSettings.hierarchyMode;
                if (hierarchyMode === 'Child' && (this.parent.grid.filterSettings.columns.length !== 0
                    || this.parent.grid.searchSettings.key !== '')) {
                    if (this.flatFilteredData.indexOf(parent) !== -1) {
                        this.addParentRecord(parent);
                    }
                } else {
                    this.addParentRecord(parent);
                }
            }
            if (this.filteredResult.indexOf(record) === -1) {
                this.filteredResult.push(record);
                setValue('uniqueIDFilterCollection.' + record.uniqueID, record, this.parent);
            }
        }
    }
    private checkChildExsist(records: Object): boolean {
        let childRec: ITreeData[] = getObject('childRecords', records);
        let isExist: boolean = false;
        for (let count: number = 0; count < childRec.length; count++) {
            let ischild: Object[] = childRec[count].childRecords;
            let hierarchyMode: FilterHierarchyMode = this.parent.grid.searchSettings.key === '' ?
            this.parent.filterSettings.hierarchyMode : this.parent.searchSettings.hierarchyMode;
            if (((hierarchyMode === 'Child' || hierarchyMode === 'Both') && (this.parent.grid.filterSettings.columns.length !== 0
                || this.parent.grid.searchSettings.key !== ''))) {
                let uniqueIDValue: Object = getValue('uniqueIDFilterCollection', this.parent);
                if (!uniqueIDValue.hasOwnProperty(childRec[count].uniqueID)) {
                    this.filteredResult.push(childRec[count]);
                    setValue('uniqueIDFilterCollection.' + childRec[count].uniqueID, childRec[count], this.parent);
                    isExist = true;
                }
            }
            if ((hierarchyMode === 'None')
                && (this.parent.grid.filterSettings.columns.length !== 0 || this.parent.grid.searchSettings.key !== '')) {
                if (this.flatFilteredData.indexOf(childRec[count]) !== -1) {
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
            let parent: ITreeData =  getParentData(this.parent, record[c].parentUniqueID);
            let isPrst: boolean = record.indexOf(parent) !== -1;
            if (isPrst) {
                let parent: ITreeData = getParentData(this.parent, record[c].parentUniqueID, true);
                record[c].filterLevel = parent.filterLevel + 1;
            } else {
                record[c].filterLevel = 0;
                this.filteredParentRecs.push(record[c]);
            }
        }
    }
    private clearFilterLevel(data: { flatData: Object[] }): void {
        let count: number = 0;
        let flatData: ITreeData[] = data.flatData as ITreeData[];
        let len: number = flatData.length;
        let currentRecord: ITreeData;
        for (count; count < len; count++) {
            currentRecord = flatData[count];
            let fLevel: number = currentRecord.filterLevel;
            if (fLevel || fLevel === 0 || !isNullOrUndefined(currentRecord.hasFilteredChildRecords)) {
                currentRecord.hasFilteredChildRecords = null;
                currentRecord.filterLevel = null;
            }
        }
        this.filteredResult = [];
        this.parent.notify('updateResults', { result: flatData, count: flatData.length });
    }
}