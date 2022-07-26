import { getObject, IGrid } from '@syncfusion/ej2-grids';
import { TreeGrid } from './base/treegrid';
import { ColumnModel } from './models/column';
import { DataManager, ODataAdaptor, UrlAdaptor, AdaptorOptions } from '@syncfusion/ej2-data';
import { WebApiAdaptor, WebMethodAdaptor, CacheAdaptor } from '@syncfusion/ej2-data';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ITreeData } from './base/interface';


/**
 * @param {TreeGrid} parent - Tree Grid instance
 * @returns {boolean} - Specifies whether remote data binding
 */
export function isRemoteData(parent: TreeGrid) : boolean {
    if (parent.dataSource instanceof DataManager) {
        const adaptor: AdaptorOptions = parent.dataSource.adaptor;
        return (adaptor instanceof ODataAdaptor ||
      (adaptor instanceof WebApiAdaptor) || (adaptor instanceof WebMethodAdaptor) ||
      (adaptor instanceof CacheAdaptor) || adaptor instanceof UrlAdaptor);
    }
    return false;
}

/**
 * @param {TreeGrid | IGrid} parent - Tree Grid or Grid instance
 * @returns {boolean} - Returns whether custom binding
 */
export function isCountRequired(parent: TreeGrid | IGrid) : boolean {
    if (parent.dataSource && 'result' in parent.dataSource) {
        return true;
    }
    return false;
}

/**
 * @param {TreeGrid} parent - Tree Grid instance
 * @returns {boolean} - Returns whether checkbox column is enabled
 */
export function isCheckboxcolumn(parent: TreeGrid) : boolean {
    for (let i: number = 0; i < parent.columns.length; i++) {
        if ((parent.columns[i] as ColumnModel).showCheckbox) {
            return true;
        }
    }
    return false;
}

/**
 * @param {TreeGrid} parent - Tree Grid instance
 * @returns {boolean} - Returns whether filtering and searching done
 */
export function isFilterChildHierarchy(parent: TreeGrid): boolean {
    if ((!isNullOrUndefined(parent.grid.searchSettings.key) && parent.grid.searchSettings.key !== '' &&
    (parent.searchSettings.hierarchyMode === 'Child' || parent.searchSettings.hierarchyMode === 'None')) ||
    (parent.allowFiltering && parent.grid.filterSettings.columns.length &&
      (parent.filterSettings.hierarchyMode === 'Child' || parent.filterSettings.hierarchyMode === 'None'))) {
        return true;
    }
    return false;
}

/**
 * @param {Object} records - Define records for which parent records has to be found
 * @hidden
 * @returns {Object} - Returns parent records collection
 */
export function findParentRecords(records: Object): Object {
    const datas: Object[] = [];
    const recordsLength: number = Object.keys(records).length;
    for (let i: number = 0, len: number = recordsLength; i < len; i++) {
        const hasChild: boolean = getObject('hasChildRecords', records[i]);
        if (hasChild) {
            datas.push(records[i]);
        }
    }
    return datas;
}
/**
 * @param {TreeGrid} parent - Tree Grid instance
 * @returns {boolean} - Returns the expand status of record
 * @param {ITreeData} record - Define the record for which expand status has be found
 * @param {ITreeData[]} parents - Parent Data collection
 * @hidden
 */
export function getExpandStatus (parent: TreeGrid, record: ITreeData, parents: ITreeData[]) : boolean {
    const parentRecord: ITreeData = isNullOrUndefined(record.parentItem) ? null :
        getParentData(parent, record.parentItem.uniqueID);
    let childParent: ITreeData;
    if (parentRecord != null) {
        if (parent.initialRender && !isNullOrUndefined(parentRecord[parent.expandStateMapping])
        && !parentRecord[parent.expandStateMapping]) {
            parentRecord.expanded = false;
            return false;
        } else if (parentRecord.expanded === false) {
            return false;
        } else if (parentRecord.parentItem) {
            childParent = getParentData(parent, parentRecord.parentItem.uniqueID);
            if (childParent && parent.initialRender && !isNullOrUndefined(childParent[parent.expandStateMapping])
            && !childParent[parent.expandStateMapping]) {
                childParent.expanded = false;
                return false;
            }
            if (childParent && childParent.expanded === false) {
                return false;
            } else if (childParent) {
                return getExpandStatus(parent, childParent, parents);
            }
            return true;
        } else {
            return true;
        }
    } else {
        return true;
    }
}
/**
 * @param {ITreeData} records - Define the record for which child records has to be found
 * @returns {Object[]} - Returns child records collection
 * @hidden
 */
export function findChildrenRecords(records: ITreeData): Object[] {
    let datas: Object[] = [];
    if (isNullOrUndefined(records) || (!records.hasChildRecords && !isNullOrUndefined(records.childRecords)
     && !records.childRecords.length)) {
        return [];
    }
    if (!isNullOrUndefined(records.childRecords)) {
        const childRecords: ITreeData[] = records.childRecords.filter(items => !items.isSummaryRow);
        const keys: string[] = Object.keys(childRecords);
        for (let i: number = 0, len: number = keys.length; i < len; i++) {
            datas.push(childRecords[i]);
            if (childRecords[i].hasChildRecords || (!isNullOrUndefined(childRecords[i].childRecords) &&
         childRecords[i].childRecords.length)) {
                datas = [...datas, ...findChildrenRecords(childRecords[i])];
            }
        }
    }
    return datas;
}

/**
 * @param {TreeGrid} parent - Tree Grid instance
 * @returns {boolean} - Returns whether local data binding
 */
export function isOffline(parent: TreeGrid) : boolean {
    if (isRemoteData(parent)) {
        const dm: DataManager = <DataManager>parent.dataSource;
        return !isNullOrUndefined(dm.ready);
    }
    return true;
}

/**
 * @param {Object[]} array - Defines the array to be cloned
 * @returns {Object[]} - Returns cloned array collection
 */
export function extendArray(array: Object[]): Object[] {
    const objArr: Object[] = []; let obj: Object ; let keys: string[];
    for (let i: number = 0; array && i < array.length; i++) {
        keys = Object.keys(array[i]); obj = {};
        for (let j: number = 0; j < keys.length; j++) {
            obj[keys[j]] = array[i][keys[j]];
        }
        objArr.push(obj);
    }
    return objArr;
}

/**
 * @param {ITreeData} value - Defined the dirty data to be cleaned
 * @returns {ITreeData} - Returns cleaned original data
 */
export function getPlainData(value: ITreeData): ITreeData {
    delete value.hasChildRecords; delete value.childRecords; delete value.index; delete value.parentItem;
    delete value.level; delete value.taskData;  delete value.uniqueID;
    return value;
}

/**
 * @param {TreeGrid} parent - TreeGrid instance
 * @param {string} value - IdMapping field name
 * @param {boolean} requireFilter - Specified whether treegrid data is filtered
 * @returns {ITreeData} - Returns IdMapping matched record
 */
export function getParentData(parent: TreeGrid, value: string, requireFilter?: boolean) : ITreeData {
    if (requireFilter) {
        const idFilter: string = 'uniqueIDFilterCollection';
        return parent[idFilter][value];
    } else {
        const id: string = 'uniqueIDCollection';
        return parent[id][value];
    }
}

/**
 * @param {HTMLTableRowElement} el - Row element
 * @returns {boolean} - Returns whether hidden
 */
export function isHidden(el: HTMLTableRowElement): boolean {
    const style: CSSStyleDeclaration = window.getComputedStyle(el);
    return ((style.display === 'none') || (style.visibility === 'hidden'));
}
