import { TreeGrid } from '../base/treegrid';
import { getObject, Filter as GridFilter, Grid } from '@syncfusion/ej2-grids';
import { isNullOrUndefined, setValue, getValue } from '@syncfusion/ej2-base';
import { ITreeData } from '../base';
import { getParentData } from '../utils';
import {  FilterHierarchyMode } from '..';

/**
 * TreeGrid Filter module will handle filtering action
 *
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
     *
     * @param {TreeGrid} parent - Tree Grid instance
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
     *
     * @private
     * @returns {string} Returns Filter module name
     */
    protected getModuleName(): string {
        return 'filter';
    }
    /**
     * To destroy the Filter module
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
    }
    /**
     * @hidden
     * @returns {void}
     */
    public addEventListener(): void {
        this.parent.on('updateFilterRecs', this.updatedFilteredRecord, this);
        this.parent.on('clearFilters', this.clearFilterLevel, this);
    }
    /**
     * @hidden
     * @returns {void}
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off('updateFilterRecs', this.updatedFilteredRecord);
        this.parent.off('clearFilters', this.clearFilterLevel);
    }
    /**
     * Function to update filtered records
     *
     * @param {{data: Object} } dataDetails - Filtered data collection
     * @param {Object} dataDetails.data - Fliltered data collection
     * @hidden
     * @returns {void}
     */
    private updatedFilteredRecord(dataDetails: { data: Object }): void {
        setValue('uniqueIDFilterCollection', {}, this.parent);
        this.flatFilteredData = dataDetails.data as Object[];
        this.filteredParentRecs = [];
        this.filteredResult = [];
        this.isHierarchyFilter = false;
        for (let f: number = 0; f < this.flatFilteredData.length; f++) {
            const rec: ITreeData = this.flatFilteredData[parseInt(f.toString(), 10)];
            this.addParentRecord(rec);
            const hierarchyMode: FilterHierarchyMode = this.parent.grid.searchSettings.key === '' ? this.parent.filterSettings.hierarchyMode
                : this.parent.searchSettings.hierarchyMode;
            if (((hierarchyMode === 'Child' || hierarchyMode === 'None') &&
            (this.parent.grid.filterSettings.columns.length !== 0 || this.parent.grid.searchSettings.key !== ''))) {
                this.isHierarchyFilter = true;
            }
            const ischild: Object[] = getObject('childRecords', rec);
            if (!isNullOrUndefined(ischild) && ischild.length) {
                setValue('hasFilteredChildRecords', this.checkChildExsist(rec), rec);
            }
            const parent: Object = getObject('parentItem', rec);
            if (!isNullOrUndefined(parent)) {
                const parRecord: ITreeData = getParentData(this.parent, rec.parentItem.uniqueID, true);
                //let parRecord: Object = this.flatFilteredData.filter((e: ITreeData) => {
                //          return e.uniqueID === rec.parentItem.uniqueID; })[0];
                setValue('hasFilteredChildRecords', true, parRecord);
                if (parRecord && parRecord.parentItem) {
                    this.updateParentFilteredRecord(parRecord);
                }
            }
        }
        if (this.flatFilteredData.length > 0 && this.isHierarchyFilter) {
            this.updateFilterLevel();
        }
        this.parent.notify('updateAction', { result: this.filteredResult });
    }
    private updateParentFilteredRecord(record: ITreeData): void {
        const parRecord: ITreeData = getParentData(this.parent, record.parentItem.uniqueID, true);
        const uniqueIDValue: Object = getValue('uniqueIDFilterCollection', this.parent);
        if (parRecord && Object.prototype.hasOwnProperty.call(uniqueIDValue, parRecord.uniqueID)) {
            setValue('hasFilteredChildRecords', true, parRecord);
        }
        if (parRecord && parRecord.parentItem) {
            this.updateParentFilteredRecord(parRecord);
        }
    }
    private addParentRecord(record: ITreeData): void {
        const parent: Object = getParentData(this.parent, record.parentUniqueID);
        //let parent: Object = this.parent.flatData.filter((e: ITreeData) => {return e.uniqueID === record.parentUniqueID; })[0];
        const hierarchyMode: FilterHierarchyMode = this.parent.grid.searchSettings.key === '' ? this.parent.filterSettings.hierarchyMode
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
                const hierarchyMode: FilterHierarchyMode = this.parent.grid.searchSettings.key === '' ?
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
        const childRec: ITreeData[] = getObject('childRecords', records);
        let isExist: boolean = false;
        for (let count: number = 0; count < childRec.length; count++) {
            const ischild: Object[] = childRec[parseInt(count.toString(), 10)].childRecords;
            const hierarchyMode: FilterHierarchyMode = this.parent.grid.searchSettings.key === '' ?
                this.parent.filterSettings.hierarchyMode : this.parent.searchSettings.hierarchyMode;
            if (((hierarchyMode === 'Child' || hierarchyMode === 'Both') && (this.parent.grid.filterSettings.columns.length !== 0
                || this.parent.grid.searchSettings.key !== ''))) {
                const uniqueIDValue: Object = getValue('uniqueIDFilterCollection', this.parent);
                if (!Object.prototype.hasOwnProperty.call(uniqueIDValue, childRec[parseInt(count.toString(), 10)].uniqueID)) {
                    this.filteredResult.push(childRec[parseInt(count.toString(), 10)]);
                    setValue('uniqueIDFilterCollection.' + childRec[parseInt(count.toString(), 10)].uniqueID, childRec[parseInt(count.toString(), 10)], this.parent);
                    isExist = true;
                }
            }
            if ((hierarchyMode === 'None')
                && (this.parent.grid.filterSettings.columns.length !== 0 || this.parent.grid.searchSettings.key !== '')) {
                if (this.flatFilteredData.indexOf(childRec[parseInt(count.toString(), 10)]) !== -1) {
                    isExist = true;
                    break;
                }
            }
            if (!isNullOrUndefined(ischild) && ischild.length) {
                isExist = this.checkChildExsist(childRec[parseInt(count.toString(), 10)]);
            }
            if ((hierarchyMode === 'Child' || hierarchyMode === 'Both') && childRec.length) {
                isExist = true;
            }
        }
        return isExist;
    }
    private  updateFilterLevel(): void {
        const record: ITreeData[] = this.filteredResult;
        const len: number = this.filteredResult.length;
        for (let c: number = 0; c < len; c++) {
            const parent: ITreeData =  getParentData(this.parent, record[parseInt(c.toString(), 10)].parentUniqueID);
            const isPrst: boolean = record.indexOf(parent) !== -1;
            if (isPrst) {
                const parent: ITreeData = getParentData(this.parent, record[parseInt(c.toString(), 10)].parentUniqueID, true);
                record[parseInt(c.toString(), 10)].filterLevel = parent.filterLevel + 1;
            } else {
                record[parseInt(c.toString(), 10)].filterLevel = 0;
                this.filteredParentRecs.push(record[parseInt(c.toString(), 10)]);
            }
        }
    }
    private clearFilterLevel(data: { flatData: Object[] }): void {
        let count: number = 0;
        const flatData: ITreeData[] = data.flatData as ITreeData[];
        const len: number = flatData.length;
        let currentRecord: ITreeData;
        for (count; count < len; count++) {
            currentRecord = flatData[parseInt(count.toString(), 10)];
            const fLevel: number = currentRecord.filterLevel;
            if (fLevel || fLevel === 0 || !isNullOrUndefined(currentRecord.hasFilteredChildRecords)) {
                currentRecord.hasFilteredChildRecords = null;
                currentRecord.filterLevel = null;
            }
        }
        this.filteredResult = [];
        this.parent.notify('updateResults', { result: flatData, count: flatData.length });
    }
}
