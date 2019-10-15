import { extend, isNullOrUndefined, setValue, getValue, Ajax, isBlazor, addClass, removeClass } from '@syncfusion/ej2-base';
import { DataManager, Query, Group, DataUtil, QueryOptions, ReturnOption } from '@syncfusion/ej2-data';
import { ITreeData, RowExpandedEventArgs } from './interface';
import { TreeGrid } from './treegrid';
import { showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { getObject, BeforeDataBoundArgs, getUid, NotifyArgs } from '@syncfusion/ej2-grids';
import { isRemoteData, isOffline, isCountRequired } from '../utils';
import * as events from './constant';
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
  // let gridData:  DataManager = <DataManager>this.parent.dataSource;
  // return gridData.dataSource.offline !== true && gridData.dataSource.url !== undefined;
}

/**
 * Function to manipulate datasource
 * @hidden
 */
  public convertToFlatData(data: Object): void {
    this.parent.flatData = <Object[]>(Object.keys(data).length === 0 && !(this.parent.dataSource instanceof DataManager) ?
                           this.parent.dataSource : []);
    this.parent.parentData = [];
    let adaptorName: string = 'adaptorName';
    if ((isRemoteData(this.parent) && !isOffline(this.parent)) && data instanceof DataManager && !(data instanceof Array)) {
      let dm: DataManager = <DataManager>this.parent.dataSource;
      if (this.parent.parentIdMapping) {
        this.parent.query = isNullOrUndefined(this.parent.query) ?
          new Query() : this.parent.query;
        if (this.parent.parentIdMapping) {
          if (this.parent.initialRender) {
            this.parent.query.where(this.parent.parentIdMapping, 'equal', null);
            this.parent.query.addParams('IdMapping', this.parent.idMapping);
          }
        }
        if (!this.parent.hasChildMapping && !(this.parent.dataSource[adaptorName] === 'BlazorAdaptor')) {
          let qry: Query = this.parent.query.clone();
          qry.queries = [];
          qry = qry.select([this.parent.parentIdMapping]);
          qry.isCountRequired = true;
          dm.executeQuery(qry).then((e: ReturnOption) => {
             this.parentItems = DataUtil.distinct(<Object[]>e.result, this.parent.parentIdMapping, false);
             let req: number = getObject('dataSource.requests', this.parent).filter((e: Ajax) => {
              return e.httpRequest.statusText !== 'OK'; }
             ).length;
             if (req === 0) {
               setValue('grid.contentModule.isLoaded', true, this.parent);
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
        this.hierarchyData.push(extend({}, tempData));
        if (!isNullOrUndefined(tempData[this.parent.idMapping])) {
          this.taskIds.push(tempData[this.parent.idMapping]);
        }
      }
      if (this.isSelfReference) {
        let selfData: ITreeData[] = [];
        let mappingData: Object[] = new DataManager(this.hierarchyData).executeLocal(
          new Query()
            .group(this.parent.parentIdMapping)
        );
        for (let i: number = 0; i < mappingData.length; i++) {
          let groupData: Group = mappingData[i];
          let index: number = this.taskIds.indexOf(groupData.key);
          if (!isNullOrUndefined(groupData.key)) {
            if (index > -1) {
              let childData: Object[] = (groupData.items);
              this.hierarchyData[index][this.parent.childMapping] = childData;
              continue;
            }
          }
          selfData.push.apply(selfData, groupData.items);
        }
        this.hierarchyData = this.selfReferenceUpdate(selfData);
      }
      if (!Object.keys(this.hierarchyData).length) {
        this.parent.flatData = <Object[]>(!(this.parent.dataSource instanceof DataManager) ? this.parent.dataSource : []);
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
  private selfReferenceUpdate(selfData: ITreeData[]): ITreeData[] {
    let result: ITreeData[] = [];
    while (this.hierarchyData.length > 0 && selfData.length > 0) {
        let index: number = selfData.indexOf(this.hierarchyData[0]);
        if ( index === -1) {
          this.hierarchyData.shift();
        } else {
            result.push(this.hierarchyData.shift());
            selfData.splice(index, 1);
        }
    }
    return result;
  }
  /**
   * Function to update the zeroth level parent records in remote binding
   * @hidden
   */
  private updateParentRemoteData(args?: BeforeDataBoundArgs) : void {
    let records: ITreeData[] = args.result;
    let adaptorName: string = 'adaptorName';
    if (!this.parent.hasChildMapping && !this.parentItems.length &&
      (!(this.parent.dataSource[adaptorName] === 'BlazorAdaptor') && !this.parent.loadChildOnDemand)) {
      this.zerothLevelData = args;
      setValue('cancel', true, args);
    } else {
      if (!(this.parent.dataSource[adaptorName] === 'BlazorAdaptor') && !this.parent.loadChildOnDemand) {
        for (let rec: number = 0; rec < records.length; rec++) {
          if ((records[rec][this.parent.hasChildMapping] || this.parentItems.indexOf(records[rec][this.parent.idMapping]) !== -1)
            && (isNullOrUndefined(records[rec].index))) {
            records[rec].taskData = extend({}, records[rec]);
            records[rec].uniqueID = getUid(this.parent.element.id + '_data_');
            setValue('uniqueIDCollection.' + records[rec].uniqueID, records[rec], this.parent);
            records[rec].level = 0;
            records[rec].index = Math.ceil(Math.random() * 1000);
            records[rec].hasChildRecords = true;
          }
        }
      } else {
        this.convertToFlatData(records);
      }
    }
    args.result = this.parent.dataSource[adaptorName] === 'BlazorAdaptor' || this.parent.loadChildOnDemand ? this.parent.flatData : records;
    this.parent.notify('updateResults', args);
  }
  /**
   * Function to manipulate datasource
   * @hidden
   */
  private collectExpandingRecs(rowDetails: {record: ITreeData,
    rows: HTMLTableRowElement[], parentRow: HTMLTableRowElement}): void {
    let gridRows: HTMLTableRowElement[] = this.parent.getRows();
    if (this.parent.rowTemplate) {
      let rows: HTMLCollection = (this.parent.getContentTable() as HTMLTableElement).rows;
      gridRows = [].slice.call(rows);
    }
    let childRecord: ITreeData;
    let adaptorName: string = 'adaptorName';
    let args: RowExpandedEventArgs = {row: rowDetails.parentRow, data: rowDetails.record};
    if (rowDetails.rows.length > 0) {
      rowDetails.record.expanded = true;
      for (let i: number = 0; i < rowDetails.rows.length; i++) {
        rowDetails.rows[i].style.display = 'table-row';
        if ((isBlazor() && this.parent.dataSource[adaptorName] === 'BlazorAdaptor') || !this.parent.loadChildOnDemand) {
          let targetEle: Element = rowDetails.rows[i].getElementsByClassName('e-treegridcollapse')[0];
          if (!isNullOrUndefined(targetEle)) {
            addClass([targetEle], 'e-treegridexpand');
            removeClass([targetEle], 'e-treegridcollapse');
          }
          childRecord = this.parent.rowTemplate ? this.parent.grid.getCurrentViewRecords()[rowDetails.rows[i].rowIndex] :
              this.parent.grid.getRowObjectFromUID(rowDetails.rows[i].getAttribute('data-Uid')).data;
          let childRows: HTMLTableRowElement[] = gridRows.filter(
            (r: HTMLTableRowElement) =>
              r.classList.contains(
                'e-gridrowindex' + childRecord.index + 'level' + (childRecord.level + 1)
              )
          );
          if (childRows.length) {
            this.collectExpandingRecs({ record: childRecord, rows: childRows, parentRow: rowDetails.parentRow });
          }
        }
        let expandingTd: Element = rowDetails.rows[i].querySelector('.e-detailrowcollapse');
        if (!isNullOrUndefined(expandingTd)) {
          this.parent.grid.detailRowModule.expand(expandingTd);
        }
      }
    } else {
      let dm: DataManager = <DataManager>this.parent.dataSource;
      let qry: Query = this.parent.grid.getDataModule().generateQuery();
      let clonequries: QueryOptions[] = qry.queries.filter((e: QueryOptions) => e.fn !== 'onPage' && e.fn !== 'onWhere');
      qry.queries = clonequries;
      qry.isCountRequired = true;
      qry.where(this.parent.parentIdMapping, 'equal', rowDetails.record[this.parent.idMapping]);
      showSpinner(this.parent.element);
      dm.executeQuery(qry).then((e: ReturnOption) => {
        let datas: ITreeData[] = this.parent.grid.currentViewData;
        let inx: number = datas.indexOf(rowDetails.record);
        let haveChild: boolean[] = getObject('actual.nextLevel', e);
        let result: ITreeData[] = <ITreeData[]>e.result;
        rowDetails.record.childRecords = result;
        for (let r: number = 0; r < result.length; r++) {
          result[r].taskData = extend({}, result[r]);
          result[r].level = rowDetails.record.level + 1;
          result[r].index = Math.ceil(Math.random() * 1000);
          let parentData: ITreeData = extend({}, rowDetails.record);
          delete parentData.childRecords;
          result[r].parentItem = parentData;
          result[r].parentUniqueID = rowDetails.record.uniqueID;
          result[r].uniqueID = getUid(this.parent.element.id + '_data_');
          setValue('uniqueIDCollection.' + result[r].uniqueID, result[r], this.parent);
          // delete result[r].parentItem.childRecords;
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

  private createRecords(data: Object, parentRecords?: ITreeData): ITreeData[] {
    let treeGridData: ITreeData[] = [];
    for (let i: number = 0, len: number = Object.keys(data).length; i < len; i++) {
      let currentData: ITreeData = extend({}, data[i]);
      currentData.taskData = data[i];
      let level: number = 0;
      this.storedIndex++;
      currentData.index = this.storedIndex;
      if (!isNullOrUndefined(currentData[this.parent.childMapping]) ||
          (currentData[this.parent.hasChildMapping] && isCountRequired(this.parent))) {
        currentData.hasChildRecords = true;
        if (this.parent.enableCollapseAll || !isNullOrUndefined(this.parent.dataStateChange)
            && isNullOrUndefined(currentData[this.parent.childMapping])) {
          currentData.expanded = false;
        } else {
          currentData.expanded = !isNullOrUndefined(currentData[this.parent.expandStateMapping])
            ? currentData[this.parent.expandStateMapping] : true;
          }
      }
      currentData.index =  currentData.hasChildRecords ? this.storedIndex : this.storedIndex;
      if (this.isSelfReference && isNullOrUndefined(currentData[this.parent.parentIdMapping])) {
        this.parent.parentData.push(currentData);
      }
      currentData.uniqueID = getUid(this.parent.element.id + '_data_');
      setValue('uniqueIDCollection.' + currentData.uniqueID, currentData, this.parent);
      if (!isNullOrUndefined(parentRecords)) {
        let parentData: ITreeData = extend({}, parentRecords);
        delete parentData.childRecords;
        delete parentData[this.parent.childMapping];
        if (this.isSelfReference) {
          delete parentData.taskData[this.parent.childMapping];
        }
        currentData.parentItem = parentData;
        currentData.parentUniqueID = parentData.uniqueID;
        level = parentRecords.level + 1;
      }
      currentData.level = level;
      currentData.checkboxState = 'uncheck';
      if (isNullOrUndefined(currentData[this.parent.parentIdMapping]) || currentData.parentItem) {
        this.parent.flatData.push(currentData);
      }
      if (!this.isSelfReference && currentData.level === 0) {
        this.parent.parentData.push(currentData);
      }
      if (!isNullOrUndefined(currentData[this.parent.childMapping] && currentData[this.parent.childMapping].length )) {
          let record: ITreeData[] = this.createRecords(currentData[this.parent.childMapping], currentData);
          currentData.childRecords = record;
      }
      treeGridData.push(currentData);
    }
    return treeGridData;
  }

  /**
   * Function to perform filtering/sorting action for local data
   * @hidden
   */
  public dataProcessor(args?: BeforeDataBoundArgs) : void {
    let isExport: boolean = getObject('isExport', args);
    let expresults: Object = getObject('expresults', args);
    let exportType: string = getObject('exportType', args);
    let isPrinting: boolean = getObject('isPrinting', args);
    let dataObj: Object; let actionArgs: NotifyArgs = getObject('actionArgs', args);
    let requestType: string = getObject('requestType', args);
    let actionData: Object = getObject('data', args); let action: string = getObject('action', args);
    if ((!isNullOrUndefined(actionArgs) && Object.keys(actionArgs).length) || requestType === 'save') {
      requestType = requestType ? requestType : actionArgs.requestType.toString();
      actionData = actionData ? actionData : getObject('data', actionArgs);
      action = action ? action : getObject('action', actionArgs);
      if (action === 'add') {
        this.parent.grid.currentViewData = args.result;
      }
      if (this.parent.isLocalData) {
        if ((requestType === 'delete' || requestType === 'save')) {
          this.parent.notify(events.crudAction, { value: actionData, action: action || requestType });
        }
      }
    }
    if (isExport && !isNullOrUndefined(expresults)) {
      dataObj = expresults;
    } else {
      dataObj = isCountRequired(this.parent) ? getValue('result', this.parent.grid.dataSource)
                : this.parent.grid.dataSource;
    }
    let results: ITreeData[] = dataObj instanceof DataManager ? (<DataManager>dataObj).dataSource.json : <ITreeData[]>dataObj;
    let count: number = isCountRequired(this.parent) ? getValue('count', this.parent.dataSource)
                        : results.length;
    if ((this.parent.grid.allowFiltering && this.parent.grid.filterSettings.columns.length) ||
         (this.parent.grid.searchSettings.key.length > 0)) {
      let qry: Query = new Query(); let gridQuery: Query = getObject('query', args);
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
        if (!isNullOrUndefined(query)) {
        let summaryQuery: QueryOptions[]  = query.queries.filter((q: QueryOptions) => q.fn === 'onAggregates');
        results = this.parent.summaryModule.calculateSummaryValue(summaryQuery, results, true);
        }
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
      this.isSortAction = false; let parentData: Object;
      let action: string = 'action'; let collpasedIndexes: number[] = [];
      parentData = this.parent.parentData; let sortedData: Object[];
      let query: Query = getObject('query', args);
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
      let sortArgs: { modifiedData: ITreeData[], filteredData: ITreeData[], srtQry: Query}
      = {modifiedData: <Object[]>modifiedData, filteredData: results, srtQry: srtQry};
      this.parent.notify('createSort', sortArgs);
      results = sortArgs.modifiedData;
      this.dataResults.result = null; this.sortedData = results;
      this.parent.notify('updateModel', {});
      if (this.parent.grid.aggregates.length > 0 && !isNullOrUndefined(query)) {
        let isSort: boolean = false;
        let query: Query = getObject('query', args);
        let summaryQuery: QueryOptions[]  = query.queries.filter((q: QueryOptions) => q.fn === 'onAggregates');
        results = this.parent.summaryModule.calculateSummaryValue(summaryQuery, this.sortedData, isSort);
      }
    }
    count = isCountRequired(this.parent) ? getValue('count', this.parent.dataSource)
            : results.length;
    let temp: BeforeDataBoundArgs = this.paging(results, count, isExport, isPrinting, exportType, args);
    results = temp.result; count = temp.count;
    args.result = results; args.count = count;
    this.parent.notify('updateResults', args);
  }
  private paging(results: ITreeData[], count: number, isExport: boolean,
                 isPrinting: boolean, exportType: string, args: object): BeforeDataBoundArgs {
    if (this.parent.allowPaging && (!isExport || exportType === 'CurrentPage')
     && (!isPrinting || this.parent.printMode === 'CurrentPage'))  {
      this.parent.notify(events.pagingActions, {result: results, count: count});
      results = <ITreeData[]>this.dataResults.result;
      count = isCountRequired(this.parent) ? getValue('count', this.parent.dataSource)
              : this.dataResults.count;
    } else if (this.parent.enableVirtualization && (!isExport || exportType === 'CurrentPage')) {
      this.parent.notify(events.pagingActions, {result: results, count: count, actionArgs: getValue('actionArgs', args)});
      results = <ITreeData[]>this.dataResults.result;
      count = this.dataResults.count;
    }
    let value: BeforeDataBoundArgs = { result: results, count: count };
    return value;
  }
  /**
   * update for datasource
   */
  private updateData(dataResult: {result: ITreeData, count: number}): void {
    this.dataResults = <ReturnOption>dataResult;
  }
}
