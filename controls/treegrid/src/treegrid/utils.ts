import { getObject } from '@syncfusion/ej2-grids';
import { TreeGrid } from './base/treegrid';
import { DataManager, ODataAdaptor, UrlAdaptor, AdaptorOptions } from '@syncfusion/ej2-data';
import { WebApiAdaptor, WebMethodAdaptor, CacheAdaptor } from '@syncfusion/ej2-data';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ITreeData } from './base/interface';


export function isRemoteData(parent: TreeGrid) : boolean {
  if (parent.dataSource instanceof DataManager) {
    let adaptor: AdaptorOptions = parent.dataSource.adaptor;
    return (adaptor instanceof ODataAdaptor ||
      (adaptor instanceof WebApiAdaptor) || (adaptor instanceof WebMethodAdaptor) ||
      (adaptor instanceof CacheAdaptor) || adaptor instanceof UrlAdaptor);
  }
  return false;
}

/**
 * @hidden
 */
export function findParentRecords(records: Object): Object {
  let datas: Object[]; datas = [];
  let recordsLength: number = Object.keys(records).length;
  for (let i: number = 0, len: number = recordsLength; i < len; i++) {
      let hasChild: boolean = getObject('hasChildRecords', records[i]);
      if (hasChild) {
         datas.push(records[i]);
      }
  }
  return datas;
}
/**
 * @hidden
 */
export function getExpandStatus (parent: TreeGrid, record: ITreeData, parents: ITreeData[]) : boolean {
  let parentRecord: ITreeData = isNullOrUndefined(record.parentItem) ? null :
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
 * @hidden
 */
export function findChildrenRecords(records: ITreeData): Object[] {
  let datas: Object[] = [];
  if (isNullOrUndefined(records) || !records.hasChildRecords) {
    return [];
  }
  if (!isNullOrUndefined(records.childRecords)) {
  let childRecords: ITreeData[] = records.childRecords;
  for (let i: number = 0, len: number = Object.keys(childRecords).length; i < len; i++) {
      datas.push(childRecords[i]);
      if (childRecords[i].hasChildRecords) {
        datas = [...datas, ...findChildrenRecords(childRecords[i])];
      }
  }
}
  return datas;
}

export function isOffline(parent: TreeGrid) : boolean {
  if (isRemoteData(parent)) {
    let dm: DataManager = <DataManager>parent.dataSource;
    return !isNullOrUndefined(dm.ready);
  }
  return true;
}

export function extendArray(array: Object[]): Object[] {
  let objArr: Object[] = []; let obj: Object ; let keys: string[];
  for (let i: number = 0; i < array.length; i++) {
    keys = Object.keys(array[i]); obj = {};
    for (let j: number = 0; j < keys.length; j++) {
      obj[keys[j]] = array[i][keys[j]];
    }
    objArr.push(obj);
  }
  return objArr;
}

export function getPlainData(value: ITreeData): ITreeData {
  delete value.hasChildRecords; delete value.childRecords; delete value.index; delete value.parentItem;
  delete value.level;
  return value;
}

export function getParentData(parent: TreeGrid, value: string, requireFilter?: Boolean) : ITreeData {
  if (requireFilter) {
    let idFilter: string = 'uniqueIDFilterCollection';
    return parent[idFilter][value];
  } else {
    let id: string = 'uniqueIDCollection';
    return parent[id][value];
  }
}
