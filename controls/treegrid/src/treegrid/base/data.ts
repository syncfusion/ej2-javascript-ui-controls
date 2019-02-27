import { extend, isNullOrUndefined, setValue, getValue, Ajax } from '@syncfusion/ej2-base';
import { DataManager, Query, Group, DataUtil, QueryOptions, ReturnOption } from '@syncfusion/ej2-data';
import { ITreeData, RowExpandedEventArgs } from './interface';
import { TreeGrid } from './treegrid';
import { showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { getObject, BeforeDataBoundArgs, iterateExtend, getUid } from '@syncfusion/ej2-grids';
import { isRemoteData, isOffline } from '../utils';
import * as events from './constant';
import { Sort } from '../actions/sort';
import { Column } from '../models';

/**
 * Internal dataoperations for tree grid 
 * @hidden
 */
export class DataManipulation {
  //Internal variables
  private taskIds: Object[];
  private parentItems: Object[];
  private zerothLevelData: BeforeDataBoundArgs;
  private storedIndex: number;
  private parent: TreeGrid;
  private dataResults: ReturnOption;
  private sortedData: Object[];
  private hierarchyData: Object[];
  private isSelfReference: boolean;
  private isSortAction: boolean;
  constructor(grid: TreeGrid) {
    this.parent = grid;
    this.parentItems = [];
    this.taskIds = [];
    this.hierarchyData = [];
    this.storedIndex = -1;
    this.sortedData = [];
    this.isSortAction = false;
    this.addEventListener();
    this.dataResults =  <ReturnOption>{};
    this.isSelfReference = !isNullOrUndefined(this.parent.parentIdMapping);
  }

    /**
     * @hidden
     */
    public addEventListener(): void {
      this.parent.on('Sorting', this.sortedRecords, this);
      this.parent.on('updateRemoteLevel', this.updateParentRemoteData, this);
      this.parent.grid.on('sorting-begin', this.beginSorting, this);
      this.parent.on('updateAction', this.updateData, this);
      this.parent.on(events.remoteExpand, this.collectExpandingRecs, this);
      this.parent.on('dataProcessor', this.dataProcessor, this);
    }

    /**
     * @hidden
     */
    public removeEventListener(): void {
      if (this.parent.isDestroyed) { return; }
      this.parent.off(events.remoteExpand, this.collectExpandingRecs);
      this.parent.off('updateRemoteLevel', this.updateParentRemoteData);
      this.parent.off('updateAction', this.updateData);
      this.parent.off('dataProcessor', this.dataProcessor);
      this.parent.off('Sorting', this.sortedRecords);
      this.parent.grid.off('sorting-begin', this.beginSorting);
    }

    /**
     * To destroy the dataModule 
     * @return {void}
     * @hidden
     */
    public destroy(): void {
      this.removeEventListener();
    }

/** @hidden */
public isRemote(): boolean {
  if (!(this.parent.dataSource instanceof DataManager)) {
    return false;
  }
  return true;
  // let gridData: DataManager = <DataManager>this.parent.dataSource;
  // return gridData.dataSource.offline !== true && gridData.dataSource.url !== undefined;
}

/**
 * Function to manipulate datasource
 * @hidden
 */
  public convertToFlatData(data: Object): void {
      this.parent.flatData = [];
      if ((isRemoteData(this.parent) && !isOffline(this.parent)) && data instanceof DataManager) {
      let dm: DataManager = <DataManager>this.parent.dataSource;
      if (this.parent.parentIdMapping) {
        this.parent.query = isNullOrUndefined(this.parent.query) ?
          new Query() : this.parent.query;
        if (this.parent.parentIdMapping) {
          this.parent.query.where(this.parent.parentIdMapping, 'equal', null);
        }
        if (!this.parent.hasChildMapping) {
          let qry: Query = this.parent.query.clone();
          qry.queries = [];
          qry = qry.select([this.parent.parentIdMapping]);
          dm.executeQuery(qry).then((e: ReturnOption) => {
             this.parentItems = DataUtil.distinct(<Object[]>e.result, this.parent.parentIdMapping, false);
             let req: number = getObject('dataSource.requests', this.parent).filter((e: Ajax) => {
              return e.httpRequest.statusText !== 'OK'; }
             ).length;
             if (req === 0) {
               setValue('grid.contentModule.isLoaded', true, this).parent;
               if (!isNullOrUndefined(this.zerothLevelData)) {
                  setValue('cancel', false, this.zerothLevelData);
                  getValue('grid.renderModule', this.parent).dataManagerSuccess(this.zerothLevelData);
                  this.zerothLevelData = null;
               }
               this.parent.grid.hideSpinner();
             }
          });
        }
      }
    } else if (data instanceof Array) {
    this.hierarchyData = [];
    this.taskIds = [];
    for (let i: number = 0; i < Object.keys(data).length; i++) {
      let tempData: Object = data[i];
      this.hierarchyData.push(extend({}, tempData, true));
      if (!isNullOrUndefined(tempData[this.parent.idMapping])) {
        this.taskIds.push(tempData[this.parent.idMapping]);
      }
    }
    let mappingData: Object[] = new DataManager(data).executeLocal(
      new Query()
        .where(this.parent.parentIdMapping, 'notequal', null)
        .group(this.parent.parentIdMapping)
    );
    //let selfData: Object[] = [];
    for (let i: number = 0; i < mappingData.length; i++) {
      let groupData: Group = mappingData[i];
      let index: number = this.taskIds.indexOf(groupData.key);
      if (index > -1) {
        if (!isNullOrUndefined(groupData.key)) {
          let childData: Object[] = iterateExtend(groupData.items);
          if (this.isSelfReference) {
            if (!this.updateChildHierarchy(this.hierarchyData, this.hierarchyData[index], childData, index)) {
              this.hierarchyData[index][this.parent.childMapping] = childData;
              if (!isNullOrUndefined(this.hierarchyData[index][this.parent.parentIdMapping])) {
                this.hierarchyData.splice(index, 1);
                this.taskIds.splice(index, 1);
              }
            }
          } else {
            this.hierarchyData[index][this.parent.childMapping] = childData;
          }
        }
      }
    }
    if (!Object.keys(this.hierarchyData).length) {
      this.parent.flatData = [];
    } else {
    this.createRecords(this.hierarchyData);
  }
    this.storedIndex = -1;
  }
  // else if (data instanceof DataManager && this.parent.isLocalData) {
  //   this.convertToFlatData(data.dataSource.json);
  // }
    //this.crudActions();
  }
  // private crudActions(): void {
  //   if (this.parent.dataSource instanceof DataManager && (this.parent.dataSource.adaptor instanceof RemoteSaveAdaptor)) {
  //     let oldUpdate: Function = this.parent.dataSource.adaptor.update;
  //     this.parent.dataSource.adaptor.update =
  //         function (dm: DataManager, keyField: string, value: Object, tableName?: string, query?: Query, original?: Object): Object {
  //                value = getPlainData(value);
  //                return oldUpdate.apply(this, [dm, keyField, value, tableName, query, original]);
  //              }
  //   }
  // }
  private updateChildHierarchy(data: Object[], currentData: ITreeData, childData: Object[], index: number): boolean {
    let parentID: string = currentData[this.parent.parentIdMapping];
    let returns: boolean = false;
    let id: string = currentData[this.parent.idMapping];
    for (let i: number = 0; i < data.length; i++) {
      if (data[i][this.parent.idMapping] === parentID) {
        let childs: Object[] = data[i][this.parent.childMapping];
        for (let j: number = 0; j < childs.length; j++) {
          if (childs[j][this.parent.idMapping] === id) {
            childs[j][this.parent.childMapping] = childData;
            this.hierarchyData.splice(index, 1);
            this.taskIds.splice(index, 1);
            return true;
          }
        }
      } else if (!isNullOrUndefined(data[i][this.parent.childMapping])) {
        returns =  this.updateChildHierarchy(data[i][this.parent.childMapping], currentData, childData, index);
      }
    }
    return returns;
  }
  /**
   * Function to update the zeroth level parent records in remote binding
   * @hidden
   */
  private updateParentRemoteData(args?: BeforeDataBoundArgs) : void {
    let records: ITreeData[] = args.result;
    if (!this.parent.hasChildMapping && !this.parentItems.length) {
      this.zerothLevelData = args;
      setValue('cancel', true, args);
    } else {
      for (let rec: number = 0; rec < records.length; rec++) {
        if ((records[rec][this.parent.hasChildMapping] || this.parentItems.indexOf(records[rec][this.parent.idMapping]) !== -1)
                      && (isNullOrUndefined(records[rec].index))) {
          records[rec].level = 0;
          records[rec].index = Math.ceil(Math.random() * 1000);
          records[rec].hasChildRecords = true;
        }
      }
    }
    args.result = records;
    this.parent.notify('updateResults', args);
  }
  /**
   * Function to manipulate datasource
   * @hidden
   */
  private collectExpandingRecs(rowDetails: {record: ITreeData, rows: HTMLTableRowElement[], parentRow: HTMLTableRowElement}): void {
    let args: RowExpandedEventArgs = {row: rowDetails.parentRow, data: rowDetails.record};
    if (rowDetails.rows.length > 0) {
      rowDetails.record.expanded = true;
      for (let i: number = 0; i < rowDetails.rows.length; i++) {
        rowDetails.rows[i].style.display = 'table-row';
      }
      this.parent.trigger(events.expanded, args);
    } else {
      let dm: DataManager = <DataManager>this.parent.dataSource;
      let qry: Query = this.parent.grid.getDataModule().generateQuery();
      let clonequries: QueryOptions[] = qry.queries.filter((e: QueryOptions) => e.fn !== 'onPage' && e.fn !== 'onWhere');
      qry.queries = clonequries;
      qry.where(this.parent.parentIdMapping, 'equal', rowDetails.record[this.parent.idMapping]);
      showSpinner(this.parent.element);
      dm.executeQuery(qry).then((e: ReturnOption) => {
        let datas: ITreeData[] = this.parent.grid.currentViewData;
        let inx: number = datas.indexOf(rowDetails.record);
        let haveChild: boolean[] = getObject('actual.nextLevel', e);
        let result: ITreeData[] = <ITreeData[]>e.result;
        for (let r: number = 0; r < result.length; r++) {
          result[r].level = rowDetails.record.level + 1;
          result[r].index = Math.ceil(Math.random() * 1000);
          result[r].parentItem = rowDetails.record;
          if ((result[r][this.parent.hasChildMapping] || this.parentItems.indexOf(result[r][this.parent.idMapping]) !== -1)
             && !(haveChild && !haveChild[r])) {
            result[r].hasChildRecords = true;
            result[r].expanded = false;
          }
          datas.splice(inx + r + 1, 0, result[r]);
        }
        setValue('result', datas, e);
        setValue('action', 'beforecontentrender', e);
        this.parent.trigger(events.actionComplete, e);
        hideSpinner(this.parent.element);
        e.count = this.parent.grid.pageSettings.totalRecordsCount;
        getValue('grid.renderModule', this.parent).dataManagerSuccess(e);
        this.parent.trigger(events.expanded, args);
      });
    }
  }
  private beginSorting(): void {
    this.isSortAction = true;
  }
  private createRecords(data: Object, parentRecords?: ITreeData): void {
    for (let i: number = 0, len: number = Object.keys(data).length; i < len; i++) {
      let currentData: ITreeData = data[i];
      let level: number = 0;
      this.storedIndex++;
      currentData.index = this.storedIndex;
      if (!isNullOrUndefined(currentData[this.parent.childMapping])) {
        currentData.childRecords = currentData[this.parent.childMapping];
        currentData.hasChildRecords = true;
        currentData.expanded = !isNullOrUndefined(currentData[this.parent.expandStateMapping])
          ? currentData[this.parent.expandStateMapping] : true;
      }
      currentData.index =  currentData.hasChildRecords ? this.storedIndex : this.storedIndex;
      if (isNullOrUndefined(currentData[this.parent.parentIdMapping])) {
        this.parent.parentData.push(currentData);
      }
      currentData.uniqueID = getUid(this.parent.element.id + '_data_');
      if (!isNullOrUndefined(parentRecords)) {
        let parentData: ITreeData = extend({}, parentRecords);
        delete parentData.childRecords;
        delete parentData[this.parent.childMapping];
        currentData.parentItem = parentData;
        currentData.parentUniqueID = parentData.uniqueID;
        level = parentRecords.level + 1;
      }
      currentData.level = level;
      if (isNullOrUndefined(currentData[this.parent.parentIdMapping]) || currentData.parentItem) {
        this.parent.flatData.push(currentData);
      }
      if (!isNullOrUndefined(currentData[this.parent.childMapping] && currentData[this.parent.childMapping].length )) {
        this.createRecords(currentData[this.parent.childMapping], currentData);
      }
    }
  }
  private sortedRecords(data: { data: Object[]; name: string }): void {
    let sortedData: Object = getObject('sortedData', data);
    this.sortedData = [];
    if (this.parent.grid.filterSettings.columns.length > 0) {
      let sortedData: Object = getObject('sortedData', data);
      let filteredData: Object[] = getObject('filteredData', data);
      for (let i: number = 0, len: number = Object.keys(sortedData).length; i < len; i++) {
        for (let j: number = 0, sortlen: number = Object.keys(filteredData).length; j < sortlen; j++) {
          let sortData: string = getObject('uniqueID', sortedData[i]);
          let filterData: string = getObject('uniqueID', filteredData[j]);
          if (sortData === filterData) {
            this.sortedData.push(sortedData[i]);
          }
        }
      }
    } else {
      for (let i: number = 0, len: number = Object.keys(sortedData).length; i < len; i++) {
        this.sortedData.push(sortedData[i]);
      }
    }
  }



  /**
   * Function to perform filtering/sorting action for local data
   * @hidden
   */
  public dataProcessor(args?: BeforeDataBoundArgs) : void {
    let dataObj: Object = this.parent.grid.dataSource;
    let results: ITreeData[] = dataObj instanceof DataManager ? (<DataManager>dataObj).dataSource.json : <ITreeData[]>dataObj;
    let count: number = results.length;
    if ((this.parent.grid.allowFiltering && this.parent.grid.filterSettings.columns.length) ||
         (this.parent.grid.searchSettings.key.length > 0)) {
      let qry: Query = new Query();
      let gridQuery: Query = getObject('query', args);
      if (isNullOrUndefined(gridQuery)) {
        gridQuery = new Query();
        gridQuery = getValue('grid.renderModule.data', this.parent).filterQuery(gridQuery);
        gridQuery = getValue('grid.renderModule.data', this.parent).searchQuery(gridQuery);
      }
      let fltrQuery: QueryOptions[]  = gridQuery.queries.filter((q: QueryOptions) => q.fn === 'onWhere');
      let srchQuery: QueryOptions[]  = gridQuery.queries.filter((q: QueryOptions) => q.fn === 'onSearch');
      qry.queries = fltrQuery.concat(srchQuery);
      let filteredData: Object = new DataManager(results).executeLocal(qry);
      this.parent.notify('updateFilterRecs', { data: filteredData });
      results = <ITreeData[]>this.dataResults.result;
      this.dataResults.result = null;
      //this.parent.filterModule.updatedFilteredRecord(filteredData);
      if (this.parent.grid.aggregates.length > 0) {
        let query: Query = getObject('query', args);
        if (isNullOrUndefined(gridQuery)) {
          gridQuery = getValue('grid.renderModule.data', this.parent).aggregateQuery(new Query());
        }
        let summaryQuery: QueryOptions[]  = query.queries.filter((q: QueryOptions) => q.fn === 'onAggregates');
        results = this.parent.summaryModule.calculateSummaryValue(summaryQuery, results, true);
      }
    }
    if (this.parent.grid.aggregates.length && this.parent.grid.sortSettings.columns.length === 0
      && this.parent.grid.filterSettings.columns.length === 0 && !this.parent.grid.searchSettings.key.length) {
        let gridQuery: Query = getObject('query', args);
        if (isNullOrUndefined(gridQuery)) {
          gridQuery = getValue('grid.renderModule.data', this.parent).aggregateQuery(new Query());
        }
        let summaryQuery: QueryOptions[]  = gridQuery.queries.filter((q: QueryOptions) => q.fn === 'onAggregates');
        results = this.parent.summaryModule.calculateSummaryValue(summaryQuery, this.parent.flatData, true);
    }
    if (this.parent.grid.sortSettings.columns.length > 0 || this.isSortAction) {
      this.isSortAction = false;
      let parentData: Object;
      let action: string = 'action'; let collpasedIndexes: number[] = [];
      if (args[action] !== 'collapse' && args[action] !== 'expand') {
        if (!this.isSelfReference && this.parent.childMapping.length > 0) {
          parentData = iterateExtend(<Object[]>this.parent.dataSource);
        } else {
          parentData = iterateExtend(<Object[]>this.parent.parentData);
        }

        let sortedData: Object[];
        let query: Query = getObject('query', args);
        this.parent.sortModule = new Sort(this.parent);
        let srtQry: Query = new Query();
        for (let srt: number = this.parent.grid.sortSettings.columns.length - 1; srt >= 0; srt--) {
          let col: Column = this.parent.getColumnByField(this.parent.grid.sortSettings.columns[srt].field);
          let compFun: Function | string = col.sortComparer && !this.isRemote() ?
            (col.sortComparer as Function).bind(col) :
            this.parent.grid.sortSettings.columns[srt].direction;
          srtQry.sortBy(this.parent.grid.sortSettings.columns[srt].field, compFun);
        }
        let modifiedData: Object = new DataManager(parentData).executeLocal(srtQry);
        sortedData = <Object[]>modifiedData;
        this.parent.notify('createSort', { modifiedData: <Object[]>modifiedData, parent: this.parent, srtQry: srtQry });
        this.parent.notify('createSortRecords', {
          modifiedData: <Object[]>modifiedData,
          parentRecords: null, filteredResult: results
        });
      }
      results = this.sortedData;
      this.parent.notify('updateModel', {});
      if (this.parent.grid.aggregates.length > 0) {
        let isSort: boolean = false;
        let query: Query = getObject('query', args);
        let summaryQuery: QueryOptions[]  = query.queries.filter((q: QueryOptions) => q.fn === 'onAggregates');
        results = this.parent.summaryModule.calculateSummaryValue(summaryQuery, this.sortedData, isSort);
      }
    }
    count = results.length;
    if (this.parent.allowPaging) {
      this.parent.notify(events.pagingActions, {result: results, count: count});
      results = <ITreeData[]>this.dataResults.result;
      count = this.dataResults.count;
    }
    /*if (isNullOrUndefined(this.dataResults.result)) {
      args.result = <ITreeData[]>results;
      args.count = count;
    } else {
      args.result = <ITreeData[]>this.dataResults.result;
      args.count = this.dataResults.count;
    }*/
    args.result = results;
    args.count = count;
    this.parent.notify('updateResults', args);
  }
  /**
   * update for datasource
   */
  private updateData(dataResult: {result: ITreeData, count: number}): void {
    this.dataResults = <ReturnOption>dataResult;
  }
}
