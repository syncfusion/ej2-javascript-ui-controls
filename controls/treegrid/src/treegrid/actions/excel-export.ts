import { TreeGrid } from '../base/treegrid';
import { ITreeData, TreeGridExcelExportProperties } from '../base/interface';
import { getObject, Grid, ExcelExport as GridExcel, ExcelExportProperties, BeforeDataBoundArgs } from '@syncfusion/ej2-grids';
import { ExcelStyle, ExcelQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';
import { ExcelRow, Row, Column } from '@syncfusion/ej2-grids';
import { isRemoteData, isOffline, getParentData, getExpandStatus } from '../utils';
import { isNullOrUndefined, setValue, Fetch, extend } from '@syncfusion/ej2-base';
import { DataManager, Query, ReturnOption } from '@syncfusion/ej2-data';
import * as event from '../base/constant';
/**
 * TreeGrid Excel Export module
 *
 * @hidden
 */
export class ExcelExport {
    private parent: TreeGrid;
    private dataResults: ReturnOption;
    private isCollapsedStatePersist: boolean = false;
    /**
     * Constructor for Excel Export module
     *
     * @param {TreeGrid} parent - Tree Grid instance
     */
    constructor(parent?: TreeGrid) {
        Grid.Inject(GridExcel);
        this.parent = parent;
        this.dataResults = <ReturnOption>{};
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     *
     * @private
     * @returns {string} Returns ExcelExport module name
     */
    protected getModuleName(): string {
        return 'ExcelExport';
    }
    /**
     * @hidden
     * @returns {void}
     */
    public addEventListener(): void {
        this.parent.on('updateResults', this.updateExcelResultModel, this);
        this.parent.on('excelCellInfo', this.excelQueryCellInfo, this);
        this.parent.grid.on('export-RowDataBound', this.exportRowDataBound, this);
        this.parent.grid.on('finalPageSetup', this.finalPageSetup, this);
    }
    /**
     * To destroy the Excel Export
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
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off('updateResults', this.updateExcelResultModel);
        this.parent.off('excelCellInfo', this.excelQueryCellInfo);
        this.parent.grid.off('export-RowDataBound', this.exportRowDataBound);
        this.parent.grid.off('finalPageSetup', this.finalPageSetup);
    }
    private updateExcelResultModel(returnResult: { result: ITreeData[], count: number }): void {
        this.dataResults = <ReturnOption>returnResult;
    }
    public Map(
        excelExportProperties?: ExcelExportProperties,
        /* eslint-disable-next-line */
        isMultipleExport?: boolean, workbook?: any, isBlob?: boolean, isCsv?: boolean) : Promise<Object> {
        const dataSource: Object = this.parent.dataSource;
        const property: Object = Object();
        setValue('isCsv', isCsv, property);
        setValue('cancel', false, property);
        if (!isNullOrUndefined(excelExportProperties)) {
            this.isCollapsedStatePersist = (excelExportProperties as TreeGridExcelExportProperties).isCollapsedStatePersist;
        }
        return new Promise((resolve: Function) => {
            const dm: DataManager = this.isLocal() && !(dataSource instanceof DataManager) ? new DataManager(dataSource)
                : <DataManager>this.parent.dataSource;
            let query: Query = new Query();
            if (!this.isLocal()) {
                query = this.generateQuery(query);
                setValue('query', query, property);
            }
            this.parent.trigger(event.beforeExcelExport, extend(property, excelExportProperties));
            if (getObject('cancel', property)) {
                return null;
            }
            dm.executeQuery(query).then((e: Object) => {
                let customData: Object = null;
                if (!isNullOrUndefined(excelExportProperties) && !isNullOrUndefined(excelExportProperties.dataSource)) {
                    customData = excelExportProperties.dataSource;
                }
                excelExportProperties = this.manipulateExportProperties(excelExportProperties, dataSource, <Fetch>e);
                return this.parent.grid.excelExportModule.Map(
                    this.parent.grid, excelExportProperties, isMultipleExport, workbook, isCsv, isBlob).then((book: Object) => {
                    if (customData != null) {
                        excelExportProperties.dataSource = customData;
                    } else {
                        delete excelExportProperties.dataSource;
                    }
                    resolve(book);
                });
            });
        });
    }
    protected generateQuery(query: Query, property?: ExcelExportProperties) : Query {
        if (!isNullOrUndefined(property) && property.exportType === 'CurrentPage'
        && this.parent.allowPaging) {
            property.exportType = 'AllPages';
            query.addParams('ExportType', 'CurrentPage');
            query.where(this.parent.parentIdMapping, 'equal', null);
            query = getObject('grid.renderModule.data.pageQuery', this.parent)(query);
        }
        return query;
    }
    protected manipulateExportProperties(property?: ExcelExportProperties, dtSrc?: Object, queryResult?: Fetch) : Object {
        //count not required for this query
        let args: BeforeDataBoundArgs = Object();
        setValue('query',  this.parent.grid.getDataModule().generateQuery(true), args);
        setValue('isExport',  true, args);
        if (!isNullOrUndefined(property) && !isNullOrUndefined(property.exportType)) {
            setValue('exportType',  property.exportType, args);
        }
        if (!this.isLocal()) {
            this.parent.parentData = [];
            this.parent.dataModule.convertToFlatData(getObject('result', queryResult));
            setValue('expresults',  this.parent.flatData, args);
        }
        this.parent.notify('dataProcessor', args);
        //args = this.parent.dataModule.dataProcessor(args);
        args = <BeforeDataBoundArgs>this.dataResults;
        dtSrc = isNullOrUndefined(args.result) ? this.parent.flatData.slice(0) : args.result;
        if (!this.isLocal()) {
            this.parent.flatData = [];
        }
        if (property && property.dataSource) {
            const flatsData: Object[] = this.parent.flatData;
            const dataSrc: Object = property.dataSource instanceof DataManager ? property.dataSource.dataSource.json : property.dataSource;
            this.parent.dataModule.convertToFlatData(dataSrc);
            dtSrc = this.parent.flatData;
            this.parent.flatData = flatsData;
        }
        property = isNullOrUndefined(property) ? Object() : property;
        property.dataSource = new DataManager({json: <Object[]>dtSrc});
        return property;
    }
    /**
     * TreeGrid Excel Export cell modifier
     *
     * @param {ExcelQueryCellInfoEventArgs} args - current cell details
     * @hidden
     * @returns {void}
     */
    private excelQueryCellInfo(args?: ExcelQueryCellInfoEventArgs) : void {
        if (this.parent.grid.getColumnIndexByUid(args.column.uid) === this.parent.treeColumnIndex) {
            const style: ExcelStyle = {};
            const data: ITreeData = <ITreeData>args.data;
            const ispadfilter: boolean = isNullOrUndefined(data.filterLevel);
            const pad: number = ispadfilter ? data.level : data.filterLevel;
            style.indent = pad;
            args.style = style;
        }
        this.parent.notify('updateResults', args);
        this.parent.trigger('excelQueryCellInfo', args);
    }
    private exportRowDataBound(excelRow: {excelRows: ExcelRow[], rowObj: Row<Column>, type: string}) : void {
        if (excelRow.type === 'excel') {
            const excelrowobj: ITreeData = excelRow.rowObj.data;
            const filtercolumnlength: number = this.parent.grid.filterSettings.columns.length;
            const rowlength: number = excelRow.excelRows.length;
            const rowlevel: number = excelrowobj.level;
            if (excelrowobj.parentItem && getParentData(this.parent, excelrowobj.parentItem.uniqueID, Boolean(filtercolumnlength))) {
                let expandedStatus: boolean = false; let sublevelState: boolean = false;
                const state: boolean = getExpandStatus(this.parent, excelrowobj, this.parent.parentData);
                if (this.isCollapsedStatePersist && (!state || !this.parent.isLocalData)) {
                    expandedStatus = true;
                    sublevelState = excelrowobj.expanded ? false : true;
                }
                excelRow.excelRows[rowlength - 1].grouping = { outlineLevel: rowlevel, isCollapsed: sublevelState,
                    isHidden: expandedStatus };
            }
            else if (excelrowobj.hasChildRecords && isNullOrUndefined(excelrowobj.parentItem)) {
                excelRow.excelRows[rowlength - 1].grouping = { outlineLevel: rowlevel};
            }
        }
    }
    /* eslint-disable-next-line */
      private finalPageSetup(workbook: any): void {
        for (let i: number = 0; i < workbook.worksheets.length; i++) {
            if (workbook.worksheets[parseInt(i.toString(), 10)].rows) {
                workbook.worksheets[parseInt(i.toString(), 10)].pageSetup = { isSummaryRowBelow: false };
            }
        }
    }
    private isLocal(): boolean {
        return !isRemoteData(this.parent) && isOffline(this.parent);
    }
}
