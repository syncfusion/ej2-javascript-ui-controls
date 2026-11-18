import { extend, isNullOrUndefined, setValue, getValue, addClass, removeClass } from '@syncfusion/ej2-base';
import { DataManager, Query, DataUtil, QueryOptions, ReturnOption, ParamOption, Group } from '@syncfusion/ej2-data';
import { ITreeData, RowExpandedEventArgs } from './interface';
import { TreeGrid } from './treegrid';
import { showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { getObject, BeforeDataBoundArgs, VirtualContentRenderer, getUid, Row, Column } from '@syncfusion/ej2-grids';
import { NotifyArgs, SaveEventArgs, Action, VirtualInfo } from '@syncfusion/ej2-grids';
import { isRemoteData, isOffline, isCountRequired, getExpandStatus } from '../utils';
import * as events from './constant';

/**
 * Internal dataoperations for tree grid
 *
 * @hidden
 */
export class DataManipulation {
    //Internal variables
    private taskIds: Object[];
    private parentItems: Object[];
    private zerothLevelData: BeforeDataBoundArgs;
    private storedIndex: number;
    private batchChanges: Object;
    private addedRecords: string = 'addedRecords';
    private parent: TreeGrid;
    private dataResults: ReturnOption;
    private sortedData: Object[];
    private hierarchyData: Object[];
    private isSelfReference: boolean;
    private isSortAction: boolean;
    private enableCollapseAll: boolean;
    private uniqueIDCollection: { [key: string]: ITreeData };
    private childMapping: string;
    private hasChildMapping: string;
    private expandStateMapping: string;
    private parentIdMapping: string;
    private idMapping: string;
    private cachedElementId: string;
    private enableVirtualization: boolean;
    private loadChildOnDemand: boolean;
    private initialRender: boolean;
    private isCountRequired: boolean;
    private rowDragAndDropTargetID: string;
    private isVirtualRemote: boolean;
    private isRemoteData: boolean;
    private remoteCollapsedList: Object[];
    private infiniteScrollData: Object[];
    constructor(grid: TreeGrid) {
        this.parent = grid;
        this.parentItems = [];
        this.taskIds = [];
        this.hierarchyData = [];
        this.storedIndex = -1;
        this.sortedData = [];
        this.isSortAction = false;
        this.addEventListener();
        this.dataResults = <ReturnOption>{};
        this.isSelfReference = !isNullOrUndefined(this.parent.parentIdMapping);
        this.enableCollapseAll = this.parent.enableCollapseAll;
        this.uniqueIDCollection = this.parent.uniqueIDCollection;
    }

    /**
     * @hidden
     * @returns {void}
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
     * @returns {void}
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
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
        this.hierarchyData = null;
    }

    /**
     * @hidden
     * @returns {boolean} -Returns whether remote data binding
     */
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
     *
     * @param {Object} data - Provide tree grid datasource to convert to flat data
     * @hidden
     * @returns {void}
     */
    public convertToFlatData(data: Object): void {
        this.parent.flatData = <Object[]>(!isNullOrUndefined(data) && Object.keys(data).length === 0
            && !(this.parent.dataSource instanceof DataManager) ?
            this.parent.dataSource : []);
        this.parent.parentData = [];
        if ((isRemoteData(this.parent) && !isOffline(this.parent)) && data instanceof DataManager && !(data instanceof Array)) {
            const dm: DataManager = <DataManager>this.parent.dataSource;
            if (this.parent.parentIdMapping) {
                this.parent.query = isNullOrUndefined(this.parent.query) ?
                    new Query() : this.parent.query;
                const filterKey: Object[] = this.parent.query.params.filter((param: ParamOption) => param.key === 'IdMapping');
                if (this.parent.initialRender && !filterKey.length) {
                    this.parent.query.where(this.parent.parentIdMapping, 'equal', null);
                    this.parent.query.addParams('IdMapping', this.parent.idMapping);
                }
                if (!this.parent.hasChildMapping) {
                    let qry: Query = this.parent.query.clone();
                    qry.queries = [];
                    qry = qry.select([this.parent.parentIdMapping]);
                    qry.isCountRequired = true;
                    dm.executeQuery(qry).then((e: ReturnOption) => {
                        this.parentItems = DataUtil.distinct(<Object[]>e.result, this.parent.parentIdMapping, false);
                        let req: number;
                        if (<Object[]>e.result) {
                            req = 0;
                        } else {
                            req = 1;
                        }
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
            this.convertJSONData(data);
        }
    }

    private convertJSONData(data: Object): void {
        this.hierarchyData = [];
        this.taskIds = [];
        if (!this.parent.idMapping) {
            this.hierarchyData = <Object[]>data;
        } else {
            const idMapping: string = this.parent.idMapping;
            const keys: string[] = Object.keys(data);
            for (let i: number = 0; i < keys.length; i++) {
                const tempData: Object = data[parseInt(i.toString(), 10)];
                this.hierarchyData.push(extend({}, tempData));
                if (!isNullOrUndefined(tempData[`${idMapping}`])) {
                    this.taskIds.push(tempData[`${idMapping}`]);
                }
            }
        }
        if (this.isSelfReference) {
            const selfData: ITreeData[] = [];
            const childMapping: string = this.parent.childMapping;
            const mappingData: Object[] = new DataManager(this.hierarchyData).executeLocal(
                new Query()
                    .group(this.parent.parentIdMapping)
            );
            for (let i: number = 0; i < mappingData.length; i++) {
                const groupData: Group = mappingData[parseInt(i.toString(), 10)];
                const index: number = this.taskIds.indexOf(groupData.key);
                if (!isNullOrUndefined(groupData.key)) {
                    if (index > -1) {
                        const childData: Object[] = (groupData.items);
                        this.hierarchyData[parseInt(index.toString(), 10)][`${childMapping}`] = childData;
                        continue;
                    }
                }
                selfData.push(...groupData.items);
            }
            this.hierarchyData = this.selfReferenceUpdate(selfData);
        }
        if (!Object.keys(this.hierarchyData).length) {
            const isGantt: string = 'isGantt';
            const referenceData: boolean = !(this.parent.dataSource instanceof DataManager) && this.parent[`${isGantt}`];
            this.parent.flatData = referenceData ? <Object[]>(this.parent.dataSource) : [];
        } else {
            this.createRecords(this.hierarchyData);
        }
        this.storedIndex = -1;
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
        const result: ITreeData[] = [];
        for (let i: number = 0; i < this.hierarchyData.length && selfData.length > 0; i++) {
            const index: number = selfData.indexOf(this.hierarchyData[parseInt(i.toString(), 10)]);
            if (index !== -1) {
                result.push(this.hierarchyData[parseInt(i.toString(), 10)]);
                selfData.splice(index, 1);
            }
        }
        return result;
    }
    /**
     * Function to update the zeroth level parent records in remote binding
     *
     * @param {BeforeDataBoundArgs} args - contains data before its bounds to tree grid
     * @hidden
     * @returns {void}
     */
    private updateParentRemoteData(args?: BeforeDataBoundArgs): void {
        const actionArgs: string = 'actionArgs';
        if (isRemoteData(this.parent) && this.parent.enableVirtualization && args[`${actionArgs}`].requestType === 'virtualscroll') {
            this.parent.hideSpinner();
        }
        const records: ITreeData[] = args.result;
        if (isRemoteData(this.parent) && this.parent.enableVirtualization && (args[`${actionArgs}`].requestType === 'virtualscroll' || args[`${actionArgs}`].action === 'clearFilter' || args[`${actionArgs}`].searchString === '')) {
            this.parent.query.expands = [];
        }
        if (!this.parent.hasChildMapping && !this.parentItems.length &&
            (this.parent.loadChildOnDemand)) {
            this.zerothLevelData = args;
            setValue('cancel', true, args);
        } else {
            if (this.parent.loadChildOnDemand) {
                const isRemote: boolean = isRemoteData(this.parent);
                const enableVirtualization: boolean = this.parent.enableVirtualization;
                const parentIdMapping: string = this.parent.parentIdMapping;
                const idMapping: string = this.parent.idMapping;
                for (let rec: number = 0; rec < records.length; rec++) {
                    if (isCountRequired(this.parent) && records[parseInt(rec.toString(), 10)].hasChildRecords &&
                        this.parent.initialRender) {
                        records[parseInt(rec.toString(), 10)].expanded = false;
                    }
                    if (isRemote && enableVirtualization) {
                        const childRecords: ITreeData[] = [];
                        records.filter((e: ITreeData): void => {
                            if (e[`${parentIdMapping}`] === records[parseInt(rec.toString(), 10)][`${idMapping}`]) {
                                childRecords.push(e);
                            }
                        });
                        if (childRecords.length) {
                            records[parseInt(rec.toString(), 10)].expanded = true;
                        }
                        else if (records[parseInt(rec.toString(), 10)].hasChildRecords) {
                            records[parseInt(rec.toString(), 10)].expanded = false;
                        }
                    }
                    if (isNullOrUndefined(records[parseInt(rec.toString(), 10)].index)) {
                        records[parseInt(rec.toString(), 10)].taskData = extend({}, records[parseInt(rec.toString(), 10)]);
                        records[parseInt(rec.toString(), 10)].uniqueID =
                            getUid(this.parent.element.id + '_data_');
                        setValue('uniqueIDCollection.' + records[parseInt(rec.toString(), 10)].uniqueID, records[parseInt(rec.toString(), 10)], this.parent);
                        if (isRemote && enableVirtualization && records[parseInt(rec.toString(), 10)][`${parentIdMapping}`] && (isNullOrUndefined(records[parseInt(rec.toString(), 10)].level) || records[parseInt(rec.toString(), 10)].level === 0)) {
                            const parentID: any = records[parseInt(rec.toString(), 10)][`${parentIdMapping}`];
                            const parentRec: any = records.find((record: any) => record[`${idMapping}`] === parentID);
                            if (parentRec) {
                                records[parseInt(rec.toString(), 10)].level = parentRec.level + 1;
                            }
                            else {
                                const parentRec: any = (args.actual as any).flatData.find((record: any) => record[`${idMapping}`] === parentID);
                                if (isNullOrUndefined(parentRec[`${parentIdMapping}`])) {
                                    records[parseInt(rec.toString(), 10)].level = 1;
                                }
                                else {
                                    records[parseInt(rec.toString(), 10)].level = parentRec.level + 1;
                                }
                            }
                        }
                        else {
                            records[parseInt(rec.toString(), 10)].level = 0;
                        }
                        records[parseInt(rec.toString(), 10)].index = Math.ceil(Math.random() * 1000);
                        if ((records[parseInt(rec.toString(), 10)][this.parent.hasChildMapping] ||
                            this.parentItems.indexOf(records[parseInt(rec.toString(), 10)][`${idMapping}`]) !== -1)) {
                            records[parseInt(rec.toString(), 10)].hasChildRecords = true;
                        }
                        records[parseInt(rec.toString(), 10)].checkboxState = 'uncheck';
                    }
                }
            } else {
                const dataResults: string = 'dataResults';
                const expandRecord: string = 'expandRecord';
                if (!isNullOrUndefined(records) && !((!this.parent.loadChildOnDemand) && isCountRequired(this.parent) && !isNullOrUndefined(this.parent[`${dataResults}`][`${expandRecord}`])) &&
                    !(isRemoteData(this.parent) && !this.parent.loadChildOnDemand && args[`${actionArgs}`].isExpandCollapse && this.parent.enableVirtualization)) {
                    this.convertToFlatData(records);
                }
            }
        }
        if (isRemoteData(this.parent) && !this.parent.loadChildOnDemand && args[`${actionArgs}`].isExpandCollapse && this.parent.enableVirtualization) {
            args.result = records;
        }
        else if (isRemoteData(this.parent) && this.parent.enableVirtualization && this.parent.loadChildOnDemand) {
            args.result = records;
        }
        else {
            args.result = !this.parent.loadChildOnDemand ? this.parent.flatData : records;
        }
        if (isRemoteData(this.parent) && this.parent.enableVirtualization && !this.parent.loadChildOnDemand
            && this.parent.grid.aggregates.length && this.parent.grid.sortSettings.columns.length === 0
            && this.parent.grid.filterSettings.columns.length === 0 && !this.parent.grid.searchSettings.key.length) {
            const query: string = 'query';
            const summaryQuery: QueryOptions[] = args[`${query}`].queries.filter((q: QueryOptions) => q.fn === 'onAggregates');
            args.result = this.parent.summaryModule.calculateSummaryValue(summaryQuery, this.parent.flatData, true);
        }
        this.parent.notify('updateResults', args);
    }

    /**
     * Function to manipulate datasource
     *
     * @param {{record: ITreeData, rows: HTMLTableRowElement[], parentRow: HTMLTableRowElement}} rowDetails - Row details for which child rows has to be fetched
     * @param {ITreeData} rowDetails.record - current expanding record
     * @param {HTMLTableRowElement[]} rowDetails.rows - Expanding Row element
     * @param {HTMLTableRowElement} rowDetails.parentRow  - Curent expanding row element
     * @param {boolean} isChild - Specified whether current record is already a child record
     * @hidden
     * @returns {void}
     */
    private collectExpandingRecs(rowDetails: { record: ITreeData, rows: HTMLTableRowElement[], parentRow: HTMLTableRowElement },
                                 isChild?: boolean): void {
        let gridRows: HTMLTableRowElement[] = this.parent.getRows();
        const name: string = 'name';
        if (this.parent.rowTemplate) {
            const rows: HTMLCollection = (this.parent.getContentTable() as HTMLTableElement).rows;
            gridRows = [].slice.call(rows);
        }
        let childRecord: ITreeData;
        if (rowDetails.rows.length > 0 || (this.parent.enableDomVirtualization &&
            this.parent.uniqueIDCollpaseCollection[rowDetails.record.uniqueID])) {
            if (this.parent.enableDomVirtualization) {
                this.parent.notify(events.virtualExpandCollapse, { action: 'expand', row: rowDetails.parentRow, record: rowDetails.record });
                this.parent.notify(events.localPagedExpandCollapse, { action: 'expand', row: rowDetails.parentRow, record: rowDetails.record });
            } else {
                if (!isChild) {
                    rowDetails.record.expanded = true;
                }
                const rowTemplate: string | Function = this.parent.rowTemplate;
                const loadChildOnDemand: boolean = this.parent.loadChildOnDemand;
                for (let i: number = 0; i < rowDetails.rows.length; i++) {
                    this.parent['toggleRowVisibility'](rowDetails.rows[parseInt(i.toString(), 10)], 'e-childrow-visible');
                    if (!loadChildOnDemand) {
                        const targetEle: Element = rowDetails.rows[parseInt(i.toString(), 10)].getElementsByClassName('e-treegridcollapse')[0];
                        childRecord = rowTemplate ?
                            this.parent.grid.getCurrentViewRecords()[rowDetails.rows[parseInt(i.toString(), 10)].rowIndex] :
                            this.parent.grid.getRowObjectFromUID(rowDetails.rows[parseInt(i.toString(), 10)].getAttribute('data-uid')).data;
                        if (!isNullOrUndefined(targetEle) && childRecord.expanded) {
                            addClass([targetEle], 'e-treegridexpand');
                            removeClass([targetEle], 'e-treegridcollapse');
                        }
                        let childRows: HTMLTableRowElement[] = [];
                        childRows = gridRows.filter(
                            (r: HTMLTableRowElement) =>
                                r.querySelector(
                                    '.e-gridrowindex' + childRecord.index + 'level' + (childRecord.level + 1)
                                )
                        );
                        if (childRows.length && childRecord.expanded) {
                            this.collectExpandingRecs({ record: childRecord, rows: childRows, parentRow: rowDetails.parentRow }, true);
                        }
                    }
                    const expandingTd: Element = rowDetails.rows[parseInt(i.toString(), 10)].querySelector('.e-detailrowcollapse');
                    if (!isNullOrUndefined(expandingTd)) {
                        this.parent.grid.detailRowModule.expand(expandingTd);
                    }
                }
                this.parent.grid.pageSettings.totalRecordsCount += rowDetails.rows.length;
            }
        } else {
            this.fetchRemoteChildData({ action: rowDetails[`${name}`], record: rowDetails.record, rows: rowDetails.rows, parentRow: rowDetails.parentRow });
        }
    }

    private fetchRemoteChildData(rowDetails: {
        action: string, record: ITreeData, rows: HTMLTableRowElement[],
        parentRow: HTMLTableRowElement
    }): void {
        const args: RowExpandedEventArgs = { row: rowDetails.parentRow, data: rowDetails.record };
        const dm: DataManager = <DataManager>this.parent.dataSource;
        const query: Query = this.parent.grid.getDataModule().generateQuery();
        const clonequries: QueryOptions[] = query.queries.filter((e: QueryOptions) => e.fn !== 'onPage' && e.fn !== 'onWhere');
        query.queries = clonequries;
        query.isCountRequired = true;
        let idMappingValue: number | string = parseInt(rowDetails.record[this.parent.idMapping], 10);
        if (isNaN(idMappingValue)) {
            idMappingValue = rowDetails.record[this.parent.idMapping].toString();
        }
        if (this.parent.enableVirtualization && rowDetails.action === 'remoteExpand') {
            query.take(this.parent.grid.pageSettings.pageSize);
            const expandDetail: Object[] = [];
            expandDetail.push('ExpandingAction', idMappingValue.toString());
            query.expand(expandDetail);
        }
        else if (this.parent.enableVirtualization && rowDetails.action === 'collapse') {
            query.take(this.parent.grid.pageSettings.pageSize);
            const expandDetail: Object[] = [];
            expandDetail.push('CollapsingAction', idMappingValue.toString());
            query.expand(expandDetail);
        }
        query.where(this.parent.parentIdMapping, 'equal', rowDetails.record[this.parent.idMapping]);
        if (rowDetails.action === 'remoteExpand' && this.parent.grid.filterSettings && this.parent.grid.filterSettings.columns.length) {
            const filterqry: QueryOptions[] = this.parent.grid.getDataModule().generateQuery().queries.filter((e: QueryOptions) => e.fn !== 'onPage' && typeof e.e.predicates !== 'undefined');
            query.queries.push(filterqry[0]);
        }
        showSpinner(this.parent.element);
        dm.executeQuery(query).then((e: ReturnOption) => {
            const remoteExpandedData: string = 'remoteExpandedData';
            const remoteCollapsedData: string = 'remoteCollapsedData';
            const level: string = 'level';
            const currentViewData: Object[] = this.parent.grid.currentViewData;
            let datas: ITreeData[] = currentViewData.slice();
            let inx: number;
            const idMapping: string = this.parent.idMapping;
            const parentIdMapping: string = this.parent.parentIdMapping;
            if (this.parent['isGantt'] && this.parent.loadChildOnDemand && this.parent.hasChildMapping) {
                for (let i: number = 0; i < currentViewData.length; i++) {
                    if (rowDetails.record[idMapping as string] === currentViewData[i as number][idMapping as string]) {
                        inx = i;
                        break;
                    }
                }
            }
            else {
                inx = datas.indexOf(rowDetails.record);
            }
            if (this.parent.enableVirtualization && (rowDetails.action === 'collapse' || rowDetails.action === 'remoteExpand')) {
                datas = [];
                for (let i: number = 0; i < inx; i++) {
                    datas.push(currentViewData[parseInt(i.toString(), 10)]);
                }
            }
            if (inx === -1) {
                this.parent.grid.getRowsObject().forEach((rows: Row<Column>) => {
                    if ((rows.data as ITreeData).uniqueID === rowDetails.record.uniqueID) {
                        inx = rows.index;
                    }
                });
            }
            const haveChild: boolean[] = getObject('actual.nextLevel', e);
            let result: ITreeData[] = <ITreeData[]>e.result;
            const resultChildData: ITreeData[] = [];
            if (rowDetails.action === 'remoteExpand' && this.parent.grid.filterModule && this.parent.grid.filterModule['value']) {
                for (let i: number = 0; i < datas.length; i++) {
                    if (Object.prototype.hasOwnProperty.call(datas[parseInt(i.toString(), 10)], parentIdMapping) && datas[parseInt(i.toString(), 10)]['' + parentIdMapping] !== null && datas[parseInt(i.toString(), 10)].level === 0) {
                        datas.splice(i, 1);
                        i--;
                    }
                }
                for (let i: number = 0; i < result.length; i++) {
                    if (rowDetails.record['' + idMapping] !== result[parseInt(i.toString(), 10)]['' + idMapping] &&
                        rowDetails.record['' + idMapping] === result[parseInt(i.toString(), 10)]['' + parentIdMapping]) {
                        if (Object.prototype.hasOwnProperty.call(result, i)) {
                            resultChildData.push(result[parseInt(i.toString(), 10)]);
                        }
                    }
                }
                result = resultChildData;
            }
            if (this.parent.enableVirtualization && rowDetails.action === 'remoteExpand') {
                rowDetails.record.childRecords = [];
                for (let i: number = 0; i < result.length; i++) {
                    if (rowDetails.record['' + idMapping] !== result[parseInt(i.toString(), 10)]['' + idMapping] &&
                        rowDetails.record['' + idMapping] === result[parseInt(i.toString(), 10)]['' + parentIdMapping] && Object.prototype.hasOwnProperty.call(result, i)) {
                        rowDetails.record.childRecords.push(result[parseInt(i.toString(), 10)]);
                    }
                }
            }
            else {
                rowDetails.record.childRecords = result;
            }
            for (let r: number = 0; r < result.length; r++) {
                const record: any = result[parseInt(r.toString(), 10)];
                if (this.parent.enableVirtualization && record[`${idMapping}`] === rowDetails.record[`${idMapping}`] && rowDetails.action === 'remoteExpand') {
                    this.parent[`${remoteExpandedData}`].push(rowDetails.record);
                }
                else if (this.parent.enableVirtualization && record[`${idMapping}`] === rowDetails.record[`${idMapping}`] && rowDetails.action === 'collapse') {
                    for (let i: number = 0; i < this.parent[`${remoteExpandedData}`].length; i++) {
                        if (rowDetails.record[`${idMapping}`] === this.parent[`${remoteExpandedData}`][parseInt(i.toString(), 10)][`${idMapping}`]) {
                            this.parent[`${remoteExpandedData}`].splice(i, 1);
                        }
                    }
                }
                record.taskData = extend({}, record);
                if (record[`${parentIdMapping}`] && this.parent.enableVirtualization && this.parent[`${remoteExpandedData}`].length) {
                    for (let i: number = 0; i < this.parent[`${remoteExpandedData}`].length; i++) {
                        if (record[`${parentIdMapping}`] === this.parent[`${remoteExpandedData}`][parseInt(i.toString(), 10)][`${idMapping}`]) {
                            record.level = this.parent[`${remoteExpandedData}`][parseInt(i.toString(), 10)][`${level}`] + 1;
                            const parentData: ITreeData = this.parent[`${remoteExpandedData}`][parseInt(i.toString(), 10)];
                            delete parentData.childRecords;
                            record.parentItem = parentData;
                            record.parentUniqueID = parentData.uniqueID;
                        }
                    }
                }
                else if (this.parent.enableVirtualization) {
                    if ((record[`${this.parent.hasChildMapping}`] ||
                        this.parentItems.indexOf(record[`${idMapping}`]) !== -1)
                        && !(haveChild && !haveChild[parseInt(r.toString(), 10)])) {
                        if (isNullOrUndefined(record[`${parentIdMapping}`])) {
                            record.level = 0;
                            if (rowDetails.action === 'remoteExpand') {
                                record.childRecords = [];
                                record.childRecords = rowDetails.record.childRecords;
                            }
                        }
                        else {
                            record.level = rowDetails.record.level;
                        }
                    }
                    else {
                        const parentData: ITreeData = extend({}, rowDetails.record);
                        delete parentData.childRecords;
                        record.parentItem = parentData;
                        record.parentUniqueID = rowDetails.record.uniqueID;
                    }
                }
                else {
                    record.level = rowDetails.record.level + 1;
                    const parentData: ITreeData = extend({}, rowDetails.record);
                    delete parentData.childRecords;
                    record.parentItem = parentData;
                    record.parentUniqueID = rowDetails.record.uniqueID;
                }
                record.index = Math.ceil(Math.random() * 1000);
                record.uniqueID = getUid(this.parent.element.id + '_data_');
                if (rowDetails.record[`${idMapping}`] === record[`${idMapping}`]) {
                    rowDetails.record.uniqueID = record.uniqueID;
                }
                record.checkboxState = 'uncheck';
                if (this.parent.enableVirtualization && isNullOrUndefined(record.level)) {
                    for (let p: number = 0; p < currentViewData.length; p++) {
                        if (currentViewData[parseInt(p.toString(), 10)][`${idMapping}`] === record[`${parentIdMapping}`]) {
                            record.level = currentViewData[parseInt(p.toString(), 10)]['level'] + 1;
                        }
                    }
                }
                setValue('uniqueIDCollection.' + record.uniqueID, record, this.parent);
                // delete result[r].parentItem.childRecords;
                if ((record[`${this.parent.hasChildMapping}`] ||
                    this.parentItems.indexOf(record[`${idMapping}`]) !== -1)
                    && !(haveChild && !haveChild[parseInt(r.toString(), 10)])) {
                    record.hasChildRecords = true;
                    if (this.parent.enableVirtualization && !this.parent.loadChildOnDemand) {
                        for (let i: number = 0; i < this.parent[`${remoteCollapsedData}`].length; i++) {
                            if (record[`${idMapping}`] === this.parent[`${remoteCollapsedData}`][parseInt(i.toString(), 10)][`${idMapping}`]) {
                                record.expanded = this.parent[`${remoteCollapsedData}`][parseInt(i.toString(), 10)]['expanded'];
                            }
                        }
                        if (rowDetails.action === 'collapse' && record[`${idMapping}`] !== rowDetails.record[`${idMapping}`] && record.expanded !== false) {
                            record.expanded = true;
                        }
                        else if (rowDetails.action === 'collapse' && record[`${idMapping}`] === rowDetails.record[`${idMapping}`]) {
                            record.expanded = false;
                            this.parent[`${remoteCollapsedData}`].push(rowDetails.record);
                        }
                        else if (rowDetails.action === 'remoteExpand') {
                            for (let i: number = 0; i < currentViewData.length; i++) {
                                if (currentViewData[parseInt(i.toString(), 10)][`${this.parent.idMapping}`] === record[`${this.parent.idMapping}`]) {
                                    result.splice(r, 1, currentViewData[parseInt(i.toString(), 10)]);
                                }
                            }
                            if (record[this.parent.idMapping] === rowDetails.record[`${this.parent.idMapping}`]) {
                                for (let i: number = 0; i < this.parent[`${remoteCollapsedData}`].length; i++) {
                                    if (rowDetails.record[`${idMapping}`] === this.parent[`${remoteCollapsedData}`][parseInt(i.toString(), 10)][`${this.parent.idMapping}`]) {
                                        this.parent[`${remoteCollapsedData}`].splice(i, 1);
                                    }
                                }
                            }
                            if (record.expanded !== false) {
                                record.expanded = true;
                            }
                        }
                    }
                    else if (this.parent.enableVirtualization && record[`${idMapping}`] === rowDetails.record[`${idMapping}`] && rowDetails.action !== 'collapse') {
                        record.expanded = true;
                    }
                    else if (!(this.parent.enableVirtualization && !this.parent.loadChildOnDemand)) {
                        record.expanded = false;
                    }
                }
                const exists: boolean = datas.some((data: any) => data[`${idMapping}`] === record[`${idMapping}`]);
                if (!exists) {
                    datas.splice(inx + r + 1, 0, record);
                }
            }
            const localIdMapping: string = idMapping;
            if (this.parent.enableVirtualization && this.parent.loadChildOnDemand) {
                datas.sort(function (firstRecord: any, secondRecord: any): number {
                    return firstRecord[`${localIdMapping}`] - secondRecord[`${localIdMapping}`];
                });
            }
            setValue('result', datas, e); setValue('action', 'beforecontentrender', e);
            this.parent.trigger(events.actionComplete, e);
            hideSpinner(this.parent.element);
            if (this.parent.grid.aggregates.length > 0 && !this.parent.enableVirtualization) {
                let gridQuery: Query = getObject('query', e);
                const result: string = 'result';
                if (isNullOrUndefined(gridQuery)) {
                    gridQuery = getValue('grid.renderModule.data', this.parent).aggregateQuery(new Query());
                }
                if (!isNullOrUndefined(gridQuery)) {
                    const summaryQuery: QueryOptions[] = gridQuery.queries.filter((q: QueryOptions) => q.fn === 'onAggregates');
                    e[`${result}`] = this.parent.summaryModule.calculateSummaryValue(summaryQuery, e[`${result}`], true);
                }
            }
            if (rowDetails.action === 'remoteExpand' && this.parent.allowPaging && this.parent.pageSettings.pageSizeMode === 'All') {
                this.parent.grid.pageSettings.totalRecordsCount = this.parent.grid.pageSettings.totalRecordsCount + result.length;
            }
            if (this.parent.enableVirtualization) {
                this.parent.grid.pageSettings.totalRecordsCount = e.count;
            }
            e.count = this.parent.grid.pageSettings.totalRecordsCount;
            let virtualArgs: NotifyArgs = {};
            if (this.parent.enableVirtualization) {
                this.remoteVirtualAction(virtualArgs);
            }
            const notifyArgs: { index: number, childData: ITreeData[] } = { index: inx, childData: result };
            if (this.parent.enableInfiniteScrolling) {
                this.parent.notify('infinite-remote-expand', notifyArgs);
            } else {
                virtualArgs = this.parent.enableDomVirtualization ? { requestType: 'refresh' } : virtualArgs;
                getValue('grid.renderModule', this.parent).dataManagerSuccess(e, virtualArgs);
            }
            this.parent.trigger(events.expanded, args);
        })
            .catch((e: object) => {
                this.parent.trigger(events.actionFailure, e);
            });
    }

    private remoteVirtualAction(virtualArgs: NotifyArgs): void {
        virtualArgs.requestType = 'refresh';
        setValue('isExpandCollapse', true, virtualArgs);
        const contentModule: VirtualContentRenderer = getValue('grid.contentModule', this.parent);
        const currentInfo: VirtualInfo = getValue('currentInfo', contentModule);
        const prevInfo: VirtualInfo = getValue('prevInfo', contentModule);
        if (currentInfo.loadNext && this.parent.grid.pageSettings.currentPage === currentInfo.nextInfo.page
            && !this.parent.loadChildOnDemand) {
            this.parent.grid.pageSettings.currentPage = prevInfo.page;
        }
    }

    private beginSorting(): void {
        this.isSortAction = true;
        if (isRemoteData(this.parent) && this.parent.enableVirtualization) {
            const index: number = this.parent.query.queries.indexOf(this.parent.query.queries.filter((q: QueryOptions) => q.fn === 'onSortBy')[0]);
            if (index !== -1) {
                this.parent.query.queries.splice(index, 1);
            }
            if (this.parent.grid.sortSettings.columns.length === 0) {
                this.parent.query.sortBy(null, null);
            }
        }
    }

    private createConvertRecords(data: Object[], parentRecords?: ITreeData): ITreeData[] {
        const treeGridData: ITreeData[] = [];
        const flatData: ITreeData[] = this.parent.flatData;
        const parentData: ITreeData[] = this.parent.parentData;
        const keys: string[] = Object.keys(data);
        let levelBase: number = 0;
        let parentItem: ITreeData | null = null;
        let parentUniqueID: string | null = null;
        if (!isNullOrUndefined(parentRecords)) {
            parentItem = { ...parentRecords } as ITreeData;
            delete parentItem.childRecords;
            delete parentItem[this.childMapping];
            if (this.isSelfReference) {
                delete parentItem.taskData[this.childMapping];
            }
            levelBase = (parentItem.level || 0) + 1;
            parentUniqueID = parentItem.uniqueID as string;
        }

        for (let i: number = 0; i < keys.length; i++) {
            const currentData: ITreeData = { ...data[parseInt(i.toString(), 10)] } as ITreeData;
            currentData.taskData = data[parseInt(i.toString(), 10)];
            if (!currentData.index) {
                this.storedIndex++;
                currentData.index = this.storedIndex;
            } else {
                this.storedIndex++;
            }
            const childMapping: Object[] = currentData[this.childMapping];
            const hasChildren: boolean = childMapping && childMapping.length > 0;
            const hasChildMapping: Object[] = currentData[this.hasChildMapping];
            currentData.hasChildRecords = ((hasChildren && !this.isCountRequired) ||
                (hasChildMapping && this.isCountRequired)) ? true : false;
            if (currentData.hasChildRecords) {
                if (this.enableCollapseAll || (!isNullOrUndefined(this.parent.dataStateChange) && !childMapping)) {
                    currentData.expanded = false;
                } else {
                    currentData.expanded = !isNullOrUndefined(currentData[`${this.expandStateMapping}`]) ? currentData[`${this.expandStateMapping}`] : true;
                }
            }
            if (this.isSelfReference && !currentData[`${this.parentIdMapping}`]) {
                parentData.push(currentData);
            }
            currentData.uniqueID = getUid(this.cachedElementId);
            this.uniqueIDCollection[currentData.uniqueID] = currentData;
            if (parentItem) {
                currentData.parentItem = parentItem;
                currentData.parentUniqueID = parentUniqueID;
                currentData.level = levelBase;
            } else {
                currentData.level = 0;
            }
            currentData.checkboxState = 'uncheck';
            if (this.isVirtualRemote) {
                if (!currentData.hasChildRecords && !currentData[`${this.parentIdMapping}`]) {
                    currentData.hasChildRecords = true;
                    const remoteCollapsedLen: number = this.remoteCollapsedList.length;
                    const currentId: ITreeData = currentData[`${this.idMapping}`];
                    for (let c: number = 0; c < remoteCollapsedLen; c++) {
                        if (this.remoteCollapsedList[parseInt(c.toString(), 10)][`${this.idMapping}`] === currentId) {
                            currentData.expanded = false;
                            break;
                        }
                    }
                }
                else if (currentData.level === 0 && !parentRecords && !currentData.hasChildRecords) {
                    currentData.level++;
                }
                if (currentData[`${this.parent.hasChildMapping}`] && currentData[`${this.expandStateMapping}`] !== undefined) {
                    currentData.expanded = currentData[`${this.expandStateMapping}`];
                    currentData.hasChildRecords = true;
                }
                flatData.push(currentData);
            }
            else if (!currentData[`${this.parentIdMapping}`] || parentItem) {
                if (!isNullOrUndefined(this.rowDragAndDropTargetID)) {
                    if (!this.parent.rowDragAndDropModule['isDuplicateData'](currentData)) {
                        flatData.push(currentData);
                    }
                } else {
                    flatData.push(currentData);
                }
                this.infiniteScrollData.push(currentData);
            }
            if (!this.isSelfReference && currentData.level === 0) {
                parentData.push(currentData);
            }
            if (hasChildren) {
                currentData.childRecords = this.createConvertRecords(childMapping, currentData);
            }
            treeGridData.push(currentData);
        }
        return treeGridData;
    }

    private createRecords(data: Object[]): ITreeData[] {
        this.childMapping = this.parent.childMapping;
        this.hasChildMapping = this.parent.hasChildMapping;
        this.expandStateMapping = this.parent.expandStateMapping;
        this.parentIdMapping = this.parent.parentIdMapping;
        this.idMapping = this.parent.idMapping;
        this.cachedElementId = this.parent.element.id + '_data_';
        this.loadChildOnDemand = this.parent.loadChildOnDemand;
        this.initialRender = this.parent.initialRender;
        this.isCountRequired = isCountRequired(this.parent);
        this.rowDragAndDropTargetID = this.parent.rowDropSettings.targetID as string;
        this.isVirtualRemote = this.parent.enableVirtualization && !this.loadChildOnDemand &&
            isRemoteData(this.parent) && !this.initialRender;
        this.isRemoteData = isRemoteData(this.parent);
        const remoteCollapsedData: string = 'remoteCollapsedData';
        this.remoteCollapsedList =  this.isVirtualRemote ? this.parent[`${remoteCollapsedData}`] : [];
        this.infiniteScrollData = this.parent['infiniteScrollData'];
        this.uniqueIDCollection = this.parent.uniqueIDCollection;
        return this.createConvertRecords(data);
    }

    /**
     * Function to perform filtering/sorting action for local data
     *
     * @param {BeforeDataBoundArgs} args - data details to be processed before binding to grid
     * @hidden
     * @returns {void}
     */
    public dataProcessor(args?: BeforeDataBoundArgs): void {
        const isExport: boolean = getObject('isExport', args); const expresults: Object = getObject('expresults', args);
        const exportType: string = getObject('exportType', args); const isPrinting: boolean = getObject('isPrinting', args);
        let dataObj: Object; const actionArgs: NotifyArgs = getObject('actionArgs', args);
        let requestType: Action = getObject('requestType', args); let actionData: Object = getObject('data', args);
        let action: string = getObject('action', args); const actionAddArgs: SaveEventArgs = actionArgs;
        const primaryKeyColumnName: string = this.parent.getPrimaryKeyFieldNames()[0];
        const dataValue: ITreeData = getObject('data', actionAddArgs);
        if ((!isNullOrUndefined(actionAddArgs)) && (!isNullOrUndefined(actionAddArgs.action)) && (actionAddArgs.action === 'add')
            && (!isNullOrUndefined(actionAddArgs.data)) && isNullOrUndefined(actionAddArgs.data[`${primaryKeyColumnName}`])) {
            actionAddArgs.data[`${primaryKeyColumnName}`] = args.result[actionAddArgs.index][`${primaryKeyColumnName}`];
            dataValue.taskData[`${primaryKeyColumnName}`] = args.result[actionAddArgs.index][`${primaryKeyColumnName}`];
        }
        if ((!isNullOrUndefined(actionArgs) && Object.keys(actionArgs).length) || requestType === 'save') {
            requestType = requestType ? requestType : actionArgs.requestType;
            actionData = actionData ? actionData : getObject('data', actionArgs);
            action = action ? action : getObject('action', actionArgs);
            if (this.parent.editSettings.mode === 'Batch') {
                this.batchChanges = this.parent.grid.editModule.getBatchChanges();
            }
            if (this.parent.isLocalData) {
                this.updateAction(actionData, action, requestType);
            }
        }
        if (isExport && !isNullOrUndefined(expresults)) {
            dataObj = expresults;
        } else {
            dataObj = isCountRequired(this.parent) ? getValue('result', this.parent.grid.dataSource) :
                this.parent.enableDomVirtualization && (action === 'collapse' || action === 'expand') ? args.result
                    : this.parent.grid.dataSource;
        }
        let results: ITreeData[] = dataObj instanceof DataManager ? (<DataManager>dataObj).dataSource.json : <ITreeData[]>dataObj;
        let count: number = isCountRequired(this.parent) ? getValue('count', this.parent.dataSource)
            : results.length;
        let gridQuery: Query = getObject('query', args);
        let filterQuery: QueryOptions[]; let searchQuery: QueryOptions[];
        if (!isNullOrUndefined(gridQuery)) {
            filterQuery = gridQuery.queries.filter((q: QueryOptions) => q.fn === 'onWhere');
            searchQuery = gridQuery.queries.filter((q: QueryOptions) => q.fn === 'onSearch');
        }
        if ((this.parent.grid.allowFiltering && this.parent.grid.filterSettings.columns.length) ||
            (this.parent.grid.searchSettings.key.length > 0) || (!isNullOrUndefined(gridQuery) &&
                (filterQuery.length || searchQuery.length) && this.parent.isLocalData)) {
            if (isNullOrUndefined(gridQuery)) {
                gridQuery = new Query(); gridQuery = getValue('grid.renderModule.data', this.parent).filterQuery(gridQuery);
                gridQuery = getValue('grid.renderModule.data', this.parent).searchQuery(gridQuery);
            }
            this.parent.getData({ query: gridQuery, isFilter: true });
            results = <ITreeData[]>this.dataResults.result; this.dataResults.result = null;
            if (this.parent.grid.aggregates.length > 0) {
                const query: Query = getObject('query', args);
                if (isNullOrUndefined(gridQuery)) {
                    gridQuery = getValue('grid.renderModule.data', this.parent).aggregateQuery(new Query());
                }
                if (!isNullOrUndefined(query)) {
                    const summaryQuery: QueryOptions[] = query.queries.filter((q: QueryOptions) => q.fn === 'onAggregates');
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
            const summaryQuery: QueryOptions[] = gridQuery.queries.filter((q: QueryOptions) => q.fn === 'onAggregates');
            results = this.parent.summaryModule.calculateSummaryValue(summaryQuery, this.parent.flatData, true);
        }
        if (this.parent.grid.sortSettings.columns.length > 0 || this.isSortAction) {
            this.isSortAction = false;
            const query: Query = getObject('query', args);
            results = this.parent.getData({ query: query, isSort: true });
            this.dataResults.result = null; this.sortedData = results; this.parent.notify('updateModel', {});
            if (this.parent.grid.aggregates.length > 0 && !isNullOrUndefined(query)) {
                const isSort: boolean = false;
                const query: Query = getObject('query', args);
                const summaryQuery: QueryOptions[] = query.queries.filter((q: QueryOptions) => q.fn === 'onAggregates');
                results = this.parent.summaryModule.calculateSummaryValue(summaryQuery, this.sortedData, isSort);
            }
        }
        count = isCountRequired(this.parent) ? getValue('count', this.parent.dataSource)
            : results.length;
        if (this.parent.enableDomVirtualization) {
            this.parent.virtualDomScrollData = results;
        }
        const temp: BeforeDataBoundArgs = this.paging(results, count, isExport, isPrinting, exportType, args);
        results = temp.result; count = temp.count;
        args.result = results; args.count = count;
        this.parent.notify('updateResults', args);
    }
    private paging(results: ITreeData[], count: number, isExport: boolean,
                   isPrinting: boolean, exportType: string, args: Object): BeforeDataBoundArgs {
        if (this.parent.allowPaging && (!isExport || exportType === 'CurrentPage')
            && (!isPrinting || this.parent.printMode === 'CurrentPage')) {
            this.parent.notify(events.pagingActions, { result: results, count: count, actionArgs: args });
            results = <ITreeData[]>this.dataResults.result;
            count = isCountRequired(this.parent) ? getValue('count', this.parent.dataSource)
                : this.dataResults.count;
        } else if ((this.parent.enableVirtualization || this.parent.enableInfiniteScrolling || this.parent.enableDomVirtualization) &&
            (!isExport || exportType === 'CurrentPage') && getValue('requestType', args) !== 'save') {
            const actArgs: Object = this.parent.enableInfiniteScrolling || this.parent.enableDomVirtualization ? args : getValue('actionArgs', args);
            this.parent.notify(events.pagingActions, { result: results, count: count, actionArgs: actArgs });
            results = <ITreeData[]>this.dataResults.result;
            count = this.dataResults.count;
        }
        const isPdfExport: string = 'isPdfExport'; const isCollapsedStatePersist: string = 'isCollapsedStatePersist';
        if ((isPrinting === true || (args[`${isPdfExport}`] && args[`${isCollapsedStatePersist}`] === true)) && this.parent.printMode === 'AllPages') {
            const actualResults: ITreeData[] = [];
            for (let i: number = 0; i < results.length; i++) {
                const expandStatus: boolean = getExpandStatus(this.parent, results[parseInt(i.toString(), 10)], this.parent.parentData);
                if (expandStatus) {
                    actualResults.push(results[parseInt(i.toString(), 10)]);
                }
            }
            results = actualResults;
            count = results.length;
        }
        const value: BeforeDataBoundArgs = { result: results, count: count };
        return value;
    }

    private updateData(dataResult: { result: ITreeData, count: number }): void {
        this.dataResults = <ReturnOption>dataResult;
    }
    private updateAction(actionData: ITreeData, action: string, requestType: string): void {
        if ((requestType === 'delete' || requestType === 'save')) {
            this.parent.notify(events.crudAction, { value: actionData, action: action || requestType });
        }
        if (requestType === 'batchsave' && this.parent.editSettings.mode === 'Batch') {
            this.parent.notify(events.batchSave, {});
        }
    }
}
